export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const { url } = req.body || {};
  if (!url) return res.status(400).json({ error: 'Missing url' });

  // basic validation to avoid SSRF (improve this in production)
  try {
    const parsed = new URL(url);
    // Block local addresses (very basic)
    if (['localhost','127.0.0.1'].includes(parsed.hostname) || parsed.hostname.endsWith('.local')) {
      return res.status(400).json({ error: 'Local addresses blocked' });
    }
  } catch(e){
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(), 10000); // 10s timeout
    const response = await fetch(url, { method: 'GET', redirect: 'follow', signal: controller.signal });
    clearTimeout(timeout);
    // response.url contains the final URL after redirects
    return res.status(200).json({ finalUrl: response.url });
  } catch (err) {
    console.error('Expand error', err);
    return res.status(500).json({ error: 'Failed to expand URL' });
  }
}

