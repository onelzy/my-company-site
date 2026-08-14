#!/usr/bin/env node
// Build-phase probe: writes a marker file into public/ so the deployed
// static assets reveal which npm/astro build phases ran in the CF build.
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const name = process.argv[2] ?? 'unknown';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
mkdirSync(join(root, 'public'), { recursive: true });
writeFileSync(
  join(root, 'public', 'marker-' + name + '.txt'),
  name + ' ' + new Date().toISOString() + ' node=' + process.version + ' cwd=' + process.cwd() + '\n'
);
console.log('marker written: ' + name);
