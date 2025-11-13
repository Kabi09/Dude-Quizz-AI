// models/Visitor.js
const mongoose = require('mongoose');

const VisitorSchema = new mongoose.Schema({
  ip: { type: String, unique: true, required: true },
  count: { type: Number, default: 0 },
  userAgent: String,
  firstSeen: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visitor', VisitorSchema);
