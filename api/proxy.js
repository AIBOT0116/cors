import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

export default function handler(req, res) {
  // Enable CORS for all domains
  cors()(req, res, () => {});

  const proxy = createProxyMiddleware({
    target: req.query.url,  // Proxy URL (to be passed in the query)
    changeOrigin: true,     // Modify the origin to match the target
    secure: false,          // Allow self-signed certificates (optional)
    onProxyRes(proxyRes, req, res) {
      // Add CORS headers to the proxied response
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
    },
  });

  return proxy(req, res);
}
