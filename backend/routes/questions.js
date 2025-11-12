const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// GET classes
router.get('/classes', async (req, res) => {
  const classes = await Question.distinct('class');
  classes.sort((a, b) => (+a) - (+b));
  res.json(classes.map(c => ({ classId: c, name: `Class ${c}` })));
});

// GET subjects in a class
router.get('/classes/:classId/subjects', async (req, res) => {
  const { classId } = req.params;
  const subjects = await Question.find({ class: classId }).distinct('subject');
  res.json(subjects);
});

// GET units for class + subject (keeps unit_no + unit_name pairs distinct)
router.get('/classes/:classId/subjects/:subject/units', async (req, res) => {
  const { classId, subject } = req.params;
  const agg = await Question.aggregate([
    { $match: { class: classId, subject } },
    { $group: { _id: { unit_no: "$unit_no", unit_name: "$unit_name" } } },
    { $sort: { "_id.unit_no": 1 } }
  ]);
  const result = agg.map(a => ({ unit_no: a._id.unit_no, unit_name: a._id.unit_name }));
  res.json(result);
});

// GET questions with filters
// Example: /api/questions?class=10&subject=Science&unit_no=1&unit_name=Introduction&type=MCQ
router.get('/questions', async (req, res) => {
  const {
    class: cls,
    subject,
    unit_no,
    unit_name,   // NEW: filter by unit_name to split same unit_no into separate units
    type,
    section,     // optional: if you want to filter a section too
    Topic        // optional: your JSON sometimes has "Topic"
  } = req.query;

  const filter = {};
  if (cls) filter.class = cls;
  if (subject) filter.subject = subject;
  if (unit_no) filter.unit_no = unit_no.toString();
  if (unit_name) filter.unit_name = unit_name;         // ← KEY FIX
  if (type) filter.type = type;
  if (section) filter.section = section;
  if (Topic) filter.Topic = Topic;

  const questions = await Question.find(filter).sort({ question_no: 1 });
  res.json(questions);
});

module.exports = router;
