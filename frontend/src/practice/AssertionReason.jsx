import React, { useState } from 'react';
import RenderWithMath from '../shared/RenderWithMath';
import ScoreDashboard from '../shared/ScoreDashboard';

export default function AssertionReason({ questions }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showDashboard, setShowDashboard] = useState(false);

  const q = questions && questions.length ? questions[index] : null;
  if (!q) return <div className="card">No Assertion/Reason questions available.</div>;

  // safe fallback for options
  const opts = q.content?.options || { A: 'A', B: 'B', C: 'C', D: 'D' };

  function submitOption(opt) {
    const correct = q.content?.answer_option || q.content?.answer || q.answer_option || q.answer;
    const isCorrect = String(opt) === String(correct);
    setAnswers(a => [...a, {
      qIndex: index,
      question: q,
      given: opt,
      correct,
      isCorrect,
      explanation: q.content?.answer_explanation
    }]);
    const next = index + 1;
    if (next >= questions.length) setShowDashboard(true);
    else setIndex(next);
  }

  return (
    <div>
      <div className="card">
        <div className="muted">Question {index + 1} / {questions.length}</div>

        <div style={{ marginTop: 10, fontWeight: 700 }}>Assertion</div>
        <div style={{ marginTop: 6 }}>
          <RenderWithMath text={q.content?.assertion || ''} />
        </div>

        <div style={{ marginTop: 10, fontWeight: 700 }}>Reason</div>
        <div style={{ marginTop: 6 }}>
          <RenderWithMath text={q.content?.reason || ''} />
        </div>

        <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
          {Object.entries(opts).map(([k, v]) => (
            <button
              key={k}
              className="option"
              onClick={() => submitOption(k)}
              style={{ textAlign: 'left' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{k}.</strong> <RenderWithMath text={v} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {showDashboard && (
        <ScoreDashboard
          answers={answers}
          questions={questions}
          onClose={() => { setShowDashboard(false); setAnswers([]); setIndex(0); }}
        />
      )}
    </div>
  );
}
