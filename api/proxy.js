const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Get target URL
    const targetUrl = req.query.url;
    if (!targetUrl) {
      return res.status(400).json({ error: 'Missing URL parameter. Use ?url=https://example.com' });
    }

    // Validate URL
    try {
      new URL(targetUrl);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Make the request
    const response = await fetch(targetUrl, {
      headers: {
        ...(req.headers['content-type'] && { 'Content-Type': req.headers['content-type'] }),
        ...(req.headers['authorization'] && { 'Authorization': req.headers['authorization'] })
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined
    });

    // Forward response
    const data = await response.text();
    res.status(response.status).send(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy request failed',
      details: error.message 
    });
  }
};