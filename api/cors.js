export default async function handler(req, res) {
    const { url: rawPath } = req;
  
    // Get everything after the first `/` and prepend "https://"
    const externalUrl = decodeURIComponent(rawPath.replace(/^\/\?*/, ''));
  
    if (!externalUrl.startsWith('https://') && !externalUrl.startsWith('http://')) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }
  
    try {
      const response = await fetch(externalUrl);
      const contentType = response.headers.get('content-type') || 'application/octet-stream';
      const data = await response.arrayBuffer();
  
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', contentType);
      res.send(Buffer.from(data));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch external content' });
    }
  }
  