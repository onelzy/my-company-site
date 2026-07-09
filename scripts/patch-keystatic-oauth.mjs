#!/usr/bin/env node
/**
 * Patches @keystatic/core GitHub OAuth for Cloudflare Workers.
 *
 * Patch 1: POST body + redirect_uri in token exchange
 * Patch 2: GitHub error surfacing + default missing token fields
 * Patch 3: Cookie secure=true + expires fix
 * Patch 4: Refresh failure → 200 instead of 401 (GH OAuth Apps lack refresh_token)
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, '..', 'node_modules', '@keystatic', 'core', 'dist');
const files = ['keystatic-core-api-generic.js', 'keystatic-core-api-generic.worker.js'];

let count = 0;
let details = [];

for (const file of files) {
  const path = join(dist, file);
  let src = readFileSync(path, 'utf-8');
  let changed = false;

  // ====== Patch 1: POST body + redirect_uri ======
  const markerBefore =
    "const from = typeof fromCookie === 'string' && keystaticRouteRegex.test(fromCookie) ? fromCookie : undefined;";
  const markerAfter = 'if (!tokenRes.ok) {';
  const idxBefore = src.indexOf(markerBefore);
  const idxAfter = src.indexOf(markerAfter, idxBefore);

  if (idxBefore > 0 && idxAfter > idxBefore) {
    const oldChunk = src.substring(idxBefore + markerBefore.length, idxAfter);
    if (!oldChunk.includes('URLSearchParams')) {
      const newBlock = [
        '  const body = new URLSearchParams();',
        "  body.set('client_id', config.clientId);",
        "  body.set('client_secret', config.clientSecret);",
        "  body.set('code', code);",
        "  body.set('redirect_uri', new URL(req.url).origin + '/api/keystatic/github/oauth/callback');",
        "  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {",
        "    method: 'POST',",
        '    headers: {',
        "      'Accept': 'application/json',",
        "      'Content-Type': 'application/x-www-form-urlencoded'",
        '    },',
        '    body: body.toString()',
        '  });',
      ].join('\n');
      src = src.substring(0, idxBefore + markerBefore.length) + '\n' + newBlock + '\n' + src.substring(idxAfter);
      changed = true;
      details.push(`${file}: POST body`);
    }
  }

  // ====== Patch 2: GitHub errors + default token fields ======
  const oldTry =
    "  const _tokenData = await tokenRes.json();\n  let tokenData;\n  try {\n    tokenData = tokenDataResultType.create(_tokenData);\n  } catch {\n    return {\n      status: 401,\n      body: 'Authorization failed'\n    };\n  }";

  if (src.includes(oldTry) && !src.includes('tokenResponseDefaults')) {
    const newTry =
      "  const _tokenData = await tokenRes.json();\n  if (_tokenData.error) {\n    return {\n      status: 401,\n      body: 'Authorization failed: ' + _tokenData.error + ' - ' + (_tokenData.error_description || _tokenData.error_uri || '')\n    };\n  }\n  // GitHub OAuth Apps may omit refresh_token/expires_in — provide defaults\n  _tokenData.expires_in = _tokenData.expires_in || 28800;\n  _tokenData.refresh_token = _tokenData.refresh_token || '';\n  _tokenData.refresh_token_expires_in = _tokenData.refresh_token_expires_in || 15897600;\n  let tokenData;\n  try {\n    tokenData = tokenDataResultType.create(_tokenData);\n  } catch {\n    return {\n      status: 401,\n      body: 'Authorization failed: token parse error - ' + JSON.stringify(_tokenData)\n    };\n  }";
    src = src.replace(oldTry, newTry);
    changed = true;
    details.push(`${file}: error surfacing + defaults`);
  }

  // ====== Patch 3: Cookie secure=true + expires fix ======
  if (!src.includes('fix-cookie-secure')) {
    src = src.replace(/secure: process\.env\.NODE_ENV === 'production'/g, 'secure: true  /* fix-cookie-secure */');
    src = src.replace(
      /new Date\(Date\.now\(\) \+ tokenData\.refresh_token_expires_in \* 100\)/g,
      'new Date(Date.now() + tokenData.refresh_token_expires_in * 1000)'
    );
    changed = true;
    details.push(`${file}: cookie fixes`);
  }

  // ====== Patch 4: Refresh failure → 200 instead of 401 ======
  // GitHub OAuth Apps don't provide refresh_token, so refresh always fails.
  // Instead of 401 (which clears the UI), return 200 to keep using current token.
  const oldRefresh401 =
    "async function githubRefreshToken(req, config) {\n  const headers = await refreshGitHubAuth(req, config);\n  if (!headers) {\n    return {\n      status: 401,\n      body: 'Authorization failed'\n    };\n  }";

  if (src.includes(oldRefresh401) && !src.includes('fix-refresh-401')) {
    const newRefresh =
      "async function githubRefreshToken(req, config) {\n  const headers = await refreshGitHubAuth(req, config);\n  if (!headers) {\n    // GitHub OAuth Apps lack refresh_token — keep using current access token\n    return { status: 200, body: '' /* fix-refresh-401 */ };\n  }";
    src = src.replace(oldRefresh401, newRefresh);
    changed = true;
    details.push(`${file}: refresh 401→200`);
  }

  if (changed) {
    writeFileSync(path, src, 'utf-8');
    count++;
  }
}

if (details.length > 0) {
  console.log(`✅ Patched Keystatic core (${count}/${files.length} files):`);
  details.forEach((d) => console.log(`   - ${d}`));
} else {
  console.log('⏭️  Keystatic core already fully patched');
}
