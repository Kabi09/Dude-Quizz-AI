import React, { useState, useMemo } from 'react';
import RenderWithMath from '../shared/RenderWithMath';
import ScoreDashboard from '../shared/ScoreDashboard';

function norm(v) {
  return String(v ?? '').trim();
}

function buildOptions(q) {
  const raw = q?.content?.options ?? q?.options ?? {};
  // allow {A:"..."...} or ["...","..."]
  if (Array.isArray(raw)) {
    const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const obj = {};
    raw.forEach((v, i) => { obj[labels[i]] = v; });
    return obj;
  }
  return raw;
}

export default function MultipleStatement({ questions }) {
  if (!questions || questions.length === 0) {
    return <div className="card">No Multiple Statement questions.</div>;
  }

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showDashboard, setShowDashboard] = useState(false);

  const q = questions[index];
  const prompt = q?.content?.question || q?.question || '';
  const stmts = q?.content?.statements || q?.statements || [];
  const opts = useMemo(() => buildOptions(q), [q]);

  // answer can be "A"/"B"... or full option text
  const answerRaw = q?.content?.answer_option ?? q?.content?.answer ?? q?.answer_option ?? q?.answer;

  function submitOpt(optKey) {
    const pickedKey = String(optKey);
    const correctKeyOrText = answerRaw;

    // If the stored answer is a letter, compare letters.
    // If it's full text, compare the rendered text.
    const pickedText = opts[pickedKey];
    const isLetter = /^[A-Za-z]$/.test(norm(correctKeyOrText));

    const isCorrect = isLetter
      ? norm(pickedKey) === norm(correctKeyOrText)
      : norm(pickedText) === norm(correctKeyOrText);

    setAnswers(prev => [...prev, {
      qIndex: index,
      question: q,
      given: pickedKey,
      correct: isLetter ? norm(correctKeyOrText) : norm(correctKeyOrText), // show what you stored
      isCorrect
    }]);

    const next = index + 1;
    if (next >= questions.length) setShowDashboard(true);
    else setIndex(next);
  }

  return (
    <div>
      <div className="card">
        <div className="muted">Question {index + 1} / {questions.length}</div>

        {/* Show question line if present (e.g., GST item) */}
        {prompt ? (
          <div className="question" style={{ marginTop: 8 }}>
            <RenderWithMath text={prompt} />
          </div>
        ) : null}

        {/* Statements */}
        {stmts.length > 0 && (
          <div style={{ marginTop: 10 }}>
            {stmts.map((s, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                {s?.text ? s.text : s}
              </div>
            ))}
          </div>
        )}

        {/* Options */}
        <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
          {Object.entries(opts).map(([k, v]) => (
            <button
              key={k}
              className="option"
              onClick={() => submitOpt(k)}
              style={{ textAlign: 'left' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><strong>{k}.</strong> <RenderWithMath text={v} /></div>
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
