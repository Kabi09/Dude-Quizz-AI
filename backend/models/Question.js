const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  class: String,
  subject: String,
  unit_no: String,
  unit_name: String,
  section: String,
  type: String,
  question_no: Number,
  image: String,
  content: mongoose.Schema.Types.Mixed
},{ timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
