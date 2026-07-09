/**
 * Cookie diagnostic endpoint.
 * GET /api/debug/cookie → Shows all cookies sent by browser + NODE_ENV value
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, locals }) => {
  const runtime = (locals as unknown as Record<string, unknown>).runtime as Record<string, unknown> | undefined;
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies: Record<string, string> = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach((pair) => {
      const [key, ...rest] = pair.trim().split('=');
      if (key) cookies[key] = rest.join('=');
    });
  }

  const keystaticCookies = Object.keys(cookies).filter((k) => k.includes('keystatic') || k.includes('ks-'));

  return new Response(
    JSON.stringify(
      {
        totalCookies: Object.keys(cookies).length,
        keystaticCookies,
        nodeEnv: typeof process !== 'undefined' ? process.env?.NODE_ENV : 'no process',
        hasRuntime: !!runtime,
      },
      null,
      2
    ),
    { headers: { 'Content-Type': 'application/json' } }
  );
};
