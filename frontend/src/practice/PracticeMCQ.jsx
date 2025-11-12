import React, { useState, useMemo, useEffect } from 'react';
import RenderWithMath from '../shared/RenderWithMath';
import ScoreDashboard from '../shared/ScoreDashboard';
import { getImageUrl } from '../utils/getImageUrl';


// helper to extract text from option value (No change)
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
  try { return JSON.stringify(v); } catch (e) { return String(v); }
}

export default function PracticeMCQ({ questions }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]); 
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null); 
  const [isAnswered, setIsAnswered] = useState(false);      

  const q = questions && questions.length ? questions[index] : null;
  const total = questions ? questions.length : 0;

  // optionsWithLabels (No change)
  const optionsWithLabels = useMemo(() => {
    if (!q) return [];
    const optsObj = q.content?.options || q.options || {};
    const items = Object.entries(optsObj).map(([k, v]) => ({ key: k, raw: v, text: extractText(v) }));
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return shuffled.map((it, idx) => ({ label: labels[idx], text: it.text, originalKey: it.key, raw: it.raw }));
  }, [q, index]);

  // correctText (No change)
  const correctText = useMemo(() => {
    if (!q) return '';
    const ansKey = q.content?.answer ?? q.answer;
    if (q.content?.options && ansKey && typeof q.content.options[ansKey] !== 'undefined') {
      return extractText(q.content.options[ansKey]);
    }
    return extractText(ansKey);
  }, [q]);

  // handleNext (No change)
  function handleNext() {
    const next = index + 1;
    if (next >= total) {
      setShowDashboard(true);
    } else {
      setIndex(next);
      setIsAnswered(false);
      setSelectedOption(null);
    }
  }

  // useEffect for auto-next (No change)
  useEffect(() => {
    if (isAnswered) {
      const timer = setTimeout(() => {
        handleNext();
      }, 1200); 
      return () => clearTimeout(timer);
    }
  }, [isAnswered]); 


  if (!q) return <div className="card">No questions found.</div>;

  // handleOptionClick (No change)
  function handleOptionClick(option) {
    if (isAnswered) return; 
    const selectedText = option.text;
    const isCorrect = selectedText === correctText;
    setSelectedOption(option); 
    setIsAnswered(true);       
    setAnswers(prev => [...prev, { qIndex: index, selectedText, correctText, isCorrect, question: q }]);
  }

  // restart (No change)
  function restart() {
    setIndex(0);
    setAnswers([]);
    setShowDashboard(false);
    setIsAnswered(false);
    setSelectedOption(null);
  }

  const imageUrl = q?.image ? getImageUrl(q.image) : null;

  return (
    <div>
      <div className="card">
        {/* Header (No change) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <div className="muted">Question {index + 1} / {total}</div>
          <div className="muted">Answered: {answers.length}</div>
        </div>

        {/* Question text (No change) */}
        <div className="question">
          <RenderWithMath text={q.content?.question || q.content?.statement || q.question || ''} />
        </div>

        {/* Image (No change) */}
       {imageUrl && (
  <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
    <div style={{ 
      width: '100%', 
      maxWidth: 220, 
      aspectRatio: '1 / 1', 
      borderRadius: 30, 
      overflow: 'hidden', 
      background: '#f1f5f9', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out' 
    }} >
      
      {/* === INGA THAAN FIX === */}
      <img
        src={imageUrl}
        alt={'image not Found'}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain', // <-- 'cover' ku pathila 'contain' use pannunga
          // borderRadius and transition inga theva illa, container laye irukku
        }}
        loading="lazy"
      />
      {/* ===================== */}

    </div>
  </div>
)}


        {/* === START: INGA THAAN STYLE-A MAATHIRUKKOM === */}
        <div className="options" style={{ marginTop: 12 }}>
          {optionsWithLabels.map(o => {
            
            // 1. Inga style-a create pannikalam
            const styleProps = {
              cursor: isAnswered ? 'not-allowed' : 'pointer',
            };
            
            let statusText = ''; 
            let statusColor = 'var(--muted)';

            if (isAnswered) {
              const isCorrectOpt = (o.text === correctText);
              const isChosen = (o.text === selectedOption?.text);

              if (isCorrectOpt) {
                // 2. CSS class-ku pathila, in-line style-a use pannurom (stronger color)
                styleProps.background = 'linear-gradient(90deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.08))';
                styleProps.borderColor = 'var(--success)';
                statusText = 'Correct';
                statusColor = 'var(--success)';
              } else if (isChosen) {
                // 2. CSS class-ku pathila, in-line style-a use pannurom (stronger color)
                styleProps.background = 'linear-gradient(90deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.08))';
                styleProps.borderColor = 'var(--danger)';
                statusText = 'Your choice';
                statusColor = 'var(--danger)';
              }
            }

            return (
              <div
                key={o.label}
                className="option" // Base class
                onClick={() => handleOptionClick(o)}
                style={styleProps} // 3. Inga antha style-a apply pannurom
              >
                {/* Left Side: Question */}
                <div><strong>{o.label}.</strong> <RenderWithMath text={o.text} /></div>

                {/* Right Side: Status Text (like ScoreDashboard) */}
                {isAnswered && statusText && (
                  <div style={{ fontWeight: 700, color: statusColor }}>
                    {statusText}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* === END: MAATHAM MUDINJUTHU === */}

        {/* Restart Button (No change) */}
        <div style={{ display:'flex', justifyContent:'flex-end', marginTop: 14 }}>
          <button className="btn ghost" onClick={restart}>Restart</button>
        </div>
      </div>

      {/* ScoreDashboard (No change) */}
      {showDashboard && (
        <ScoreDashboard
          answers={answers}
          questions={questions}
          onClose={() => { setShowDashboard(false); restart(); }}
        />
      )}
    </div>
  );
}