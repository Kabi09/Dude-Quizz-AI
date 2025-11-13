const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const questionsRouter = require('./routes/questions');
const ollamaRouter = require('./routes/ollama');
const chatRoutes=require("./routes/ChatRoutes");
const { handleContactForm } = require('./routes/ContactRoute');
const { handleSubscription } = require('./routes/subscribeRoutes');

const trackRoute = require('./routes/track');
const visitRoute = require("./routes/VistLogRoute");



const app = express();
app.set('trust proxy', true);

app.use(cors());
app.use(express.json());

// Static images for questions
app.use('/data/img', express.static(path.join(__dirname, 'data/img')));

// API routes
app.use('/api', questionsRouter);
app.use('/api/ollama',ollamaRouter ); // mounts /api/ollama/*
app.use("/api/contact",handleContactForm)
app.use("/api/subscribe",handleSubscription)

app.use('/api/visit1', trackRoute);
app.use('/api/visit/em', visitRoute);


// chat routes
app.use("/api/chat", chatRoutes);

if (!process.env.OLLAMA_API_KEY) {
  console.warn('[ollama] Warning: OLLAMA_API_KEY is missing!');
}

const MONGO = process.env.MONGO || 'mongodb://127.0.0.1:27017/quizdb';
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Mongo connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log('Server listening', PORT));
  })
  .catch(err => console.error(err));
