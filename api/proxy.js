const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = async (req, res) => {
  // Extract target URL from query parameter
  const targetUrl = req.query.url;
  
  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing URL parameter. Use ?url=https://example.com' });
  }

  // Create proxy middleware
  const proxy = createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: { '^/api/proxy': '' }, // Remove the /api/proxy prefix
    onProxyRes: (proxyRes) => {
      // Add CORS headers
      proxyRes.headers['access-control-allow-origin'] = '*';
      proxyRes.headers['access-control-allow-methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    },
    logger: console
  });

  // Handle the request
  proxy(req, res, (err) => {
    if (err) {
      console.error('Proxy error:', err);
      res.status(500).json({ error: 'Proxy error', details: err.message });
    }
  });
};