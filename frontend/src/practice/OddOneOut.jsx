import React, { useState } from 'react';
import RenderWithMath from '../shared/RenderWithMath';
import ScoreDashboard from '../shared/ScoreDashboard';

/**
 * OddOneOut
 * - Expects `questions` prop (array). Uses questions[index].
 * - Each question.content should have `options` (object A/B/C/D -> text) and `answer` (key like 'D' or the actual text).
 * - Renders options, accepts click / Enter key (A-D) shortcuts, shows ScoreDashboard at end.
 */
export default function OddOneOut({ questions }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showDashboard, setShowDashboard] = useState(false);

  if (!questions || questions.length === 0) return <div className="card">No Odd-One-Out questions available.</div>;
  const q = questions[index];

  const opts = q?.content?.options || {};
  // support answer given either as key ('A') or as text; prefer key if it matches one of the options
  const correctKey = (() => {
    const raw = q?.content?.answer ?? q?.answer ?? '';
    if (!raw) return null;
    const r = String(raw).trim();
    if (opts[r]) return r; // raw is a key like 'A'
    // otherwise try to find matching option by text (trim compare)
    const found = Object.entries(opts).find(([k, v]) => String(v || '').trim() === r.trim());
    return found ? found[0] : r;
  })();

  function submit(keyOrText) {
    // Accept either the option key (A/B/...) or full text (rare)
    let givenKey = keyOrText;
    if (typeof keyOrText === 'string' && !opts[keyOrText] ) {
      // try to resolve from text -> key
      const found = Object.entries(opts).find(([k, v]) => String(v || '').trim() === String(keyOrText).trim());
      if (found) givenKey = found[0];
    }

    const isCorrect = String(givenKey) === String(correctKey);
    setAnswers(a => [...a, { qIndex: index, question: q, given: givenKey, correct: correctKey, isCorrect }]);

    const next = index + 1;
    if (next >= questions.length) setShowDashboard(true);
    else setIndex(next);
  }

  // keyboard shortcuts: A/B/C/D or 1/2/3/4
  React.useEffect(() => {
    function onKey(e) {
      const k = e.key.toLowerCase();
      if (['a','b','c','d'].includes(k)) {
        submit(k.toUpperCase());
      } else if (['1','2','3','4'].includes(k)) {
        const mapping = { '1':'A','2':'B','3':'C','4':'D' };
        submit(mapping[k]);
      } else if (k === 'enter') {
        // optional: do nothing / future behavior
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, q]); // re-register when index/q changes

  return (
    <div>
      <div className="card">
        <div className="muted">Question {index + 1} / {questions.length}</div>

        <div style={{ marginTop: 10, fontWeight: 700 }}>
          <RenderWithMath text={q.content?.question || q.content?.prompt || q.content?.instruction || 'Select the odd one out'} />
        </div>

        <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
          {Object.entries(opts).map(([k, v]) => (
            <button
              key={k}
              className="option"
              onClick={() => submit(k)}
              style={{ textAlign: 'left' }}
              aria-label={`Option ${k}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><strong>{k}.</strong> <RenderWithMath text={v} /></div>
              
              </div>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
        
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
