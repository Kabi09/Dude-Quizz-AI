// routes/ollama.js
const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/Email');

const API_KEY = process.env.OLLAMA_API_KEY || '';
const CLOUD_BASE = (process.env.OLLAMA_CLOUD_BASE || 'https://ollama.com').replace(/\/+$/, '');


const name1="Dude AI APP"
const email1="infinixkabilan05@gmail.com"
const subject = "Ollama AI Integration error";
function MailHtml(errorMessage) {
  return `
    <h3>Hi ${name1},</h3>
    <p><strong>⚠️ Ollama AI Integration Error Occurred</strong></p>
    <pre style="white-space:pre-wrap;">${errorMessage}</pre>
    <br/>
    <p>Regards,<br/>Dude AI Server</p>
  `;
}


router.post('/chat', async (req, res) => {
  try {
    const { model, messages } = req.body || {};

    if (!model || !Array.isArray(messages)) {
       try{
        await sendEmail(email1, subject, MailHtml("model and messages required"));
      }catch(err){
        console.error("Email sending failed:", err.message);
      }
      return res.status(400).json({ error: "model and messages required" });
    }

    if (!API_KEY) {
      try{
        await sendEmail(email1, subject, MailHtml("Missing OLLAMA_API_KEY"));
      }catch(err){
        console.error("Email sending failed:", err.message);
      }
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
      try{
        await sendEmail(email1, subject, MailHtml(" OLLAMA Server Error Athorzation,404,500 error,Api key"));
      }catch(err){
        console.error("Email sending failed:", err.message);
      }
      return res.status(upstream.status).send(text);
    }

    const json = JSON.parse(text);

    // Return cloud-native format
    return res.json(json);

  } catch (err) {
    try{
        await sendEmail(email1, subject, MailHtml(" OLLAMA Server Error"));
      }catch(err){
        console.error("Email sending failed:", err.message);
      }

    console.error("Ollama Cloud Error", err);
    return res.status(500).json({ error: "fetch failed", detail: err.message });
  }
});

router.get('/health', (req, res) => {
  res.json({ ok: true });
});

module.exports = router;
