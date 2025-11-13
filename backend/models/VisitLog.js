// models/VisitLog.js
const mongoose = require("mongoose");

const VisitLogSchema = new mongoose.Schema({
  ip: String,
  email: String,
  userAgent: String,
  time: { type: Date, default: Date.now }
});

module.exports = mongoose.model("VisitLog", VisitLogSchema);
