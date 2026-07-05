import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import { unified } from '@astrojs/markdown-remark';

import sitemap from '@astrojs/sitemap';
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
    react(),
    sitemap(),
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
    domains: ['cdn.pixabay.com'],
  },

  markdown: {
    processor: unified({
      remarkPlugins: [readingTimeRemarkPlugin],
      rehypePlugins: [responsiveTablesRehypePlugin],
    }),
  },

  vite: {
    plugins: [tailwindcss()],
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
