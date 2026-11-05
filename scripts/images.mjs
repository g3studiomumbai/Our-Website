#!/usr/bin/env node
/**
 * Makes the smaller copies of every photograph in public/images, so a phone is not sent a
 * desktop-sized file, and writes lib/photos.generated.json — each photo's size and which
 * copies exist — for components/Photo.tsx to read.
 *
 *   npm run images       (runs on its own before `npm run dev` and `npm run build`,
 *                         Vercel's build included, so nobody has to remember it)
 *   node scripts/images.mjs --watch
 *                        (what `npm run dev` keeps running alongside: does it again whenever
 *                         a photo is added, replaced or removed, so the page picks it up live)
 *
 * The copies go in public/images/_sized, which is not committed: they are rebuilt from the
 * originals whenever an original is newer than its copies. So adding a photo is: drop the
 * file in the right folder, mention it in content/, push.
 */
import sharp from 'sharp';
import { watch } from 'node:fs';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const images = path.join(root, 'public', 'images');
const sized = path.join(images, '_sized');
const manifest = path.join(root, 'lib', 'photos.generated.json');

/** The widths a photo is copied at, where it is wider than that to begin with. */
const WIDTHS = [400, 800, 1200];
const RASTER = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function newer(source, target) {
  try {
    return (await stat(source)).mtimeMs > (await stat(target)).mtimeMs;
  } catch {
    return true;
  }
}

async function run() {
  const out = {};
  let made = 0;
  for await (const file of walk(images)) {
    const ext = path.extname(file).toLowerCase();
    if (!RASTER.has(ext)) continue;
    const rel = path.relative(images, file).split(path.sep).join('/');
    const { width, height } = await sharp(file).metadata();
    if (!width || !height) throw new Error('Cannot read the size of public/images/' + rel);
    const widths = WIDTHS.filter((w) => w < width * 0.9);
    for (const w of widths) {
      const target = path.join(sized, rel.replace(/\.[^.]+$/, '') + '-' + w + '.webp');
      if (!(await newer(file, target))) continue;
      await mkdir(path.dirname(target), { recursive: true });
      await sharp(file).resize({ width: w }).webp({ quality: 76 }).toFile(target);
      made += 1;
    }
    out[rel] = { width, height, widths };
  }

  const sorted = Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)));
  const json = JSON.stringify(sorted, null, 2) + '\n';
  // Written only when it changed: the dev server reloads the page on every write.
  const before = await readFile(manifest, 'utf8').catch(() => '');
  if (json !== before) await writeFile(manifest, json);
  console.log(`images: ${Object.keys(sorted).length} photos, ${made} copies made`);
}

await run();

if (process.argv.includes('--watch')) {
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
  watch(images, { recursive: true }, (_event, name) => {
    if (!name || name.startsWith('_sized')) return;
    clearTimeout(timer);
    timer = setTimeout(go, 400);
  });
  console.log('images: watching public/images for new photos');
}
