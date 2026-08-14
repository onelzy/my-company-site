import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import { unified } from '@astrojs/markdown-remark';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import type { AstroIntegration } from 'astro';

import astrowind from './vendor/integration';

import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

import cloudflare from '@astrojs/cloudflare';

import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin } from './src/utils/frontmatter';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),

  // ================================================================
  // i18n: Currently English-only. Language field is reserved in
  // Keystatic schema for future multi-language expansion.
  // When ready, uncomment the block below:
  //
  //   i18n: {
  //     defaultLocale: 'en',
  //     locales: ['en', 'zh', 'es', 'ru', 'fr', 'de', 'ar', 'pt'],
  //     routing: { prefixDefaultLocale: false },
  //   },
  // ================================================================

  integrations: [
    // CF Workers Builds may run `astro build` directly (skipping the npm
    // prebuild hook), so re-run the required build-time patches here.
    // All three scripts are idempotent.
    {
      name: 'owon-build-patches',
      hooks: {
        'astro:build:start': () => {
          for (const script of ['patch-cf-adapter.mjs', 'patch-keystatic-oauth.mjs', 'gen-content-data.mjs']) {
            execSync('node scripts/' + script, { stdio: 'inherit' });
          }
        },

      },
    },
    react(),
    keystatic(),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),

    astrowind({
      config: './src/config.yaml',
    }),
  ],

  image: {
    domains: ['cdn.pixabay.com', 'documents.owon-iot.com'],
  },

  markdown: {
    processor: unified({
      remarkPlugins: [readingTimeRemarkPlugin],
      rehypePlugins: [responsiveTablesRehypePlugin],
    }),
  },

  vite: {
    plugins: [tailwindcss()],
    assetsInclude: ['**/*.mdoc'],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
        // Cloudflare Workers workaround: use react-dom/server.edge
        // instead of react-dom/server.browser for React 19.
        // Without this, MessageChannel from node:worker_threads needs polyfilling.
        ...(import.meta.env.PROD && {
          'react-dom/server': 'react-dom/server.edge',
        }),
      },
    },
    optimizeDeps: {
      exclude: ['virtual:keystatic-config'],
    },
  },
});
