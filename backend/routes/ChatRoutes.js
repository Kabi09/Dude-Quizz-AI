const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');

// ➕ POST - save message
router.post('/', async (req, res) => {
  try {
    const { role, content } = req.body;
    const chat = await Chat.create({ role, content });
    res.status(201).json({ success: true});
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🔄 GET - fetch all messages
// router.get('/', async (req, res) => {
//   try {
//     const chats = await Chat.find().sort({ createdAt: 1 });
//     res.json(chats);
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

module.exports = router;
