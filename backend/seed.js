const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Question = require('./models/Question');
const dotev=require("dotenv")

dotev.config({path:"./.env"})

const MONGO = process.env.MONGO;

async function run() {
  await mongoose.connect(MONGO, {useNewUrlParser:true, useUnifiedTopology:true});
  console.log('connected');

  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    console.error('No data directory found at', dataDir);
    process.exit(1);
  }
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

  await Question.deleteMany({});

  for (const f of files) {
    const full = path.join(dataDir, f);
    const text = fs.readFileSync(full, 'utf8');
    let arr = JSON.parse(text);
    if (!Array.isArray(arr)) {
      console.warn('Skipping', f, '— not an array');
      continue;
    }
    const prepared = arr.map((q, idx) => ({ 
      ...q,
      question_no: Number(q.question_no) || (q._id?0:idx+1),
      class: q.class || q.classname || q.classId || q.cls || q.grade || q['class'] || q.className || (q.unit_no && q.unit_no.toString().startsWith('10')? '10' : undefined)
    }));
    await Question.insertMany(prepared);
    console.log('inserted', f, prepared.length);
  }

  console.log('done');
  process.exit(0);
}
run().catch(err => { console.error(err); process.exit(1); });
