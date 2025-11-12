import React, { useState, useMemo } from 'react';
import ScoreDashboard from '../shared/ScoreDashboard';

export default function PracticeFill({ questions }) {
  if (!questions || questions.length === 0) return <div className="card">No fill questions.</div>;

  const blanks = questions.map((q, idx) => ({
    id: q._id || idx,
    question: q.content?.question || q.question,
    answer: (q.content?.answer || q.answer || '').toString()
  }));

  const [inputs, setInputs] = useState(() => Object.fromEntries(blanks.map(b => [b.id, ''])));
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState([]);

  const pool = useMemo(() => {
    const arr = blanks.map(b => b.answer);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [questions]);

  function handleChange(id, val) {
    setInputs(prev => ({ ...prev, [id]: val }));
  }

  function handleSubmit() {
    const res = blanks.map((b, i) => {
      const given = (inputs[b.id] || '').trim();
      const correct = b.answer.trim();
      return { qIndex: i, id: b.id, question: b.question, given, correct, isCorrect: given === correct };
    });
    setResults(res);
    setSubmitted(true);
  }

  function reset() {
    setInputs(Object.fromEntries(blanks.map(b => [b.id, ''])));
    setSubmitted(false);
    setResults([]);
  }

  return (
    <div>
      <div className="card">
        <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:12}}>
          <div>
            <h4>Fill the blanks</h4>
            <div style={{display:'grid',gap:10, marginTop:8}}>
              {blanks.map((b, idx) => {
                const res = results.find(r => r.id === b.id);
                return (
                  <div key={b.id} className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{flex:1}}>{idx+1}. {b.question}</div>
                    <div style={{minWidth:220, marginLeft:12}}>
                      <input value={inputs[b.id]} onChange={e => handleChange(b.id, e.target.value)} placeholder="Type answer" style={{
                        width:'100%', padding:'10px', borderRadius:10, border: '1px solid #e6eef8'
                      }} />
                      {submitted && res && (
                        <div style={{marginTop:6, fontSize:13}}>
                          {res.isCorrect ? <span style={{color:'var(--success)', fontWeight:700}}>Correct</span> : <span style={{color:'var(--danger)', fontWeight:700}}>Wrong — Correct: {res.correct}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4>Answer pool</h4>
            <div style={{display:'grid',gap:8, marginTop:8}}>
              {pool.map((p,i)=>(
                <div key={i} className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>{p}</div>
                  <div style={{display:'flex',gap:6}}>
                    {blanks.map(b => (
                      <button key={b.id + '-' + i} className="btn ghost" onClick={() => handleChange(b.id, p)} style={{fontSize:12}}>to {blanks.indexOf(b)+1}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{display:'flex',justifyContent:'flex-end',marginTop:12,gap:8}}>
          <button className="btn ghost" onClick={reset}>Reset</button>
          <button className="btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>

      {submitted && <ScoreDashboard answers={results} questions={questions} onClose={() => { setSubmitted(false); setResults([]); }} isFill />}
    </div>
  );
}
