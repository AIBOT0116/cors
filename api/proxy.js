export default async function handler(req, res) {
  const path = req.url.slice(1); // Remove the leading "/"
  const targetUrl = decodeURIComponent(path);

  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
    return res.status(400).json({ error: "Invalid URL. Must start with http or https." });
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: { ...req.headers, host: new URL(targetUrl).host }
    });

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const buffer = await response.arrayBuffer();

    // Add CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Content-Type", contentType);

    res.status(response.status).send(Buffer.from(buffer));
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Failed to proxy request" });
  }
}
