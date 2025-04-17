export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing ?url= parameter' });
  }

  try {
    const proxyRes = await fetch(url, {
      method: req.method,
      headers: {
        ...req.headers,
        host: new URL(url).host,
      },
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : req,
    });

    const data = await proxyRes.arrayBuffer();
    const headers = {};

    proxyRes.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    res.status(proxyRes.status).send(Buffer.from(data));
  } catch (err) {
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
}