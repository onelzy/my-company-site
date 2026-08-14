/**
 * Edge middleware (runs for every request handled by the Cloudflare Worker).
 *
 * 1. Canonical redirects:
 *    - http://…            → https://www.owon-iot.com/…  (scheme upgrade;
 *      Cloudflare sets X-Forwarded-Proto to the client's real scheme)
 *    - https://owon-iot.com → https://www.owon-iot.com/…  (apex → www;
 *      belt-and-braces on top of the _redirects edge rule)
 *    301 for GET/HEAD, 308 for other methods so POST bodies survive.
 *
 * 2. Security headers on every Worker-served response (HTML/API/SSR).
 *    Static assets (_astro/*, /images/*, …) bypass the Worker and are
 *    covered by public/_headers instead.
 */
import { defineMiddleware } from 'astro:middleware';

const CANONICAL_HOST = 'www.owon-iot.com';

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
  const request = context.request;
  const url = new URL(request.url);

  const host = (request.headers.get('host') ?? '').toLowerCase();
  const forwardedProto = (request.headers.get('x-forwarded-proto') ?? 'https').toLowerCase();

  const isApex = host === 'owon-iot.com';
  const isPlainHttp = forwardedProto === 'http';

  if (isApex || isPlainHttp) {
    const target = `https://${CANONICAL_HOST}${url.pathname}${url.search}`;
    const status = request.method === 'GET' || request.method === 'HEAD' ? 301 : 308;
    const response = await context.redirect(target, status);
    applySecurityHeaders(response);
    return response;
  }

  const response = await next();
  applySecurityHeaders(response);
  return response;
});
