import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  return new Response(JSON.stringify({
    url: request.url,
    origin: url.origin,
    host: request.headers.get('host'),
    pathname: url.pathname,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
