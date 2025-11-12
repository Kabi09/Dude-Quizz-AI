import React, { useState } from 'react';
import RenderWithMath from '../shared/RenderWithMath';
import ScoreDashboard from '../shared/ScoreDashboard';

export default function TrueFalse({ questions }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showDashboard, setShowDashboard] = useState(false);

  const q = questions && questions.length ? questions[index] : null;
  if (!q) return <div className="card">No True/False questions available.</div>;

  // normalize helper
  const normalize = s => (s || '').toString().trim().toLowerCase();

  // convert a variety of texts to boolean (true/false) when possible
  const toBool = s => {
    const n = normalize(s);
    const map = {
      'true': true,
      'false': false,
      'சரி': true,
      'தவறு': false,
      'yes': true,
      'no': false,
      'correct': true,
      'wrong': false,
      'right': true,
      'incorrect': false,
      't': true,
      'f': false,
      'y': true,
      'n': false,
      '1': true,
      '0': false
    };
    if (Object.prototype.hasOwnProperty.call(map, n)) return map[n];
    // fallback: try exact english words
    if (n === '1' || n === 't' || n === 'y') return true;
    if (n === '0' || n === 'f' || n === 'n') return false;
    // unknown -> return null to indicate unknown mapping
    return null;
  };

  function submitChoice(choice) {
    const correctRaw = q.content?.answer ?? q.answer ?? '';
    const choiceBool = toBool(choice);
    const correctBool = toBool(correctRaw);

    // If both mapped to booleans, compare them. Otherwise fall back to string equality.
    let isCorrect;
    if (choiceBool !== null && correctBool !== null) {
      isCorrect = choiceBool === correctBool;
    } else {
      isCorrect = normalize(choice) === normalize(correctRaw);
    }

    const result = {
      qIndex: index,
      question: q,
      given: choice,
      correct: correctRaw,
      isCorrect,
      correction: q.content?.correction || q.correction || ''
    };

    setAnswers(a => [...a, result]);

    const next = index + 1;
    if (next >= questions.length) setShowDashboard(true);
    else setIndex(next);
  }

  return (
    <div>
      <div className="card">
        <div className="muted">Question {index + 1} / {questions.length}</div>

        <div style={{ marginTop: 12, fontSize: 18, fontWeight: 700 }}>
          <RenderWithMath text={q.content?.statement || q.content?.question || q.question || ''} />
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          {/* show Tamil + English labels so students know both */}
          <button className="btn" onClick={() => submitChoice('சரி')}>சரி (True)</button>
          <button className="btn ghost" onClick={() => submitChoice('தவறு')}>தவறு (False)</button>
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
