#!/usr/bin/env node
/**
 * Patches @keystatic/core GitHub OAuth token exchange for Cloudflare Workers.
 *
 * Fixes:
 * 1. Sends OAuth params as POST body (form-encoded) instead of query string
 * 2. Adds redirect_uri to token exchange
 * 3. Surfaces GitHub error responses (GitHub returns 200 even for errors — 
 *    error is in JSON body as {error: "...", error_description: "..."})
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
let details = [];

for (const file of files) {
  const path = join(dist, file);
  let src = readFileSync(path, 'utf-8');
  let changed = false;

  // --- Patch 1: Replace token exchange from query string to POST body ---
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
    
    if (!oldChunk.includes('URLSearchParams')) {
      src = src.substring(0, idxBefore + markerBefore.length) + '\n' + newBlock + '\n' + src.substring(idxAfter);
      changed = true;
      details.push(`${file}: POST body patch`);
    }
  }

  // --- Patch 2: Expose GitHub error message (200-with-error responses) ---
  // Before: const _tokenData = await tokenRes.json();\n  let tokenData;\n  try {
  // After the try/catch we insert error-checking
  const oldTryBlock = "  const _tokenData = await tokenRes.json();\n  let tokenData;\n  try {\n    tokenData = tokenDataResultType.create(_tokenData);\n  } catch {\n    return {\n      status: 401,\n      body: 'Authorization failed'\n    };\n  }";

  if (src.includes(oldTryBlock) && !src.includes('_tokenData.error')) {
    const newTryBlock = "  const _tokenData = await tokenRes.json();\n  if (_tokenData.error) {\n    return {\n      status: 401,\n      body: 'Authorization failed: ' + _tokenData.error + ' - ' + (_tokenData.error_description || _tokenData.error_uri || '')\n    };\n  }\n  let tokenData;\n  try {\n    tokenData = tokenDataResultType.create(_tokenData);\n  } catch {\n    return {\n      status: 401,\n      body: 'Authorization failed: token parse error - ' + JSON.stringify(_tokenData)\n    };\n  }";
    src = src.replace(oldTryBlock, newTryBlock);
    changed = true;
    details.push(`${file}: GitHub error surfacing`);
  }

  // --- Patch 3: Include GitHub error body if !tokenRes.ok ---
  const old401 = "body: 'Authorization failed'\n    };\n  }";
  const err401 = "const _errBody = await tokenRes.text();\n    return {\n      status: 401,\n      body: 'Authorization failed: ' + _errBody\n    };\n  }";
  
  if (src.includes("body: 'Authorization failed'\n") && !src.includes('_errBody')) {
    src = src.replace(old401, err401);
    changed = true;
    details.push(`${file}: HTTP error surfacing`);
  }

  if (changed) {
    writeFileSync(path, src, 'utf-8');
    count++;
  }
}

if (details.length > 0) {
  console.log(`✅ Patched Keystatic core (${count}/${files.length} files):`);
  details.forEach(d => console.log(`   - ${d}`));
} else {
  console.log('⏭️  Keystatic core already fully patched');
}
