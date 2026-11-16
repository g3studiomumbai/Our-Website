#!/usr/bin/env node
/**
 * The site's photos: makes the copies the page uses, uploads them to Cloudflare R2 (served
 * at images.g3studiomumbai.com), and writes lib/photos.generated.json — each photo's size,
 * its copies and its version — for components/Photo.tsx to read.
 *
 *   npm run images        after adding, replacing or removing a photo in photos/
 *   npm run images -- --prune
 *                         also deletes from R2 the copies no photo uses any more
 *   node scripts/images.mjs --watch
 *                         what `npm run dev` keeps running alongside, so a photo dropped in
 *                         is on the page within seconds
 *
 * The originals live in photos/ (a folder per section), which is NOT committed: they are on
 * this computer and, as a backup, in R2 under originals/. What is committed is the list,
 * lib/photos.generated.json, so Vercel builds the site without needing the photos or the
 * R2 keys. The keys are in .env.local (never committed).
 *
 * Every copy's name carries the first characters of its photo's fingerprint, e.g.
 * hero/shoot-3.webp.1a2b3c4d.800.webp. A replaced photo gets new names, so browsers can
 * keep copies for a year and still never show an old photo.
 *
 * Photos in photos/lights and photos/props are cut-outs: their empty edges are trimmed and
 * each is centred in a square tile, so a chair in a wide frame is not drawn tiny.
 */
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { existsSync, watch } from 'node:fs';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

sharp.cache(false);

const root = path.resolve(import.meta.dirname, '..');
const source = path.join(root, 'photos');
const cache = path.join(root, '.cache', 'photos');
const manifest = path.join(root, 'lib', 'photos.generated.json');

/** The widths a photo is copied at, where it is wider than that to begin with. */
const WIDTHS = [400, 800, 1200];
/** The largest copy: enough for a full-screen viewer, far smaller than a camera file. */
const FULL = 2000;
/** Lights and props: square tiles, small in the strip, larger in the viewer. */
const TILE_FOLDERS = new Set(['lights', 'props']);
const TILE_WIDTHS = [200, 400];
const TILE_FULL = 800;
/** Room left round a cut-out inside its square, as a share of the square. */
const TILE_MARGIN = 0.08;
const QUALITY = 76;
const RASTER = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const TYPES = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif' };

/** The name a copy has, in R2 and in the page. Photo.tsx builds the same name. */
const keyOf = (rel, version, w) => `${rel}.${version}.${w}.webp`;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

