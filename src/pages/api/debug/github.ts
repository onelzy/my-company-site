/**
 * GitHub API diagnostic endpoint.
 * GET /api/debug/github → Test GitHub API connectivity
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  const runtime = (locals as unknown as Record<string, unknown>).runtime as Record<string, unknown> | undefined;
  const env = (runtime?.env as Record<string, string>) || {};
  const token = env['KEYSTATIC_GITHUB_TOKEN'];

  const results: Record<string, unknown> = { hasToken: !!token };

  if (token) {
    results.tokenPrefix = token.substring(0, 6) + '...';

    // Test rate limit
    try {
      const r = await fetch('https://api.github.com/rate_limit', {
        headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' },
      });
      results.rateLimit = { status: r.status };
      if (r.ok) {
        const d = (await r.json()) as Record<string, unknown>;
        results.rateLimit = d;
      }
    } catch (e) {
      results.rateLimit = { error: String(e) };
    }

    // Test repo access
    try {
      const r = await fetch('https://api.github.com/repos/onelzy/my-company-site', {
        headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' },
      });
      results.repoAccess = { status: r.status, ok: r.ok };
    } catch (e) {
      results.repoAccess = { error: String(e) };
    }

    // Test content access
    try {
      const r = await fetch('https://api.github.com/repos/onelzy/my-company-site/contents/src/content/products', {
        headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' },
      });
      results.contentAccess = { status: r.status, ok: r.ok };
      if (r.ok) {
        const files = (await r.json()) as Array<{ name: string }>;
        results.contentAccess = { status: r.status, fileCount: files.length };
      }
    } catch (e) {
      results.contentAccess = { error: String(e) };
    }
  }

  return new Response(JSON.stringify(results, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
