import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  // Test outbound connection
  const tests: Record<string, unknown> = {};

  try {
    const res = await fetch('https://github.com', { method: 'HEAD' });
    tests.github = { ok: res.ok, status: res.status };
  } catch (e: any) {
    tests.github = { error: e.message };
  }

  try {
    const res = await fetch('https://api.github.com', { method: 'HEAD' });
    tests.api_github = { ok: res.ok, status: res.status };
  } catch (e: any) {
    tests.api_github = { error: e.message };
  }

  return new Response(JSON.stringify(tests, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
