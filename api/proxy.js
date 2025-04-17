export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing ?url=' });
  }

  try {
    const targetUrl = decodeURIComponent(url);
    const response = await fetch(targetUrl);

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const data = await response.arrayBuffer();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', contentType);
    res.send(Buffer.from(data));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch URL' });
  }
}
