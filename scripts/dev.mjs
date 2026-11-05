#!/usr/bin/env node
/**
 * `npm run dev`: the Next dev server, with the photo script watching public/images beside
 * it. Without the watcher, a photo added while the server runs is missing from the list
 * of photos (lib/photos.generated.json) and the page stops with "No photo at …" until the
 * server is restarted. Anything after `npm run dev --` goes on to Next, e.g. a port.
 */
import { spawn } from 'node:child_process';

// One command string through the shell, so `next` resolves from node_modules/.bin on
// Windows too. The arguments are only ever npm's own (a port, say).
const opts = { stdio: 'inherit', shell: true };
const photos = spawn('node scripts/images.mjs --watch', opts);
const next = spawn(['next', 'dev', ...process.argv.slice(2)].join(' '), opts);

const stop = () => {
  photos.kill();
  next.kill();
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
next.on('exit', (code) => {
  photos.kill();
  process.exit(code ?? 0);
});
