#!/usr/bin/env node
/**
 * Wraps the Cloudflare Worker entrypoint with canonical redirects
 * (apex -> www, http -> https) at the platform entry level.
 *
 * CF Workers Builds reads the ROOT wrangler.jsonc (no main field).
 * dist/wrangler.json does NOT exist in this setup. The adapter's vite
 * build writes dist/_worker.js/index.js; the wrapper is added next to
 * it AFTER astro build, then root wrangler.jsonc gets:
 *   main: "dist/_worker.js/owon-entry.js"
 *   assets.run_worker_first: ["/*"]
 *
 * Usage:
 *   node scripts/wrap-worker-entry.mjs          # after astro build
 *   node scripts/wrap-worker-entry.mjs reset    # before build (prebuild)
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const jsoncPath = join(root, 'wrangler.jsonc');
const mode = process.argv[2] ?? 'wrap';

if (!existsSync(jsoncPath)) {
  console.log('wrap-worker-entry: root wrangler.jsonc not found, skip');
  process.exit(0);
}

const jsonc = readFileSync(jsoncPath, 'utf8');

if (mode === 'reset') {
  if (jsonc.includes('owon-entry')) {
    let cleaned = jsonc
      .replace(/^\s*"main"\s*:\s*"[^"]*",\s*$/m, '')
      .replace(/"assets"\s*:\s*\{\s*\n?\s*"run_worker_first"\s*:\s*\[[^\]]*\],/, '"assets": {');
    writeFileSync(jsoncPath, cleaned, 'utf8');
    console.log('wrap-worker-entry: reset wrangler.jsonc');
  }
  process.exit(0);
}

if (jsonc.includes('owon-entry')) {
  console.log('wrap-worker-entry: already wrapped, skip');
  process.exit(0);
}

const entryChunk = join(dist, '_worker.js', 'index.js');
if (!existsSync(entryChunk)) {
  console.log('wrap-worker-entry: dist/_worker.js/index.js not found, skip');
  process.exit(0);
}

const wrapperPath = join(dirname(entryChunk), 'owon-entry.js');
const template = readFileSync(join(root, 'scripts', 'owon-entry.template.js'), 'utf8')
  .replace('__ENTRY__', basename(entryChunk));
writeFileSync(wrapperPath, template, 'utf8');

const next = jsonc
  .replace(/"assets"\s*:\s*\{/, '"main": "dist/_worker.js/owon-entry.js",\n  "assets": {\n    "run_worker_first": ["/*"],');
writeFileSync(jsoncPath, next, 'utf8');
console.log('wrap-worker-entry: wrapped -> main = dist/_worker.js/owon-entry.js');
