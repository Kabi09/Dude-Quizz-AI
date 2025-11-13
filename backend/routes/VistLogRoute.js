// routes/visit.js
const express = require("express");
const router = express.Router();
const VisitLog = require("../models/VisitLog");

// Get client IP correctly (works on Vercel)
function getClientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  let ip = xff ? xff.split(",")[0].trim() : req.ip;

  if (ip.startsWith("::ffff:")) ip = ip.replace("::ffff:", "");
  if (ip === "::1") ip = "127.0.0.1";

  return ip;
}

// GET /api/visit?email=optional
router.get("/", async (req, res) => {
  try {
    const ip = getClientIp(req);
    const email = req.query.email || null;
    const userAgent = req.headers["user-agent"] || "unknown";

    await VisitLog.create({
      ip,
      email,
      userAgent,
      time: new Date()
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("Visit Log Error:", err);
    res.status(500).json({ ok: false });
  }
});

module.exports = router;
