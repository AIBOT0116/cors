const http = require('http');
const https = require('https');
const { parse } = require('url');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  // Handle preflight
  if (req.method === 'OPTIONS') return res.end();

  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).json({ error: 'URL parameter required' });

  try {
    const parsedUrl = parse(targetUrl);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.path,
      method: req.method,
      headers: { ...req.headers, host: parsedUrl.hostname }
    };

    // Remove problematic headers
    delete options.headers['content-length'];
    delete options.headers['host'];

    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    
    const proxyReq = protocol.request(options, (proxyRes) => {
      // Forward status code
      res.statusCode = proxyRes.statusCode;
      
      // Forward headers
      Object.keys(proxyRes.headers).forEach(key => {
        if (!['content-encoding'].includes(key.toLowerCase())) {
          res.setHeader(key, proxyRes.headers[key]);
        }
      });
      
      // Pipe the response
      proxyRes.pipe(res);
    });

    // Handle errors
    proxyReq.on('error', (e) => {
      console.error('Proxy error:', e);
      res.status(500).json({ error: 'Proxy failed', details: e.message });
    });

    // Pipe the request body for POST/PUT
    if (['POST', 'PUT'].includes(req.method)) {
      req.pipe(proxyReq);
    } else {
      proxyReq.end();
    }

  } catch (e) {
    console.error('Setup error:', e);
    res.status(500).json({ error: 'Invalid setup', details: e.message });
  }
};