// src/practice/Ordering.jsx
import React, { useEffect, useRef, useState } from "react";
import RenderWithMath from "../shared/RenderWithMath";
import ScoreDashboard from "../shared/ScoreDashboard";

/* -------- helpers -------- */

// Pull tokens from the *last* (...) group at the end of question text
function extractItemsFromQuestion(questionText = "") {
  const m = questionText.match(/\(([^()]*)\)\s*$/);
  if (!m) return [];
  return m[1]
    .split(/[,\u060C]/)         // split by comma variants
    .map(s => s.trim())
    .filter(Boolean);
}

// Build the correct order by the appearance of item tokens inside the free-text answer
function deriveCorrectOrderFromAnswer(answerText = "", items = []) {
  const order = items
    .map(it => ({ it, idx: answerText.indexOf(it) }))
    .filter(x => x.idx >= 0)
    .sort((a, b) => a.idx - b.idx)
    .map(x => x.it);

  return order.length ? order : items.slice();
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* -------- component -------- */

export default function Ordering({ questions }) {
  if (!questions || questions.length === 0) {
    return <div className="card">No Ordering questions.</div>;
  }

  const [qIndex, setQIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [showDash, setShowDash] = useState(false);

  const q = questions[qIndex];
  const prompt = q?.content?.question || q?.question || "Order the following:";
  const itemsFromQ = extractItemsFromQuestion(prompt);
  const correctOrder = deriveCorrectOrderFromAnswer(q?.content?.answer || q?.answer || "", itemsFromQ);
  const correctStatement = String(q?.content?.answer || q?.answer || "");

  // working list (shuffled once per question)
  const [order, setOrder] = useState(() => shuffle(itemsFromQ));

  useEffect(() => {
    setOrder(shuffle(itemsFromQ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIndex]);

  /* ----- Long-press drag (pure React, no libs) ----- */
  const draggingIdx = useRef(null);
  const pressTimer = useRef(null);
  const startY = useRef(0);

  function onPressStart(e, idx) {
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    startY.current = y;
    pressTimer.current = setTimeout(() => {
      draggingIdx.current = idx;
      document.body.style.userSelect = "none";
    }, 200); // long-press delay (ms)
  }

  function onMove(e) {
    if (draggingIdx.current === null) return;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const delta = y - startY.current;

    const pos = draggingIdx.current;
    let target = pos;
    if (delta > 22) target = pos + 1;
    if (delta < -22) target = pos - 1;

    if (target < 0 || target >= order.length || target === pos) return;

    const a = [...order];
    [a[pos], a[target]] = [a[target], a[pos]];
    setOrder(a);

    draggingIdx.current = target;
    startY.current = y;
  }

  function onPressEnd() {
    clearTimeout(pressTimer.current);
    draggingIdx.current = null;
    document.body.style.userSelect = "auto";
  }

  /* ----- Flow / grading ----- */
  function submit() {
    const given = order.slice();
    const sameLen = given.length === correctOrder.length;
    const isCorrect = sameLen && JSON.stringify(given) === JSON.stringify(correctOrder);

    // IMPORTANT: put the FULL statement into `correct` so ScoreDashboard shows it nicely
    const row = {
      qIndex,
      question: q,
      given,                     // user's order (array)
      correct: correctStatement, // full free-text statement you asked to display
      isCorrect,
      // (optional) keep order for debugging:
      correctOrder               // array used for checking
    };

    const next = qIndex + 1;
    if (next >= questions.length) {
      setResults(prev => [...prev, row]);
      setShowDash(true);
    } else {
      setResults(prev => [...prev, row]);
      setQIndex(next);
    }
  }

  function restart() {
    setResults([]);
    setQIndex(0);
    setShowDash(false);
  }

  if (!itemsFromQ.length) {
    return (
      <div className="card">
        Couldn’t parse items. Please put them in parentheses at the end of the question.
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="muted">Question {qIndex + 1} / {questions.length}</div>

        <div style={{ marginTop: 8, fontWeight: 700 }}>
          <RenderWithMath text={prompt} />
        </div>

        <div style={{ marginTop: 14 }}>
          {order.map((text, i) => {
            const isActive = draggingIdx.current === i;
            return (
              <div
                key={i}
                onMouseDown={e => onPressStart(e, i)}
                onTouchStart={e => onPressStart(e, i)}
                onMouseMove={onMove}
                onTouchMove={onMove}
                onMouseUp={onPressEnd}
                onTouchEnd={onPressEnd}
                className="card"
                style={{
                  padding: "16px",
                  marginBottom: 10,
                  background: "white",
                  borderRadius: 14,
                  fontSize: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "grab",
                  touchAction: "none",
                  transition: "transform 0.18s ease, opacity 0.2s",
                  transform: isActive ? "scale(1.03)" : "scale(1)",
                  boxShadow: isActive
                    ? "0 6px 18px rgba(0,0,0,0.15)"
                    : "0 2px 8px rgba(0,0,0,0.08)",
                  opacity: isActive ? 0.85 : 1
                }}
                aria-label={`Reorder item ${i + 1}`}
              >
                <RenderWithMath text={text} />
                <span style={{ fontSize: 24, opacity: 0.4 }}>☰</span>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
          <button className="btn" onClick={submit}>
            {qIndex + 1 === questions.length ? "Submit & Finish" : "Submit & Next"}
          </button>
        </div>
      </div>

      {showDash && (
        <ScoreDashboard
          answers={results}
          questions={questions}
          onClose={restart}
        />
      )}
    </div>
  );
}
