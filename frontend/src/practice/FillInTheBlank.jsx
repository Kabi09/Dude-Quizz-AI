import React, { useState, useMemo } from 'react';
import RenderWithMath from '../shared/RenderWithMath';
import ScoreDashboard from '../shared/ScoreDashboard';

// Drag-and-drop fill in the blank
export default function FillInTheBlank({ questions }) {
  if (!questions || questions.length === 0) return <div className="card">No Fill-in-the-Blank questions.</div>;

  const blanks = questions.map((q, idx) => ({
    id: q._id || idx,
    prompt: q.content?.question || q.question,
    answer: (q.content?.answer || q.answer || '').toString()
  }));

  const [assignments, setAssignments] = useState(() => ({})); // id -> answer
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState([]);
  
  const [draggingItem, setDraggingItem] = useState(null); 
  const [dragOverId, setDragOverId] = useState(null);   

  const pool = useMemo(() => {
    const arr = blanks.map(b => b.answer);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [questions]);

  const usedAnswers = useMemo(() => {
    return new Set(Object.values(assignments));
  }, [assignments]);

  // drag handlers
  function onDragStart(e, value) {
    e.dataTransfer.setData('text/plain', value);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingItem(value);
  }
  function onDragEnd() {
    setDraggingItem(null);
  }

  function onDropBlank(e, id) {
    e.preventDefault();
    const val = e.dataTransfer.getData('text/plain');
    setAssignments(a => ({ ...a, [id]: val }));
    setDragOverId(null);
  }
  function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }
  function onDragEnter(e, id) {
    e.preventDefault();
    setDragOverId(id);
  }
  function onDragLeave() {
    setDragOverId(null);
  }

  function handleSubmit() {
    const res = blanks.map((b, i) => {
      const given = assignments[b.id] || '';
      const correct = b.answer || '';
      return {
        qIndex: i,
        id: b.id,
        prompt: b.prompt,
        given,
        correct,
        isCorrect: given === correct,
        question: { content: { question: b.prompt } }
      };
    });
    setResults(res);
    setSubmitted(true);
  }

  function resetAll() {
    setAssignments({});
    setSubmitted(false);
    setResults([]);
  }

  return (
    <div>
      <div className="card fill-layout-container">
        
        {/* === Questions Column === */}
        <div className="question-list-container">
          <h4>Questions</h4>
          <div className="question-list">
            {blanks.map((b,i)=> (
              <div 
                key={b.id} 
                className="card question-drop-card" 
                onDragOver={onDragOver} 
                onDragEnter={(e) => onDragEnter(e, b.id)}
                onDragLeave={onDragLeave}
                onDrop={(e)=>onDropBlank(e,b.id)} 
              >
                
                {/* === START: INTHA THAAN FIX === */}
                {/* Namma string-a JSX-a maathitom */}
                <div style={{flex:1}}>
                  <strong>{i+1}.</strong> {/* Ithu ippo HTML tag, string illa */}
                  <RenderWithMath text={b.prompt} /> {/* Matha text-a mattum send pannurom */}
                </div>
                {/* === END: FIX === */}

                <div 
                  className={`drop-target ${assignments[b.id] ? 'filled' : ''} ${dragOverId === b.id ? 'drag-over' : ''}`}
                >
                  {assignments[b.id] ? 
                    <RenderWithMath text={assignments[b.id]} /> 
                    : <span className="muted">Drop answer here</span>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* === Answer Pool Column === */}
        <div className="answer-pool-sidebar">
          <h4>Answer Pool</h4>
          <div className="answer-pool-list">
            {pool.map((p,i) => {
              const isUsed = usedAnswers.has(p) && draggingItem !== p;
              return (
                <div 
                  key={i} 
                  className={`card draggable-answer ${draggingItem === p ? 'dragging' : ''} ${isUsed ? 'used' : ''}`}
                  draggable={!isUsed && !submitted} 
                  onDragStart={!isUsed ? (e)=>onDragStart(e,p) : null}
                  onDragEnd={onDragEnd}
                  style={{ cursor: isUsed || submitted ? 'not-allowed' : 'grab' }}
                >
                  <RenderWithMath text={p} />
                  <div className="drag-icon">⠿</div>
                </div>
              );
            })}
          </div>

          <div style={{marginTop:12, display:'flex',justifyContent:'space-between'}}>
            <button className="btn ghost" onClick={resetAll} disabled={submitted}>Reset</button>
            <button className="btn" onClick={handleSubmit} disabled={submitted}>Submit</button>
          </div>
        </div>
      </div>

      {submitted && <ScoreDashboard 
        answers={results} 
        questions={questions} 
        onClose={()=>{ setSubmitted(false); setResults([]); setAssignments({}); }} 
        isFill 
      />}
    </div>
  );
}