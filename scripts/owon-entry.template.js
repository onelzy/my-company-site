import main from './__ENTRY__';

export default {
  async fetch(request, env, context) {
    const url = new URL(request.url);
    const proto = (request.headers.get('x-forwarded-proto') ?? 'https').toLowerCase();
    if (url.hostname === 'owon-iot.com' || proto === 'http') {
      const status = request.method === 'GET' || request.method === 'HEAD' ? 301 : 308;
      return Response.redirect('https://www.owon-iot.com' + url.pathname + url.search, status);
    }
    return main.fetch(request, env, context);
  },
};
