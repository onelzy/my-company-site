#!/usr/bin/env node
/**
 * Patches @astrojs/cloudflare v13 to restore locals.runtime.env
 * for @keystatic/astro OAuth compatibility on Cloudflare Workers.
 *
 * Problem: Astro v6 adapter removed locals.runtime.env (access throws Error).
 * Keystatic reads Worker secrets via this API for GitHub OAuth.
 *
 * Fix: modify createLocals() to accept 'env' and return it from the getter.
 * This only applies to 'output: server' mode (fetch.js).
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, '..', 'node_modules', '@astrojs', 'cloudflare', 'dist');

function patch(path, replacements) {
  let src = readFileSync(path, 'utf-8');
  let changed = false;
  for (const [old, replacement] of replacements) {
    if (src.includes(old)) {
      src = src.replace(old, replacement);
      changed = true;
    }
  }
  if (changed) {
    writeFileSync(path, src, 'utf-8');
  }
  return changed;
}

let count = 0;

// 1. cf-helpers.js: function signature + getter
count += patch(join(dist, 'utils', 'cf-helpers.js'), [
  [
    'function createLocals(ctx) {',
    'function createLocals(ctx, env) {',
  ],
  [
    `get env() {
        throw new Error(
          \`Astro.locals.runtime.env has been removed in Astro v6. Use 'import { env } from "cloudflare:workers"' instead.\`
        );
      },`,
    `get env() {
        return env;
      },`,
  ],
]) ? 1 : 0;

// 2. fetch.js: production SSR code path
count += patch(join(dist, 'fetch.js'), [
  [
    'createLocals(ctx)',
    'createLocals(ctx, env)',
  ],
]) ? 1 : 0;

// 3. handler.js: prerender code path (belt and suspenders)
count += patch(join(dist, 'utils', 'handler.js'), [
  [
    'createLocals(context);',
    'createLocals(context, env);',
  ],
]) ? 1 : 0;

console.log(count > 0 ? `✅ Patched Cloudflare adapter (${count}/3)` : '⏭️  Already patched');
