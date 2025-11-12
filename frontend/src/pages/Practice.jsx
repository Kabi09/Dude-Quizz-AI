import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuestions } from '../api';

import PracticeMCQ from '../practice/PracticeMCQ';
import PracticeFill from '../practice/FillInTheBlank';
import PracticeMatch from '../practice/PracticeMatch';
import PracticeGeneric from '../practice/PracticeGeneric';
import TrueFalse from '../practice/TrueFalse';
import AssertionReason from '../practice/AssertionReason';
import ShortAnswer from '../practice/ShortAnswer';
import MultipleStatement from '../practice/MultipleStatement';
import Matching_MCQ from '../practice/Matching_MCQ';
import OddOneOut from '../practice/OddOneOut';
import Analogies from '../practice/Analogies';
import Ordering from '../practice/Ordering';
import Abbreviation from '../practice/Abbreviation';


export default function Practice() {
  const { classId, subject, unit_no, unit_name, type } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    getQuestions({
      class: classId,
      subject,
      unit_no,
      unit_name,
      type
    }).then(setQuestions).catch(() => setQuestions([]));
  // 🔧 include unit_name + type so it refetches correctly
  }, [classId, subject, unit_no, unit_name, type]);
 

  if (!questions || questions.length === 0) {
    return <div className="card p-4">No questions found for this filter.</div>;
  }

  const t = (type || '').toLowerCase().trim();
  

  // MCQ / simple types
  if (t === 'mcq') return <PracticeMCQ questions={questions} />;
  if (t === 'fillintheblank' || t === 'fill' || t === 'fill_in_the_blank') return <PracticeFill questions={questions} />;
  if (t === 'truefalse' || t === 'true_false') return <TrueFalse questions={questions} />;
  if (t === 'assertionreason' || t === 'assertion_reason') return <AssertionReason questions={questions} />;
  if (t === 'shortanswer' || t === 'short_answer') return <ShortAnswer questions={questions} />;

  // Matching styles
  if (t === 'match' || t === 'matching') return <PracticeMatch questions={questions} />;
  if (t === 'matching_mcq' || t === 'matching-mcq') return <Matching_MCQ questions={questions} />;

  // Special styles
  if (t === 'oddoneout' || t === 'odd_one_out' || t === 'odd-one-out' || t === 'odd') {
    return <OddOneOut questions={questions} />;
  }

  // 🔥 NEW types you added
  if (t === 'analogies' || t === 'analogy') return <Analogies questions={questions} />;
  if (t === 'ordering' || t === 'order') return <Ordering questions={questions} />;
  if (t === 'abbreviation' || t === 'abbreviations' || t === 'abbr') return <Abbreviation questions={questions} />;

  // fallback
  return <PracticeGeneric questions={questions} type={type} />;
}
