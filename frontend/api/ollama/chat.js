// api/ollama/chat.js
export const config = { runtime: 'nodejs' }; // ✅ Updated

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { model, messages, stream } = req.body || {};
    if (!model || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'model and messages required' });
    }

    const API_BASE = process.env.OLLAMA_CLOUD_BASE || 'https://ollama.com';
    const key = process.env.OLLAMA_API_KEY;
    if (!key) return res.status(500).json({ error: 'Missing OLLAMA_API_KEY' });

    const upstream = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model, messages, stream: !!stream }),
    });

    if (!stream) {
      const data = await upstream.json().catch(() => null);
      return res
        .status(upstream.status)
        .json(data ?? { error: 'Upstream parse error' });
    }

    res.writeHead(200, {
      'Content-Type':
        upstream.headers.get('content-type') || 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Transfer-Encoding': 'chunked',
      'Access-Control-Allow-Origin': '*',
    });

    const reader = upstream.body?.getReader();
    const encoder = new TextEncoder();

    if (!reader) {
      res.end();
      return;
    }

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) res.write(encoder.encode(new TextDecoder().decode(value)));
    }

    res.end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e?.message || 'Server error' });
  }
}
