const express = require('express');
const fetch = require('node-fetch');

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.get('/:get', async (req, res) => {
  const getParam = req.params.get;
  const mpdUrl = `https://l02.dp.sooka.my/${getParam}`;

  try {
    const response = await fetch(mpdUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
      },
      timeout: 5000
    });

    if (!response.ok) {
      return res.status(502).send("Failed to fetch resource.");
    }

    res.setHeader("Content-Type", "application/dash+xml");
    const body = await response.text();
    res.send(body);
  } catch (err) {
    res.status(502).send("Failed to fetch resource.");
  }
});

module.exports = app;