#!/usr/bin/env node
/**
 * Patches @astrojs/cloudflare to restore locals.runtime.env
 * for @keystatic/astro OAuth compatibility.
 *
 * Astro v6 + @astrojs/cloudflare v13 removed locals.runtime.env (throws on access).
 * Keystatic reads Worker secrets (KEYSTATIC_GITHUB_CLIENT_ID, etc.) via this API.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const nm = join(__dirname, '..', 'node_modules', '@astrojs', 'cloudflare', 'dist');
const cfHelpers = join(nm, 'utils', 'cf-helpers.js');
const handler = join(nm, 'utils', 'handler.js');
const fetchJs = join(nm, 'fetch.js');

let changes = 0;

// ── cf-helpers.js: change get env() to return env instead of throwing ──
if (existsSync(cfHelpers)) {
  let src = readFileSync(cfHelpers, 'utf-8');
  const oldSig = 'function createLocals(ctx) {';
  const newSig = 'function createLocals(ctx, env) {';
  if (src.includes(oldSig)) {
    src = src.replace(oldSig, newSig);
    console.log('  [cf-helpers] Added env param to createLocals');
    changes++;
  }

  const oldGetter = /get env\(\) \{\s+throw new Error\(\s+`Astro\.locals\.runtime\.env has been removed/;
  if (oldGetter.test(src)) {
    src = src.replace(
      /(get env\(\) \{\s+)throw new Error\([\s\S]*?`,/,
      '$1return env; // restored for @keystatic/astro\n      // was: throw new Error(`Astro.locals.runtime.env has been removed...`,\n      '
    );
    writeFileSync(cfHelpers, src, 'utf-8');
    console.log('  [cf-helpers] Restored runtime.env getter');
    changes++;
  }
} else {
  console.error('❌ cf-helpers.js not found!');
  process.exit(1);
}

// ── handler.js: pass env to createLocals ────────────────────────────
if (existsSync(handler)) {
  let src = readFileSync(handler, 'utf-8');
  if (src.includes('createLocals(context);')) {
    src = src.replace('createLocals(context);', 'createLocals(context, env);');
    writeFileSync(handler, src, 'utf-8');
    console.log('  [handler] Pass env to createLocals');
    changes++;
  }
}

// ── fetch.js: pass env to createLocals (production SSR code path) ───
if (existsSync(fetchJs)) {
  let src = readFileSync(fetchJs, 'utf-8');
  if (src.includes('createLocals(ctx)') && !src.includes('createLocals(ctx, env)')) {
    src = src.replace('createLocals(ctx)', 'createLocals(ctx, env)');
    writeFileSync(fetchJs, src, 'utf-8');
    console.log('  [fetch] Pass env to createLocals');
    changes++;
  }
}

if (changes > 0) {
  console.log(`✅ Cloudflare adapter patched (${changes} changes)`);
} else {
  console.log('✅ Cloudflare adapter already patched');
}
