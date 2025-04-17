import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'No URL provided' });
  }

  try {
    const response = await fetch(url);

    // Stream the response back to the client
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/octet-stream');

    response.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch external resource' });
  }
}