/** The photo as it should be copied: as it is, or for a tile, trimmed and squared. */
async function prepare(buffer, tile) {
  if (!tile) {
    const { width, height } = await sharp(buffer).metadata();
    return { image: buffer, width, height };
  }
  const { data, info } = await sharp(buffer).trim().raw().toBuffer({ resolveWithObject: true });
  const side = Math.round(Math.max(info.width, info.height) / (1 - 2 * TILE_MARGIN));
  const left = Math.floor((side - info.width) / 2);
  const top = Math.floor((side - info.height) / 2);
  // Squared as raw pixels: encoding a 6000px PNG in between took seconds a photo.
  const square = await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .ensureAlpha()
    .extend({
      left,
      right: side - info.width - left,
      top,
      bottom: side - info.height - top,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { image: square, width: side, height: side };
}

/** A sharp pipeline over a prepared photo: a file's bytes, or a tile's raw pixels. */
const open = (image) =>
  Buffer.isBuffer(image) ? sharp(image) : sharp(image.data, { raw: image.info });

/** Makes (or finds already made) the copies of one photo. Returns its line in the list. */
async function copy(file, rel, buffer, version, known) {
  const tile = TILE_FOLDERS.has(rel.split('/')[0]);
  const ext = path.extname(file).toLowerCase();
  const limit = tile ? TILE_FULL : FULL;
  const steps = tile ? TILE_WIDTHS : WIDTHS;

  // Already done for this exact photo: the copies are in the cache, nothing to make.
  const done = known?.version === version && known.widths.every((w) => existsSync(path.join(cache, keyOf(rel, version, w))));
  if (done) return { line: known, made: 0 };

  const { image, width, height } = await prepare(buffer, tile);
  const largest = Math.min(width, limit);
  const widths = [...steps.filter((w) => w < largest * 0.9), largest];
  for (const w of widths) {
    let out = await open(image).resize({ width: w }).webp({ quality: QUALITY }).toBuffer();
    // A WebP already this size and smaller than our copy is used as it is.
    if (!tile && w === width && ext === '.webp' && buffer.length <= out.length) out = buffer;
    const target = path.join(cache, keyOf(rel, version, w));
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, out);
  }
  return {
    line: { width: largest, height: Math.round((height * largest) / width), widths, version },
    made: widths.length,
  };
}

/** The R2 connection, or null when the keys are not in .env.local. */
async function bucket() {
  try {
    process.loadEnvFile(path.join(root, '.env.local'));
  } catch {}
  const { R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;
  if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) return null;
  const s3 = await import('@aws-sdk/client-s3');
  const client = new s3.S3Client({
    region: 'auto',
    // The dashboard's "S3 API" address ends with the bucket's name; the client wants without.
    endpoint: R2_ENDPOINT.replace(/\/+$/, '').replace(new RegExp('/' + R2_BUCKET + '$'), ''),
    credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
  });
  return { s3, client, name: R2_BUCKET };
}

/** Every file in the bucket, by name, with its fingerprint. */
async function listing({ s3, client, name }) {
  const all = new Map();
  let token;
  do {
    const page = await client.send(new s3.ListObjectsV2Command({ Bucket: name, ContinuationToken: token }));
    for (const item of page.Contents ?? []) all.set(item.Key, item.ETag?.replaceAll('"', ''));
    token = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (token);
  return all;
}

/** Runs the jobs a few at a time. */
async function pool(jobs, size = 8) {
  let next = 0;
  const run = async () => {
    while (next < jobs.length) await jobs[next++]();
  };
  await Promise.all(Array.from({ length: size }, run));
}

async function run({ prune = false } = {}) {
  if (!existsSync(source)) {
    console.log('images: no photos/ folder here, so the list in lib/photos.generated.json is kept as it is');
    return;
  }
  const before = JSON.parse(await readFile(manifest, 'utf8').catch(() => '{}'));
  const out = {};
  const originals = {};
  let made = 0;
  for await (const file of walk(source)) {
    const ext = path.extname(file).toLowerCase();
    if (!RASTER.has(ext)) continue;
    const rel = path.relative(source, file).split(path.sep).join('/');
    const buffer = await readFile(file);
    const md5 = createHash('md5').update(buffer).digest('hex');
    const result = await copy(file, rel, buffer, md5.slice(0, 8), before[rel]);
    out[rel] = result.line;
    originals[rel] = { file, md5, type: TYPES[ext] };
    made += result.made;
  }

  const sorted = Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)));
  const json = JSON.stringify(sorted, null, 2) + '\n';
  // Written only when it changed: the dev server reloads the page on every write.
  const previous = await readFile(manifest, 'utf8').catch(() => '');
  if (json !== previous) await writeFile(manifest, json);
  console.log(`images: ${Object.keys(sorted).length} photos, ${made} copies made`);

  const r2 = await bucket();
  if (!r2) {
    console.warn(
      'images: NOT uploaded — the R2 keys are missing from .env.local, so new photos will not show until they are.',
    );
    return;
  }
  const there = await listing(r2);
  const jobs = [];
  const wanted = new Set();
  for (const [rel, line] of Object.entries(sorted)) {
    for (const w of line.widths) {
      const key = keyOf(rel, line.version, w);
      wanted.add(key);
      if (there.has(key)) continue;
      jobs.push(async () => {
        await r2.client.send(
          new r2.s3.PutObjectCommand({
            Bucket: r2.name,
            Key: key,
            Body: await readFile(path.join(cache, key)),
            ContentType: 'image/webp',
            CacheControl: 'public, max-age=31536000, immutable',
          }),
        );
      });
    }
    // The original, as a backup: sent again only when the photo changed.
    const { file, md5, type } = originals[rel];
    const key = 'originals/' + rel;
    wanted.add(key);
    if (there.get(key) !== md5) {
      jobs.push(async () => {
        await r2.client.send(
          new r2.s3.PutObjectCommand({ Bucket: r2.name, Key: key, Body: await readFile(file), ContentType: type }),
        );
      });
    }
  }
  let sent = 0;
  await pool(jobs.map((job) => () => job().then(() => void sent++)));
  console.log(`images: ${sent} files uploaded to R2 (${there.size} were there already)`);

  if (prune) {
    const stale = [...there.keys()].filter((key) => !wanted.has(key));
    await pool(stale.map((Key) => () => r2.client.send(new r2.s3.DeleteObjectCommand({ Bucket: r2.name, Key }))));
    console.log(`images: ${stale.length} files no photo uses any more deleted from R2`);
  }
}

await run({ prune: process.argv.includes('--prune') });

if (process.argv.includes('--watch') && existsSync(source)) {
  // A folder of photos dropped in at once fires many events: wait for them to settle, and
  // never run twice at the same time.
  let timer;
  let running = false;
  let again = false;
  const go = async () => {
    if (running) {
      again = true;
      return;
    }
    running = true;
    try {
      await run();
    } catch (error) {
      // A half-copied file can't be read yet; the next event (or save) tries again.
      console.error('images:', error.message);
    }
    running = false;
    if (again) {
      again = false;
      go();
    }
  };
  watch(source, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(go, 400);
  });
  console.log('images: watching photos/ for new photos');
}
