#!/usr/bin/env node
/**
 * Wraps the Cloudflare Worker entrypoint (dist/server/entry.mjs) with
 * canonical redirects (apex -> www, http -> https) at platform level.
 *
 * The adapter output layout is:
 *   dist/client/           (static assets)
 *   dist/server/entry.mjs  (worker entry)
 *   dist/server/wrangler.json
 * CF Workers Builds deploys dist/server/wrangler.json, so we add a
 * wrapper chunk next to entry.mjs, repoint wrangler.json main at it,
 * and set assets.run_worker_first so asset requests reach our code.
 *
 * Usage:
 *   node scripts/wrap-worker-entry.mjs          # after astro build
 *   node scripts/wrap-worker-entry.mjs reset    # no-op (kept for compat)
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const serverDir = join(dist, 'server');
const wranglerPath = join(serverDir, 'wrangler.json');
const mode = process.argv[2] ?? 'wrap';

if (mode === 'reset') {
  console.log('wrap-worker-entry: reset no-op (server output rebuilt each time)');
  process.exit(0);
}

if (!existsSync(wranglerPath)) {
  console.log('wrap-worker-entry: dist/server/wrangler.json not found, skip');
  try { writeFileSync(join(dist, 'marker-wrap.txt'), 'wrap-ran wrangler=NOT-FOUND\\n', 'utf8'); } catch {}
  process.exit(0);
}

const entryChunk = join(serverDir, 'entry.mjs');
if (!existsSync(entryChunk)) {
  console.log('wrap-worker-entry: dist/server/entry.mjs not found, skip');
  try { writeFileSync(join(dist, 'marker-wrap.txt'), 'wrap-ran entry=NOT-FOUND\\n', 'utf8'); } catch {}
  process.exit(0);
}

const cfg = JSON.parse(readFileSync(wranglerPath, 'utf8'));
console.log('wrap-worker-entry: original main =', cfg.main);

if ((cfg.main ?? '').includes('owon-entry')) {
  console.log('wrap-worker-entry: already wrapped, skip');
  process.exit(0);
}

const wrapperPath = join(serverDir, 'owon-entry.mjs');
const template = readFileSync(join(root, 'scripts', 'owon-entry.template.js'), 'utf8')
  .replace('__ENTRY__', basename(entryChunk));
writeFileSync(wrapperPath, template, 'utf8');

cfg.main = './owon-entry.mjs';
if (cfg.assets && typeof cfg.assets === 'object') {
  cfg.assets.run_worker_first = ['/*'];
} else {
  cfg.assets = { run_worker_first: ['/*'] };
}
writeFileSync(wranglerPath, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
try { writeFileSync(join(dist, 'marker-wrap.txt'), 'wrap-ran wrapped main=' + cfg.main + '\\n', 'utf8'); } catch {}
console.log('wrap-worker-entry: wrapped -> main = ./owon-entry.mjs, run_worker_first=/*');
