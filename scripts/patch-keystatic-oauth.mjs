#!/usr/bin/env node
/**
 * Patches @keystatic/core for Cloudflare Workers compatibility.
 *
 * 1. Adds `redirect_uri` to GitHub OAuth token exchange (required by GitHub).
 * 2. Exposes GitHub's actual error message on OAuth failure (for debugging).
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, '..', 'node_modules', '@keystatic', 'core', 'dist');

const files = [
  'keystatic-core-api-generic.js',
  'keystatic-core-api-generic.worker.js',
];

let count = 0;

for (const file of files) {
  const path = join(dist, file);
  let src = readFileSync(path, 'utf-8');
  let changed = false;

  // Patch 1: Add redirect_uri to token exchange
  const oldTokenExchange = "url.searchParams.set('code', code);\n  const tokenRes = await fetch(url, {";
  if (src.includes(oldTokenExchange)) {
    const idx = src.indexOf(oldTokenExchange);
    const afterCode = src.substring(idx, idx + 300);
    if (!afterCode.includes("url.searchParams.set('redirect_uri'")) {
      const replacement = "url.searchParams.set('code', code);\n  url.searchParams.set('redirect_uri', `${new URL(req.url).origin}/api/keystatic/github/oauth/callback`);\n  const tokenRes = await fetch(url, {";
      src = src.replace(oldTokenExchange, replacement);
      changed = true;
    }
  }

  // Patch 2: Include GitHub error message in 401 response
  const old401 = "body: 'Authorization failed'";
  if (src.includes(old401)) {
    // Find the if block and add error body capture before the return
    const oldBlock = "if (!tokenRes.ok) {\n    return {\n      status: 401,\n      body: 'Authorization failed'\n    };\n  }";
    const newBlock = "if (!tokenRes.ok) {\n    const _errBody = await tokenRes.text();\n    return {\n      status: 401,\n      body: 'Authorization failed: ' + _errBody\n    };\n  }";

    if (src.includes(oldBlock)) {
      src = src.replace(oldBlock, newBlock);
      changed = true;
    } else if (src.includes(old401) && !src.includes('_errBody')) {
      // Fallback: simpler replacement if the block format differs
      src = src.replace("body: 'Authorization failed'", "body: 'Authorization failed: ' + (await tokenRes.clone().text())");
      changed = true;
    }
  }

  if (changed) {
    writeFileSync(path, src, 'utf-8');
    count++;
  }
}

console.log(count > 0 ? `✅ Patched Keystatic core (${count}/${files.length})` : '⏭️  Keystatic core already patched');
