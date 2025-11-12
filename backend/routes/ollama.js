// routes/ollama.js
const express = require('express');
const router = express.Router();

const API_KEY = process.env.OLLAMA_API_KEY || '';
const CLOUD_BASE = (process.env.OLLAMA_CLOUD_BASE || 'https://ollama.com').replace(/\/+$/, '');

router.post('/chat', async (req, res) => {
  try {
    const { model, messages } = req.body || {};

    if (!model || !Array.isArray(messages)) {
      return res.status(400).json({ error: "model and messages required" });
    }

    if (!API_KEY) {
      return res.status(401).json({ error: "Missing OLLAMA_API_KEY" });
    }

    const upstream = await fetch(`${CLOUD_BASE}/api/chat`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages,
        stream: false
      })
    });

    const text = await upstream.text();

    if (!upstream.ok) {
      return res.status(upstream.status).send(text);
    }

    const json = JSON.parse(text);

    // Return cloud-native format
    return res.json(json);

  } catch (err) {
    console.error("Ollama Cloud Error", err);
    return res.status(500).json({ error: "fetch failed", detail: err.message });
  }
});

router.get('/health', (req, res) => {
  res.json({ ok: true });
});

module.exports = router;
