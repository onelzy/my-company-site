/**
 * Edge middleware (runs for requests handled by the Astro SSR app).
 *
 * NOTE: prerendered pages are served straight from ASSETS and never reach this
 * middleware — URL canonicalization (trailing slash, /index.html collapse,
 * legacy aliases, apex -> www) lives in scripts/owon-entry.template.js, which
 * runs for EVERY request at the platform level.
 *
 * 1. Security headers on every Worker-served response (HTML/API/SSR).
 * 2. X-Robots-Tag: noindex on the Keystatic CMS UI (/keystatic*) so the
 *    admin surface never enters Google's index.
 */
import { defineMiddleware } from 'astro:middleware';

const SECURITY_HEADERS: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Content-Security-Policy':
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "img-src 'self' data: blob: https://documents.owon-iot.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "connect-src 'self' https://api.github.com; " +
    'frame-src https://www.google.com https://www.youtube.com https://www.youtube-nocookie.com; ' +
    "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; " +
    "worker-src 'self' blob:",
};

function applySecurityHeaders(response: Response): void {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(name, value);
  }
}

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  applySecurityHeaders(response);
  // Keep the Keystatic CMS admin surface out of the index.
  if (context.url.pathname.startsWith('/keystatic')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return response;
});
