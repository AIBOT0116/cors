const axios = require('axios');

module.exports = async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing "url" query parameter' });
  }

  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }

    // Proxy the request using axios
    const response = await axios.get(targetUrl);

    // Send the response from the target URL
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching target URL', details: error.message });
  }
};
