import React from 'react';
import { useNavigate } from 'react-router-dom';
import RenderWithMath from './RenderWithMath';

// helper to extract text from option value that may be string or object
function extractText(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);

  if (typeof v.text === 'string') return v.text;
  if (typeof v.label === 'string') return v.label;
  if (typeof v.value === 'string') return v.value;
  if (typeof v.content === 'string') return v.content;

  if (v.content && typeof v.content === 'object') {
    if (typeof v.content.question === 'string') return v.content.question;
    if (typeof v.content.text === 'string') return v.content.text;
    if (v.content.options) return JSON.stringify(v.content.options);
  }

  for (const k of Object.keys(v)) {
    const val = v[k];
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return String(val);
    if (val && typeof val === 'object' && typeof val.text === 'string') return val.text;
  }
  try { return JSON.stringify(v); } catch(e) { return String(v); }
}

function trimStr(s) {
  if (s === null || s === undefined) return '';
  return String(s).trim();
}

export default function ScoreDashboard({ answers = [], questions = [], onClose = () => {}, isFill = false }) {
  const navigate = useNavigate();
  const total = answers.length;
  const correctCount = answers.filter(a => a.isCorrect).length;
  const pct = total ? Math.round((correctCount / total) * 100) : 0;

  function tryAnotherUnit() {
    const q0 = questions && questions.length ? questions[0] : null;
    const cls = q0?.class || q0?.content?.class || q0?.classId;
    const sub = q0?.subject;
    if (cls && sub) {
      navigate(`/classes/${cls}/subjects/${encodeURIComponent(sub)}/units`);
    } else {
      navigate('/');
    }
  }

  return (
    <div style={{
      position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
      background: 'rgba(10, 12, 20, 0.48)', padding: 18, zIndex: 60
    }}>
      <div style={{width:'min(980px, 96%)', maxHeight:'90vh', overflowY:'auto', borderRadius:14, padding:18, background:'var(--card)', boxShadow:'0 18px 60px rgba(2,6,23,0.36)'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
          <div>
            <div style={{fontSize:20, fontWeight:800}}>Score</div>
            <div className="muted">You answered {correctCount} of {total} correctly — {pct}%</div>
          </div>
          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            <button className="btn ghost" onClick={onClose}>Close</button>
          </div>
        </div>

        <div style={{display:'grid', gap:12, marginTop:12}}>
          {answers.map((a, i) => {
            const q = a.question || null;

            // Prefer showing the left item for matching questions when present
            const leftTextRaw = a.left ?? null;
            const qPromptFromQ = q?.content?.question || q?.content?.prompt || q?.content?.statement || q?.question || null;

            // Compute the question text to display:
            // 1) left (for matches), 2) question prompt from q, 3) generic 'Question'
            const qText = leftTextRaw ? leftTextRaw : (qPromptFromQ ? qPromptFromQ : 'Question');

            // Determine user's chosen text and correct text
            let userRaw = a.selectedText ?? a.selected ?? a.given ?? a.givenAnswer ?? a.leftGiven ?? a.givenAnswerText ?? null;
            let correctRaw = a.correct ?? a.correctText ?? a.expected ?? null;

            // For match results, sometimes given/correct are the right-side text already.
            // If userRaw is not present but a.given exists separately, try a.given.
            if (!userRaw && a.given && typeof a.given === 'string') userRaw = a.given;

            // If correctRaw missing and a.correct exists as mapping, use it
            if (!correctRaw && a.correct && typeof a.correct === 'string') correctRaw = a.correct;

            // If options exist in question, map keys (A/B/C) to option texts
            const opts = q?.content?.options || q?.options || null;
            if (opts) {
              if (userRaw && typeof userRaw === 'string' && opts[userRaw]) {
                userRaw = opts[userRaw];
              }
              if (correctRaw && typeof correctRaw === 'string' && opts[correctRaw]) {
                correctRaw = opts[correctRaw];
              }
            }

            const userText = extractText(userRaw);
            const correctText = extractText(correctRaw);

            return (
              <div key={i} className="card" style={{display:'flex',flexDirection:'column',gap:8}}>
                <div style={{fontWeight:700}}>{i+1}. <RenderWithMath text={qText} /></div>

                {/* If options are present, show them with visual indicators */}
                {opts && (
                  <div style={{display:'grid',gap:8}}>
                    {Object.entries(opts).map(([k,v]) => {
                      const vText = extractText(v);
                      // compare trimmed strings for safety
                      const isCorrectOpt = trimStr(vText) === trimStr(correctText);
                      const isChosen = trimStr(vText) === trimStr(userText);
                      return (
                        <div key={k} style={{
                          padding:10, borderRadius:8, border: '1px solid #eef2ff',
                          background: isCorrectOpt ? 'rgba(16,185,129,0.06)' : (isChosen && !isCorrectOpt ? 'rgba(239,68,68,0.04)' : 'transparent'),
                          display:'flex', justifyContent:'space-between', alignItems:'center'
                        }}>
                          <div><strong>{k}.</strong> <RenderWithMath text={vText} /></div>
                          <div style={{fontWeight:700, color: isCorrectOpt ? 'var(--success)' : (isChosen ? 'var(--danger)' : 'var(--muted)')}}>
                            {isCorrectOpt ? 'Correct' : (isChosen ? 'Your choice' : '')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* For matching / custom results, we skip the options grid and show the chosen vs correct directly */}
                <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
                  <div style={{padding:8,borderRadius:8, border:'1px solid #eef2ff', background: a.isCorrect ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.04)', color: a.isCorrect ? 'var(--success)' : 'var(--danger)', fontWeight:700}}>
                    {a.isCorrect ? 'Correct' : 'Wrong'}
                  </div>

                 {/* === Intha Code-a Paste Pannunga === */}

{/* Correct Answer Box (Always show) */}
<div style={{
  padding: '6px 10px',
  borderRadius: '8px',
  border: '1px solid rgba(16, 185, 129, 0.2)',
  display: 'inline-flex', 
  alignItems: 'center',
  fontSize: '14px',
  background: 'rgba(16, 185, 129, 0.08)',
  color: '#065f46',
}}>
  {/* Label */}
  <span style={{ color: '#6b7280', fontWeight: 500, marginRight: '8px' }}>
    Answer:
  </span>
  {/* Answer */}
  <strong style={{ fontWeight: 700 }}>
    <RenderWithMath text={correctText || '—'} />
  </strong>
</div>

{/* Your Answer Box (Only show if you were wrong) */}
{!a.isCorrect && (
  <div style={{
    padding: '6px 10px',
    borderRadius: '8px',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '14px',
    background: 'rgba(239, 68, 68, 0.08)',
    color: '#b91c1c', 
  }}>
    {/* Label */}
    <span style={{ color: '#6b7280', fontWeight: 500, marginRight: '8px' }}>
      You:
    </span>
    {/* Answer */}
    <strong style={{ fontWeight: 700 }}>
      <RenderWithMath text={userText || '—'} />
    </strong>
  </div>
)}

{/* === Pazhaya Code-a Ithu Replace Pannidum === */}
                  { (a.correction || q?.content?.correction) && <div style={{marginLeft:12,color:'var(--muted)'}}>Correction: <strong>{a.correction || q?.content?.correction}</strong></div>}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12}}>
          <div className="muted">Review complete — improve your weak areas!</div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn ghost" onClick={tryAnotherUnit}>Try another unit</button>
            <button className="btn" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
