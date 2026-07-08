import { defineMiddleware } from 'astro:middleware';

/**
 * @keystatic/astro reads Worker secrets via context.locals.runtime.env,
 * but @astrojs/cloudflare v13 (Astro v6) removed that API (it throws).
 * This middleware re-exposes the Worker env so Keystatic can read OAuth creds.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  if (context.locals.runtime) {
    try {
      const { env } = await import('cloudflare:workers');
      Object.defineProperty(context.locals.runtime, 'env', {
        get() {
          return env;
        },
        enumerable: true,
        configurable: true,
      });
    } catch {
      // Not in Cloudflare Workers runtime (local dev) — Keystatic's
      // fallback to import.meta.env handles this case.
    }
  }
  return next();
});
