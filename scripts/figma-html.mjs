#!/usr/bin/env node
/**
 * Render the built route back out as one self-contained HTML file for the Figma bridge.
 *
 * Why this exists: `figma_html` reads a single document and skips <link> entirely —
 * "External stylesheets and remote images are not fetched" — while `next build` emits the
 * CSS as separate files. Handing it `out/index.html` as-is would not fail; it would build
 * the whole page unstyled and say nothing, which is the worst kind of wrong. So the
 * emitted CSS is folded back into one <style> block, in document order, and the cascade
 * the builder reads is the one the browser reads.
 *
 *   npm run build && npm run figma
 *   → figma/index.html, which is what figma_build's `path` should point at
 *
 * Pass --with-images to also inline the photography as data: URIs. The bridge turns a
 * remote src into a placeholder rectangle, so without this the canvas gets the same grey
 * boxes the hand-written file produced. It makes the file about 3x larger.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const source = path.join(root, 'out', 'index.html');
const outDir = path.join(root, 'figma');
const target = path.join(outDir, 'index.html');
const withImages = process.argv.includes('--with-images');

const MIME = {
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

if (!existsSync(source)) {
  console.error('No build to read: ' + source + '\nRun `npm run build` first.');
  process.exit(1);
}

let html = await readFile(source, 'utf8');

/** Every stylesheet the document links, in the order it links them. */
const links = [...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*>/g)];
const hrefs = links.map((m) => m[0].match(/href="([^"]+)"/)?.[1]).filter(Boolean);

if (!hrefs.length) {
  console.error(
    'The build links no stylesheet, so there is nothing to inline and the result would ' +
      'be an unstyled tree. Refusing to write it.',
  );
  process.exit(1);
}

const sheets = [];
for (const href of hrefs) {
  const file = path.join(root, 'out', href.replace(/^\//, '').split('?')[0]);
  if (!existsSync(file)) {
    console.error('Linked stylesheet is missing from the build: ' + file);
    process.exit(1);
  }
  sheets.push(await readFile(file, 'utf8'));
}

// The <style> block replaces the first <link>; the rest go.
let first = true;
for (const link of links) {
  html = html.replace(link[0], first ? '<style>\n' + sheets.join('\n') + '\n</style>' : '');
  first = false;
}

let inlined = 0;
if (withImages) {
  const assets = [...new Set([...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((m) => m[1]))];
  for (const asset of assets) {
    const file = path.join(root, 'public', asset.replace(/^\//, ''));
    const mime = MIME[path.extname(asset).toLowerCase()];
    if (!existsSync(file) || !mime) continue;
    const data = await readFile(file);
    const uri = 'data:' + mime + ';base64,' + data.toString('base64');
    html = html.split('"' + asset + '"').join('"' + uri + '"');
    inlined += 1;
  }
}

await mkdir(outDir, { recursive: true });
await writeFile(target, html, 'utf8');

const kb = (n) => Math.round(n / 1024) + ' KB';
console.log(
  'Wrote ' + path.relative(root, target) + ' (' + kb(Buffer.byteLength(html)) + ')\n' +
    '  ' + sheets.length + ' stylesheet' + (sheets.length === 1 ? '' : 's') + ' inlined, ' +
    kb(sheets.reduce((n, s) => n + Buffer.byteLength(s), 0)) + ' of CSS' +
    (withImages ? '\n  ' + inlined + ' images inlined as data URIs' :
      '\n  images left as paths — pass --with-images for real photography on the canvas'),
);
