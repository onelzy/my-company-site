#!/usr/bin/env node
/**
 * Wraps the Cloudflare Worker entrypoint (dist/server/entry.mjs) with
 * canonical redirects (apex -> www, http -> https) at platform level.
 *
 * Adapter build output layout:
 *   dist/client/           static assets
 *   dist/server/entry.mjs  worker entry
 *   dist/server/wrangler.json
 * CF Workers Builds deploys dist/server/wrangler.json, so we add a
 * wrapper chunk next to entry.mjs, repoint wrangler.json main at it,
 * and set assets.run_worker_first so asset requests reach our code
 * too (prerendered pages get the redirects as well).
 *
 * Usage: node scripts/wrap-worker-entry.mjs   (after astro build)
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const serverDir = join(dist, 'server');
const wranglerPath = join(serverDir, 'wrangler.json');

if (!existsSync(wranglerPath)) {
  console.log('wrap-worker-entry: dist/server/wrangler.json not found, skip');
  process.exit(0);
}

const entryChunk = join(serverDir, 'entry.mjs');
if (!existsSync(entryChunk)) {
  console.log('wrap-worker-entry: dist/server/entry.mjs not found, skip');
  process.exit(0);
}

const cfg = JSON.parse(readFileSync(wranglerPath, 'utf8'));
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
console.log('wrap-worker-entry: wrapped -> main = ./owon-entry.mjs, run_worker_first = /*');
