#!/usr/bin/env node
/**
 * Wraps the Cloudflare Worker entrypoint with canonical redirects
 * (apex -> www, http -> https) at the platform entry level.
 *
 * Usage:
 *   node scripts/wrap-worker-entry.mjs          # after astro build
 *   node scripts/wrap-worker-entry.mjs reset    # before build (prebuild)
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
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
      .replace(/[\t ]*"main"\s*:\s*"[^"]*",?[\t ]*(?:\n|$)/g, '')
      .replace(/"assets"\s*:\s*\{[\t ]*\n[\t ]*"run_worker_first"\s*:\s*\[[^\]]*\],[\t ]*\n/, '"assets": {\n');
    writeFileSync(jsoncPath, cleaned, 'utf8');
    console.log('wrap-worker-entry: reset wrangler.jsonc');
  }
  process.exit(0);
}

if (jsonc.includes('owon-entry')) {
  console.log('wrap-worker-entry: already wrapped, skip');
  process.exit(0);
}

// Dump dist layout for diagnosis (GH log visible).
function dumpDist(dir, prefix, out, depth, max) {
  if (depth > 5 || out.length > max) return;
  let items;
  try { items = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const it of items) {
    const p = prefix + it.name;
    if (it.isDirectory()) { out.push(p + '/'); dumpDist(join(dir, it.name), p + '/', out, depth + 1, max); }
    else out.push(p);
  }
}

const entryCandidates = [
  join(dist, '_worker.js', 'index.js'),
  join(dist, 'server', '_worker.js', 'index.js'),
  join(dist, 'server', 'index.js'),
]

let entryChunk = null;
for (const c of entryCandidates) {
  if (existsSync(c)) { entryChunk = c; break; }
}

if (!entryChunk) {
  console.log('wrap-worker-entry: entry chunk not found, skip');
  const out = [];
  dumpDist(join(dist, 'server'), 'server/', out, 0, 90);
  console.log('server listing: ' + out.length + ' entries');
  console.log('S0: ' + out.slice(0, 45).join(' '));
  console.log('S1: ' + out.slice(45, 90).join(' '));
  try { writeFileSync(join(dist, 'marker-wrap.txt'), 'wrap-ran entry=NOT-FOUND mode=' + mode + '\\n', 'utf8'); } catch {}
  process.exit(0);
}

try { writeFileSync(join(dist, 'marker-wrap.txt'), 'wrap-ran entry=FOUND\\n', 'utf8'); } catch {}
console.log('wrap-worker-entry: entry chunk = ' + entryChunk);
const tail = readFileSync(entryChunk, 'utf8').slice(-400);
console.log('wrap-worker-entry: entry tail >>>');
console.log(tail);
console.log('<<< end tail');

const wrapperPath = join(dirname(entryChunk), 'owon-entry.js');
const template = readFileSync(join(root, 'scripts', 'owon-entry.template.js'), 'utf8')
  .replace('__ENTRY__', basename(entryChunk));
writeFileSync(wrapperPath, template, 'utf8');

const next = jsonc
  .replace(/"assets"\s*:\s*\{/, '"main": "dist/_worker.js/owon-entry.js",\n  "assets": {\n    "run_worker_first": ["/*"],');
writeFileSync(jsoncPath, next, 'utf8');
console.log('wrap-worker-entry: wrapped -> main = dist/_worker.js/owon-entry.js');
