import React, { useState } from 'react';
import ScoreDashboard from '../shared/ScoreDashboard';

/**
 * ASSERTION–REASON
 */
function AssertionReasonView({ qobj, onSubmit }) {
  const [sel, setSel] = useState(null);

  const choices = [
    { key: 'A', text: 'Assertion true; Reason true; Reason explains Assertion' },
    { key: 'B', text: 'Assertion true; Reason true; Reason does not explain Assertion' },
    { key: 'C', text: 'Assertion false; Reason true' },
    { key: 'D', text: 'Assertion true; Reason false' }
  ];

  return (
    <div>
      <div className="question">{qobj.content?.question}</div>

      <div style={{ fontWeight: 700 }}>Assertion</div>
      <div style={{ marginBottom: 10 }}>{qobj.content?.assertion}</div>

      <div style={{ fontWeight: 700 }}>Reason</div>
      <div style={{ marginBottom: 10 }}>{qobj.content?.reason}</div>

      <div style={{ display: 'grid', gap: 8 }}>
        {choices.map(c => (
          <button
            key={c.key}
            className="option"
            onClick={() => setSel(c.key)}
            style={{ textAlign: 'left' }}
          >
            {c.key}. {c.text}
            {sel === c.key && <b style={{ float: 'right' }}>✓</b>}
          </button>
        ))}
      </div>

      <div style={{ textAlign: 'right', marginTop: 10 }}>
        <button className="btn" disabled={!sel} onClick={() => onSubmit(sel)}>
          Submit
        </button>
      </div>
    </div>
  );
}

/**
 * TRUE / FALSE
 */
function TrueFalseView({ qobj, onSubmit }) {
  const [sel, setSel] = useState(null);

  return (
    <div>
      <div className="question">{qobj.content?.question}</div>

      <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
        <button className="btn ghost" onClick={() => setSel('True')}>True</button>
        <button className="btn ghost" onClick={() => setSel('False')}>False</button>
      </div>

      <div style={{ textAlign: 'right', marginTop: 10 }}>
        <button className="btn" disabled={!sel} onClick={() => onSubmit(sel)}>
          Submit
        </button>
      </div>
    </div>
  );
}

/**
 * MULTIPLE-STATEMENT — TRUE/FALSE for each (OLD STYLE)
 */
function MultipleStatementTFView({ qobj, onSubmit }) {
  const stmts = qobj.content?.statements || [];
  const [sel, setSel] = useState(stmts.map(() => null));

  const update = (i, val) => {
    const c = [...sel];
    c[i] = val;
    setSel(c);
  };

  const canSubmit = sel.every(v => v);

  return (
    <div>
      {stmts.map((s, i) => (
        <div key={i} className="card" style={{ marginBottom: 8 }}>
          {s.text || s}
          <div style={{ display: 'flex', gap: 8, marginTop: 5 }}>
            <button className="btn ghost" onClick={() => update(i, 'True')}>True</button>
            <button className="btn ghost" onClick={() => update(i, 'False')}>False</button>
          </div>
        </div>
      ))}

      <div style={{ textAlign: 'right', marginTop: 10 }}>
        <button className="btn" disabled={!canSubmit} onClick={() => onSubmit(sel)}>
          Submit
        </button>
      </div>
    </div>
  );
}

/**
 * MULTIPLE STATEMENT — MCQ A/B/C/D  ✅ (YOUR JSON FORMAT)
 */
function MultipleStatementOptionView({ qobj, onSubmit }) {
  const [sel, setSel] = useState(null);
  const statements = qobj.content?.statements || [];
  const options = qobj.content?.options || {};

  return (
    <div>
      {qobj.content?.question && (
        <div className="question" style={{ marginBottom: 10 }}>
          {qobj.content.question}
        </div>
      )}

      {statements.map((s, i) => (
        <div key={i} style={{ marginBottom: 5 }}>
          {s}
        </div>
      ))}

      <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
        {Object.entries(options).map(([key, val]) => (
          <button
            key={key}
            className="option"
            style={{ textAlign: 'left' }}
            onClick={() => setSel(key)}
          >
            {key}. {val}
            {sel === key && <b style={{ float: 'right' }}>✓</b>}
          </button>
        ))}
      </div>

      <div style={{ textAlign: 'right', marginTop: 10 }}>
        <button className="btn" disabled={!sel} onClick={() => onSubmit(sel)}>
          Submit
        </button>
      </div>
    </div>
  );
}

/**
 * MAIN
 */
export default function PracticeGeneric({ questions, type }) {
  const [answers, setAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDashboard, setShowDashboard] = useState(false);

  const q = questions[currentIndex];

  if (!q) return <div className="card">No questions.</div>;

  const submitCurrent = (given) => {
    const correct = q.content?.answer;

    let isCorrect =
      Array.isArray(correct)
        ? JSON.stringify(correct) === JSON.stringify(given)
        : String(correct) === String(given);

    setAnswers(prev => [...prev, { qIndex: currentIndex, question: q, given, correct, isCorrect }]);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowDashboard(true);
    }
  };

  const isMCQStatement = q?.content?.options && !Array.isArray(q?.content?.answer);

  return (
    <div>
      <div className="card">

        <div className="muted" style={{ marginBottom: 10 }}>
          Question {currentIndex + 1} / {questions.length}
        </div>

        {type === 'AssertionReason' && <AssertionReasonView qobj={q} onSubmit={submitCurrent} />}

        {type === 'TrueFalse' && <TrueFalseView qobj={q} onSubmit={submitCurrent} />}

        {type === 'MultipleStatement' && isMCQStatement && (
          <MultipleStatementOptionView qobj={q} onSubmit={submitCurrent} />
        )}

        {type === 'MultipleStatement' && !isMCQStatement && (
          <MultipleStatementTFView qobj={q} onSubmit={submitCurrent} />
        )}

      </div>

      {showDashboard && (
        <ScoreDashboard
          answers={answers}
          questions={questions}
          onClose={() => setShowDashboard(false)}
        />
      )}
    </div>
  );
}
