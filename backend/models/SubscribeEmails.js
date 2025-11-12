const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // Oru email oru thadava thaan subscribe panna mudiyum
    trim: true,
    lowercase: true
  }
}, {
  timestamps: true // Eppov subscribe pannanga-nu therinjuka
});

module.exports = mongoose.model('Subscriber', subscriberSchema);