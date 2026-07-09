import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  const runtime = locals.runtime as Record<string, unknown> | undefined;
  const hasRuntime = runtime !== undefined && runtime !== null;

  let envKeys: string[] = [];
  let hasEnv = false;

  if (hasRuntime) {
    try {
      const env = (runtime as any).env;
      hasEnv = env !== undefined && env !== null;
      if (hasEnv) {
        envKeys = Object.keys(env).filter(
          (k: string) => k.includes('KEYSTATIC') || k.includes('GITHUB') || k.includes('SESSION') || k.includes('ASSETS')
        );
      }
    } catch (e: any) {
      return new Response(JSON.stringify({
        error: 'env_getter_threw',
        message: e.message,
        hasRuntime: true,
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response(JSON.stringify({
    hasRuntime,
    hasEnv,
    envKeys,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
