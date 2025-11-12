// src/practice/Analogies.jsx
import React, { useState } from 'react';
import RenderWithMath from '../shared/RenderWithMath';
import ScoreDashboard from '../shared/ScoreDashboard';

export default function Analogies({ questions }) {
  const [index, setIndex] = useState(0);
  const [showAns, setShowAns] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  if (!questions || questions.length === 0) return <div className="card">No Analogy questions.</div>;
  const q = questions[index];
  const prompt = q.content?.question || q.content?.analogy || q.question || '';
  const answer = q.content?.answer || q.answer || '';

  function next() {
    const nextIdx = index + 1;
    if (nextIdx >= questions.length) setShowDashboard(true);
    else {
      setIndex(nextIdx);
      setShowAns(false);
    }
  }

  return (
    <div>
      <div className="card">
        <div className="muted">Question {index + 1} / {questions.length}</div>

        <div className="question" style={{ marginTop: 8 }}>
          <RenderWithMath text={prompt} />
        </div>

        <div style={{ display:'flex', gap:8, marginTop:12 }}>
          <button className="btn ghost" onClick={() => setShowAns(true)}>Show Answer</button>
          <button className="btn" onClick={next}>{index + 1 === questions.length ? 'Finish' : 'Next'}</button>
        </div>

        {showAns && (
          <div className="card" style={{ marginTop: 10, background:'rgba(99,102,241,0.05)' }}>
            <strong>Answer:</strong> <RenderWithMath text={String(answer)} />
          </div>
        )}
      </div>

      {showDashboard && (
        <ScoreDashboard
          // study-only: we don’t grade; we just show what was reviewed
          answers={questions.map((qq, i) => ({
            qIndex: i,
            question: qq,
            given: 'viewed',
            correct: qq.content?.answer ?? qq.answer ?? '',
            isCorrect: true
          }))}
          questions={questions}
          onClose={() => { setShowDashboard(false); setIndex(0); setShowAns(false); }}
        />
      )}
    </div>
  );
}
