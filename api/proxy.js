const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (req, res) => {
  // Extract target URL from query parameter or path
  let targetUrl = req.query.url || req.url.slice(1);

  // Validate URL
  if (!targetUrl || !targetUrl.startsWith('http')) {
    return res.status(400).json({ error: 'Invalid URL parameter' });
  }

  // Remove our own domain if present
  targetUrl = targetUrl.replace(/^https?:\/\/[^/]+/, '');

  // Create proxy middleware
  const proxy = createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      return targetUrl.includes('?') ? targetUrl.split('?')[0] : targetUrl;
    },
    onProxyRes: (proxyRes) => {
      // Add CORS headers
      proxyRes.headers['access-control-allow-origin'] = '*';
      proxyRes.headers['access-control-allow-methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    },
    logger: console
  });

  // Handle errors
  proxy(req, res, (err) => {
    if (err) {
      console.error('Proxy error:', err);
      res.status(500).json({ error: 'Proxy error', details: err.message });
    }
  });
};