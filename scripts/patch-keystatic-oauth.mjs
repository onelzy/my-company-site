#!/usr/bin/env node
/**
 * Patches @keystatic/core GitHub OAuth token exchange for Cloudflare Workers.
 *
 * Fix: Sends OAuth params as POST body (form-encoded) instead of query string.
 * Also exposes GitHub's error message on failure.
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

  // Find the token exchange block by unique context markers
  // Before: "const from = typeof fromCookie..."
  // After: "if (!tokenRes.ok) {"
  const markerBefore = "const from = typeof fromCookie === 'string' && keystaticRouteRegex.test(fromCookie) ? fromCookie : undefined;";
  const markerAfter = "if (!tokenRes.ok) {";

  const idxBefore = src.indexOf(markerBefore);
  const idxAfter = src.indexOf(markerAfter, idxBefore);

  if (idxBefore > 0 && idxAfter > idxBefore) {
    const newBlock = [
      "  const body = new URLSearchParams();",
      "  body.set('client_id', config.clientId);",
      "  body.set('client_secret', config.clientSecret);",
      "  body.set('code', code);",
      "  body.set('redirect_uri', new URL(req.url).origin + '/api/keystatic/github/oauth/callback');",
      "  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {",
      "    method: 'POST',",
      "    headers: {",
      "      'Accept': 'application/json',",
      "      'Content-Type': 'application/x-www-form-urlencoded'",
      "    },",
      "    body: body.toString()",
      "  });",
    ].join('\n');

    const oldChunk = src.substring(idxBefore + markerBefore.length, idxAfter);
    
    // Only patch if not already using URLSearchParams
    if (!oldChunk.includes('URLSearchParams')) {
      // Keep everything before the old code and after the marker
      src = src.substring(0, idxBefore + markerBefore.length) + '\n' + newBlock + '\n' + src.substring(idxAfter);
      changed = true;
    }
  }

  // Patch 2: Include GitHub error message in 401 response
  const old401 = "body: 'Authorization failed'";
  if (src.includes(old401) && !src.includes('_errBody')) {
    src = src.replace(
      "if (!tokenRes.ok) {\n    return {\n      status: 401,\n      body: 'Authorization failed'\n    };\n  }",
      "if (!tokenRes.ok) {\n    const _errBody = await tokenRes.text();\n    return {\n      status: 401,\n      body: 'Authorization failed: ' + _errBody\n    };\n  }"
    );
    changed = true;
  }

  if (changed) {
    writeFileSync(path, src, 'utf-8');
    count++;
  }
}

console.log(count > 0 ? `✅ Patched Keystatic core (${count}/${files.length})` : '⏭️  Keystatic core already patched');
