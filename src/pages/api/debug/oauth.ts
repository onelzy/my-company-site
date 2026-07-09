import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    const runtime = (globalThis as any).Astro?.locals?.runtime;
    const env = runtime?.env;

    // Show secret metadata without exposing values
    const info: Record<string, unknown> = {};
    if (env) {
      for (const k of ['KEYSTATIC_GITHUB_CLIENT_ID', 'KEYSTATIC_GITHUB_CLIENT_SECRET', 'KEYSTATIC_SECRET']) {
        const v = env[k];
        info[k] = v ? { exists: true, length: String(v).length, prefix: String(v).substring(0, 6) + '...' } : { exists: false };
      }
    }

    // Show what redirect_uri would be computed
    const redirectUri = `${new URL(request.url).origin}/api/keystatic/github/oauth/callback`;

    return new Response(JSON.stringify({ env: info, redirectUri, requestOrigin: new URL(request.url).origin }, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Actually try the token exchange
  const env = (globalThis as any).Astro?.locals?.runtime?.env;
  const clientId = env?.KEYSTATIC_GITHUB_CLIENT_ID;
  const clientSecret = env?.KEYSTATIC_GITHUB_CLIENT_SECRET;

  const tokenUrl = new URL('https://github.com/login/oauth/access_token');
  tokenUrl.searchParams.set('client_id', clientId);
  tokenUrl.searchParams.set('client_secret', clientSecret);
  tokenUrl.searchParams.set('code', code);
  tokenUrl.searchParams.set('redirect_uri', `${new URL(request.url).origin}/api/keystatic/github/oauth/callback`);

  const res = await fetch(tokenUrl, { method: 'POST', headers: { Accept: 'application/json' } });
  const body = await res.text();

  let parsed;
  try { parsed = JSON.parse(body); } catch { parsed = body; }

  return new Response(JSON.stringify({
    httpStatus: res.status,
    ok: res.ok,
    body: parsed,
    requestUrl: tokenUrl.toString(),
  }, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
