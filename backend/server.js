const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // <-- Namma ithu use pannom
const path = require('path');
require('dotenv').config();

const questionsRouter = require('./routes/questions');
const ollamaRouter = require('./routes/ollama');
const chatRoutes = require("./routes/ChatRoutes");

// --- FIX 2: These are handler functions, not routers ---
// (unga import correct-ah thaan irukku)
const { handleContactForm } = require('./routes/ContactRoute');
const { handleSubscription } = require('./routes/subscribeRoutes');


const app = express();

// --- FIX 1: THE CORS POLICY FIX ---
// Define your allowed frontend URLs
const allowedOrigins = [
  'https://dude-quizz-ai-lyart.vercel.app', // Your Vercel frontend
  'http://localhost:5173',                  // Your local frontend (for testing)
  'http://localhost:5174'                   // Oru vela local port maari iruntha
];

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the incoming request origin is in our allowed list
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // !origin allows Postman/Thunder Client (no origin)
      callback(null, true);
    } else {
      callback(new Error('This URL is not allowed by CORS.'));
    }
  }
};

// Use the CORS middleware *with options*
app.use(cors(corsOptions));
// --- END CORS FIX ---


// This middleware must come AFTER cors
app.use(express.json());

// Static images for questions
app.use('/data/img', express.static(path.join(__dirname, 'data/img')));

// API routes
app.use('/api', questionsRouter);
app.use('/api/ollama', ollamaRouter); // mounts /api/ollama/*
app.use("/api/chat", chatRoutes); // chat routes

// --- FIX 2: Use app.post() for POST routes, not app.use() ---
app.post("/api/contact", handleContactForm);
app.post("/api/subscribe", handleSubscription);
// --- END ROUTING FIX ---


if (!process.env.OLLAMA_API_KEY) {
  console.warn('[ollama] Warning: OLLAMA_API_KEY is missing!');
}

const MONGO = process.env.MONGO || 'mongodb://127.0.0.1:27017/quizdb';
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Mongo connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log('Server listening', PORT));
  }).catch(err => console.error(err));