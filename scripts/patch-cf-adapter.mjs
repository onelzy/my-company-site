#!/usr/bin/env node
/**
 * Patches @astrojs/cloudflare's handler.js and cf-helpers.js to restore
 * locals.runtime.env for @keystatic/astro OAuth compatibility.
 *
 * Astro v6 + @astrojs/cloudflare v13 removed locals.runtime.env (throws on access).
 * Keystatic's GitHub OAuth flow reads Worker secrets via this API.
 *
 * Patch strategy:
 *   1. handler.js — set globalThis.__workerEnv = env at module load
 *   2. cf-helpers.js — check globalThis.__workerEnv before throwing
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const nm = join(__dirname, '..', 'node_modules', '@astrojs', 'cloudflare', 'dist');

// ── 1. Patch cf-helpers.js ──────────────────────────────────────────
let cfn = readFileSync(join(nm, 'utils', 'cf-helpers.js'), 'utf-8');

// Add env parameter to createLocals
if (cfn.includes('function createLocals(ctx) {')) {
  cfn = cfn.replace('function createLocals(ctx) {', 'function createLocals(ctx, env) {');
  console.log('  [cf-helpers] Added env param to createLocals');
}

// Replace throwing getter
const oldGetter = `      get env() {
        throw new Error(
          \`Astro.locals.runtime.env has been removed in Astro v6. Use 'import { env } from "cloudflare:workers"' instead.\`
        );
      },`;

if (cfn.includes(oldGetter)) {
  cfn = cfn.replace(oldGetter, `      get env() {
        return env;
      },`);
  writeFileSync(join(nm, 'utils', 'cf-helpers.js'), cfn, 'utf-8');
  console.log('  [cf-helpers] Restored runtime.env getter');
}

// ── 2. Patch handler.js — pass env to createLocals ──────────────────
let hn = readFileSync(join(nm, 'utils', 'handler.js'), 'utf-8');
if (hn.includes('createLocals(context);') && !hn.includes('createLocals(context, env)')) {
  hn = hn.replace('createLocals(context);', 'createLocals(context, env);');
  writeFileSync(join(nm, 'utils', 'handler.js'), hn, 'utf-8');
  console.log('  [handler] Pass env to createLocals');
}

// ── 3. Patch fetch.js — pass env to createLocals ────────────────────
let fn = readFileSync(join(nm, 'fetch.js'), 'utf-8');
if (fn.includes('createLocals(ctx)') && !fn.includes('createLocals(ctx, env)')) {
  fn = fn.replace('createLocals(ctx)', 'createLocals(ctx, env)');
  writeFileSync(join(nm, 'fetch.js'), fn, 'utf-8');
  console.log('  [fetch] Pass env to createLocals');
}

console.log('✅ Cloudflare adapter patched for Keystatic OAuth');
