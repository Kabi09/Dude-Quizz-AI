import React, { useState } from 'react';
import RenderWithMath from '../shared/RenderWithMath';
import ScoreDashboard from '../shared/ScoreDashboard';

export default function ShortAnswer({ questions }) {
  if (!questions || questions.length === 0) return <div className="card">No Short Answer questions.</div>;
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showDashboard, setShowDashboard] = useState(false);
  const q = questions[index];

  function reveal(){
    setShowAnswer(true);
  }
  function next(){
    setAnswers(a=>[...a,{ qIndex:index, question:q, shownAnswer: q.content?.answer || q.answer }]);
    const nextIdx = index+1;
    if (nextIdx >= questions.length) setShowDashboard(true); else { setIndex(nextIdx); setShowAnswer(false); }
  }

  return (
    <div>
      <div className="card">
        <div className="muted">Question {index+1} / {questions.length}</div>
        <div style={{marginTop:12}}>{q.content?.question || q.question}</div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12}}>
          <button className="btn ghost" onClick={reveal}>Show Answer ▾</button>
          <button className="btn" onClick={next}>Next</button>
        </div>
        {showAnswer && <div style={{marginTop:12}} className="card">Answer: {q.content?.answer || q.answer}</div>}
      </div>

      {showDashboard && <ScoreDashboard answers={answers} questions={questions} onClose={()=>{ setShowDashboard(false); setAnswers([]); setIndex(0); }} />}
    </div>
  );
}
