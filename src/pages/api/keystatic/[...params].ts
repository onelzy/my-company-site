export { ALL, prerender } from '@keystatic/astro/internal/keystatic-api.js';

// Return empty array: 0 static paths, all requests handled by SSR worker.
import type { GetStaticPaths } from 'astro';
export const getStaticPaths: GetStaticPaths = () => [];
