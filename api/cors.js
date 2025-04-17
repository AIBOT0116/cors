import { createProxyMiddleware } from 'http-proxy-middleware';

export const config = {
  runtime: 'edge', // 'nodejs' is also supported if needed
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get('url');

  if (!target) {
    return new Response(JSON.stringify({ error: 'Missing ?url= parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const fetchUrl = new URL(target);
  const proxyRes = await fetch(fetchUrl.toString(), {
    method: req.method,
    headers: req.headers,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body,
  });

  const headers = new Headers(proxyRes.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Headers', '*');
  headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');

  return new Response(proxyRes.body, {
    status: proxyRes.status,
    headers,
  });
}
