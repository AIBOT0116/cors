const http = require('http');
const https = require('https');
const { parse } = require('url');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://www.sonyliv.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader("Access-Control-Allow-Headers", 'Content-Type, Authorization');

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
      headers: {
        ...req.headers,
        host: parsedUrl.hostname,
        'User-Agent': req.headers['User-Agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': req.headers['Referer'] || 'https://www.sonyliv.com/', // Replace with actual video page
        'Origin': req.headers['Origin'] || 'https://www.sonyliv.com', // Origin should be the main site
      }
      // headers: { ...req.headers, host: parsedUrl.hostname }
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