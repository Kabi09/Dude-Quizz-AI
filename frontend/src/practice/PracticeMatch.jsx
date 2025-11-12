// src/practice/PracticeMatch.jsx
import React, { useState, useMemo } from 'react';
import RenderWithMath from '../shared/RenderWithMath';
import ScoreDashboard from '../shared/ScoreDashboard';

export default function PracticeMatch({ questions }) {
  if (!questions || questions.length === 0) return <div className="card">No match questions.</div>;

  // 🔧 NEW: support multiple questions
  const [index, setIndex] = useState(0);
  const [allAnswers, setAllAnswers] = useState([]);   // accumulate per-question results
  const [submitted, setSubmitted] = useState(false);  // dashboard toggle

  const q = questions[index];

  // read columns/answers for the current question
  const column1 = q.content?.column_1 || q.content?.left || q.left || [];
  const column2 = q.content?.column_2 || q.content?.right || q.right || [];
  const answers = q.content?.answers || []; // [{ item, match }]

  // build correct map
  const correctMap = useMemo(() => {
    const m = {};
    answers.forEach(a => { m[a.item] = a.match; });
    return m;
  }, [answers]);

  // per-question working state
  const [mapping, setMapping] = useState({});
  const [selectedLeft, setSelectedLeft] = useState(null);

  // reshuffle right column WHEN question changes
  const shuffledRight = useMemo(() => {
    const arr = [...column2];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [index]); // depend on index so each question shuffles independently

  function handleLeftClick(left) {
    setSelectedLeft(prev => (prev === left ? null : left));
  }

  function handleRightClick(right) {
    if (!selectedLeft) return;
    setMapping(m => ({ ...m, [selectedLeft]: right }));
    setSelectedLeft(null);
  }

  function gradeCurrentQuestion() {
    // produce result rows for the current question
    return column1.map((l, i) => {
      const given = mapping[l] || null;
      const correct = correctMap[l] || null;
      return { qIndex: i, left: l, given, correct, isCorrect: given === correct, question: q };
    });
  }

  function handleSubmit() {
    const currentResults = gradeCurrentQuestion();
    const nextIndex = index + 1;

    if (nextIndex >= questions.length) {
      // last question -> show dashboard
      setAllAnswers(prev => [...prev, ...currentResults]);
      setSubmitted(true);
    } else {
      // move to next question, carry accumulated results
      setAllAnswers(prev => [...prev, ...currentResults]);
      setIndex(nextIndex);
      // reset per-question UI state
      setMapping({});
      setSelectedLeft(null);
    }
  }

  function resetAll() {
    setIndex(0);
    setAllAnswers([]);
    setSubmitted(false);
    setMapping({});
    setSelectedLeft(null);
  }

  return (
    <div>
      <div className="card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
          <div className="muted">Question {index + 1} / {questions.length}</div>
        </div>

        <h4>Column A (click to select)</h4>
        <div style={{display:'grid',gap:8,marginTop:8}}>
          {column1.map((l,i)=> {
            const assigned = mapping[l];
            return (
              <div
                key={i}
                className="card"
                style={{
                  display:'flex',justifyContent:'space-between',alignItems:'center',
                  cursor:'pointer',
                  border: selectedLeft===l ? '2px solid var(--primary)' : undefined
                }}
                onClick={()=>handleLeftClick(l)}
              >
                <div><RenderWithMath text={l} /></div>
                <div className="muted">{assigned ? `→ ${assigned}` : '—'}</div>
              </div>
            );
          })}
        </div>

        <div style={{marginTop:14}}>
          <h4>Choices (click to assign to selected left)</h4>
          <div style={{display:'grid',gap:8,marginTop:8}}>
            {shuffledRight.map((r,i)=> (
              <div
                key={i}
                className="card"
                style={{cursor: selectedLeft ? 'pointer' : 'default'}}
                onClick={()=>handleRightClick(r)}
              >
                <RenderWithMath text={r} />
              </div>
            ))}
          </div>
        </div>

        <div style={{display:'flex',justifyContent:'flex-end',marginTop:12,gap:8}}>
          <button className="btn ghost" onClick={resetAll}>Restart</button>
          <button className="btn" onClick={handleSubmit}>{index + 1 === questions.length ? 'Finish' : 'Next'}</button>
        </div>
      </div>

      {submitted && (
        <ScoreDashboard
          answers={allAnswers}
          questions={questions}
          onClose={resetAll}
        />
      )}
    </div>
  );
}
