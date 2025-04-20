import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get target URL from query params
    const targetUrl = req.query.url;
    if (!targetUrl) {
      return res.status(400).json({ error: 'Missing URL parameter' });
    }

    // Validate URL format
    try {
      new URL(targetUrl);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Forward the request
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...(req.headers['content-type'] && { 'Content-Type': req.headers['content-type'] }),
        ...(req.headers['authorization'] && { 'Authorization': req.headers['authorization'] })
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });

    // Forward the response
    const data = await response.text();
    res.status(response.status).send(data);

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Internal proxy error',
      details: error.message 
    });
  }
}