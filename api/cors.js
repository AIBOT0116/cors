export default async function handler(req, res) {
    const url = req.query.url;
  
    if (!url) {
      return res.status(400).json({ error: 'No URL provided' });
    }
  
    try {
      const response = await fetch(url);
      const contentType = response.headers.get('content-type') || 'application/octet-stream';
      const data = await response.arrayBuffer();
  
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', contentType);
      res.send(Buffer.from(data));
    } catch (error) {
      console.error('Fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch the URL' });
    }
  }
  