#!/usr/bin/env node
/**
 * Patches @keystatic/core to add `redirect_uri` to GitHub OAuth token exchange.
 *
 * Problem: Keystatic sends `redirect_uri` during OAuth authorization but
 * omits it during token exchange. GitHub requires both to match.
 *
 * Fix: add `redirect_uri` param to the POST to github.com/login/oauth/access_token.
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

  const oldStr = `  url.searchParams.set('code', code);
  const tokenRes = await fetch(url, {`;
  const newStr = `  url.searchParams.set('code', code);
  url.searchParams.set('redirect_uri', \`\${new URL(req.url).origin}/api/keystatic/github/oauth/callback\`);
  const tokenRes = await fetch(url, {`;

  if (src.includes(oldStr) && !src.includes('redirect_uri')) {
    src = src.replace(oldStr, newStr);
    writeFileSync(path, src, 'utf-8');
    count++;
  }
}

console.log(count > 0 ? `✅ Patched Keystatic core (${count}/${files.length})` : '⏭️  Keystatic core already patched');
