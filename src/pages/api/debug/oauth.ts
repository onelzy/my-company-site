/**
 * Debug endpoint for Keystatic GitHub OAuth diagnostics.
 *
 * - GET /api/debug/oauth → Inspect env vars and config (masks secrets)
 * - GET /api/debug/oauth?code=xxx → Test token exchange with a real OAuth code
 *
 * Remove before production merge.
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, locals }) => {
  const runtime = (locals as unknown as Record<string, unknown>).runtime as Record<string, unknown> | undefined;
  const env = (runtime?.env as Record<string, string>) || {};
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  // Collect env var info (mask secrets beyond first 6 chars)
  const envInfo: Record<string, unknown> = {};
  for (const key of Object.keys(env).filter(
    (k) => k.startsWith('KEYSTATIC') || k.startsWith('GITHUB') || k === 'SESSION' || k === 'ASSETS'
  )) {
    const raw = env[key];
    envInfo[key] = raw ? { exists: true, length: raw.length, prefix: raw.substring(0, 6) + '...' } : { exists: false };
  }

  // Compute redirect_uri that would be used
  const redirectUri = `${url.origin}/api/keystatic/github/oauth/callback`;

  if (!code) {
    // Inspection mode — env vars + config summary
    return new Response(
      JSON.stringify(
        {
          hasRuntime: !!runtime,
          hasEnv: !!env,
          envKeys: envInfo,
          redirectUri,
          requestOrigin: url.origin,
          requestHost: request.headers.get('host'),
        },
        null,
        2
      ),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Test mode — try token exchange with provided code
  const clientId = env['KEYSTATIC_GITHUB_CLIENT_ID'];
  const clientSecret = env['KEYSTATIC_GITHUB_CLIENT_SECRET'];

  if (!clientId || !clientSecret) {
    return new Response(
      JSON.stringify({ error: 'Missing client credentials', hasClientId: !!clientId, hasClientSecret: !!clientSecret }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = new URLSearchParams();
    body.set('client_id', clientId);
    body.set('client_secret', clientSecret);
    body.set('code', code);
    body.set('redirect_uri', redirectUri);

    const start = Date.now();
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });
    const elapsed = Date.now() - start;
    const resText = await res.text();
    let resJson: unknown;
    try {
      resJson = JSON.parse(resText);
    } catch {
      resJson = resText;
    }

    return new Response(
      JSON.stringify(
        {
          httpStatus: res.status,
          ok: res.ok,
          elapsedMs: elapsed,
          body: resJson,
          sentParams: {
            client_id: clientId.substring(0, 6) + '...',
            hasSecret: !!clientSecret,
            redirect_uri: redirectUri,
            code: code.substring(0, 10) + '...',
          },
        },
        null,
        2
      ),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: 'fetch failed', message: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
