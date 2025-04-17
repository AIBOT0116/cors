export default async function handler(req, res) {
    // Extract the full URL from the path
    const { url } = req.query;
  
    if (!url) {
      return res.status(400).json({ error: 'No URL provided' });
    }
  
    try {
      const targetUrl = decodeURIComponent(url);
      const response = await fetch(targetUrl);
      const contentType = response.headers.get('content-type') || 'application/octet-stream';
      const buffer = await response.arrayBuffer();
  
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', contentType);
      res.send(Buffer.from(buffer));
    } catch (error) {
      console.error('Fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch URL' });
    }
  }
  