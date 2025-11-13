// routes/track.js
const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');

// get client IP (handles X-Forwarded-For if present)
function getClientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (xff) return xff.split(',')[0].trim();
  const addr = req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : 'unknown';
  return addr.replace('::ffff:', '');
}

// GET /track  -> only store/update IP, no listing
router.get('/', async (req, res) => {
  try {
    const ip = getClientIp(req);
    const userAgent = req.headers["user-agent"] || "unknown";

   // ✅ CORRECT: All updates in 2nd argument, Options in 3rd
await Visitor.findOneAndUpdate(
  { ip }, // 1. Filter
  {       // 2. Update (Merge everything here)
    userAgent, 
    $inc: { count: 1 },
    $set: { lastSeen: new Date() },
    $setOnInsert: { firstSeen: new Date() }
  },
  { upsert: true, new: true } // 3. Options
);

    // return minimal response
    return res.json({ ok: true });
  } catch (err) {
    console.error('track error', err);
    return res.status(500).json({ ok: false });
  }
});

module.exports = router;
