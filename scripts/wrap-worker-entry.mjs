#!/usr/bin/env node
/**
 * Post-build: wrap the Cloudflare Worker entrypoint with canonical
 * redirects (apex -> www, http -> https) at the platform entry level.
 *
 * Runs from 'astro:build:done' after the adapter has produced
 * dist/wrangler.json and dist/_worker.js/*. The wrapper is placed next
 * to the real entry chunk and wrangler.json `main` is repointed at it.
 * No node_modules patching is involved, so CF build caching cannot
 * defeat it.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname, relative, basename } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const wranglerPath = join(dist, 'wrangler.json');
const templatePath = join(root, 'scripts', 'owon-entry.template.js');

if (!existsSync(wranglerPath)) {
  console.log('wrap-worker-entry: dist/wrangler.json not found, skip');
  process.exit(0);
}

const cfg = JSON.parse(readFileSync(wranglerPath, 'utf8'));
const main = cfg.main ?? '';
console.log('wrap-worker-entry: original main =', main);

// Idempotency: if main already points at our wrapper, nothing to do.
if (main.includes('owon-entry')) {
  console.log('wrap-worker-entry: already wrapped, skip');
  process.exit(0);
}

// Locate the real entry chunk. Candidates: main as written, or the
// standard _worker.js/index.js output of @astrojs/cloudflare.
let entryChunk = null;
const candidates = [
  main ? join(dist, main) : null,
  join(dist, '_worker.js', 'index.js'),
];
for (const c of candidates) {
  if (c && existsSync(c)) { entryChunk = c; break; }
}
if (!entryChunk) {
  console.log('wrap-worker-entry: entry chunk not found, skip');
  process.exit(0);
}

const entryDir = dirname(entryChunk);
const entryName = basename(entryChunk);
const wrapperPath = join(entryDir, 'owon-entry.js');

const wrapper = readFileSync(templatePath, 'utf8').replace('__ENTRY__', entryName);
writeFileSync(wrapperPath, wrapper, 'utf8');

// Route every request through the Worker first; otherwise the CF
// static-assets layer answers asset requests without running our
// canonical-redirect wrapper at all.
if (cfg.assets && typeof cfg.assets === 'object') {
  cfg.assets.run_worker_first = ['/*'];
} else {
  cfg.assets = { run_worker_first: ['/*'] };
}

cfg.main = relative(dist, wrapperPath).split('\\').join('/');
writeFileSync(wranglerPath, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
console.log('wrap-worker-entry: wrapped', entryName, '-> main =', cfg.main);
