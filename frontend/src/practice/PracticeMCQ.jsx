import React, { useState, useMemo, useEffect, useRef } from 'react';
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

// correct text for any question
function getCorrectTextForQuestion(question) {
  if (!question) return '';
  const ansKey = question.content?.answer ?? question.answer;
  if (question.content?.options && ansKey && typeof question.content.options[ansKey] !== 'undefined') {
    return extractText(question.content.options[ansKey]);
  }
  return extractText(ansKey);
}

export default function PracticeMCQ({ questions }) {
  const [index, setIndex] = useState(0);

  // per-question answers
  const [answers, setAnswers] = useState([]);
  const [showDashboard, setShowDashboard] = useState(false);

  // 🔹 store auto-next timeout id
  const autoNextRef = useRef(null);

  const total = questions ? questions.length : 0;
  const q = questions && questions.length ? questions[index] : null;

  // init / reset whenever questions change
  useEffect(() => {
    if (!questions || !questions.length) {
      setAnswers([]);
      setIndex(0);
      setShowDashboard(false);
      if (autoNextRef.current) {
        clearTimeout(autoNextRef.current);
        autoNextRef.current = null;
      }
      return;
    }

    const initAnswers = questions.map((question, i) => ({
      qIndex: i,
      selectedText: null,
      correctText: getCorrectTextForQuestion(question),
      isCorrect: false,
      isAnswered: false,
      question,
    }));

    setAnswers(initAnswers);
    setIndex(0);
    setShowDashboard(false);
    if (autoNextRef.current) {
      clearTimeout(autoNextRef.current);
      autoNextRef.current = null;
    }
  }, [questions]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoNextRef.current) {
        clearTimeout(autoNextRef.current);
      }
    };
  }, []);

  if (!q) return <div className="card">No questions found.</div>;

  const currentAnswer = answers[index] || {};
  const isAnswered = !!currentAnswer.isAnswered;
  const selectedText = currentAnswer.selectedText || null;

  // options (shuffled)
  const optionsWithLabels = useMemo(() => {
    if (!q) return [];
    const optsObj = q.content?.options || q.options || {};
    const items = Object.entries(optsObj).map(([k, v]) => ({
      key: k,
      raw: v,
      text: extractText(v),
    }));
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return shuffled.map((it, idx) => ({
      label: labels[idx],
      text: it.text,
      originalKey: it.key,
      raw: it.raw,
    }));
  }, [q, index]);

  const correctText = useMemo(() => {
    if (!q) return '';
    return currentAnswer.correctText || getCorrectTextForQuestion(q);
  }, [q, currentAnswer]);

  // helper to clear auto-next timer
  function clearAutoNext() {
    if (autoNextRef.current) {
      clearTimeout(autoNextRef.current);
      autoNextRef.current = null;
    }
  }

  // Next / Prev
  function handleNext() {
    clearAutoNext();
    setIndex(prev => {
      const next = prev + 1;
      return next < total ? next : prev;
    });
  }

  function handlePrev() {
    clearAutoNext();
    setIndex(prev => {
      const prevIndex = prev - 1;
      return prevIndex >= 0 ? prevIndex : prev;
    });
  }

  // Option click
  function handleOptionClick(option) {
    if (isAnswered) return;

    const selected = option.text;
    const isCorrect = selected === correctText;

    setAnswers(prev => {
      const updated = [...prev];
      const existing = updated[index] || {};
      updated[index] = {
        ...existing,
        qIndex: index,
        selectedText: selected,
        correctText: existing.correctText || correctText,
        isCorrect,
        isAnswered: true,
        question: q,
      };
      return updated;
    });

    // 🔹 auto-next only if not last question
    if (index < total - 1) {
      clearAutoNext();
      autoNextRef.current = setTimeout(() => {
        setIndex(prev => {
          const next = prev + 1;
          return next < total ? next : prev;
        });
        autoNextRef.current = null;
      }, 3000);
    }
  }

  // restart
  function restart() {
    clearAutoNext();
    if (questions && questions.length) {
      const resetAnswers = questions.map((question, i) => ({
        qIndex: i,
        selectedText: null,
        correctText: getCorrectTextForQuestion(question),
        isCorrect: false,
        isAnswered: false,
        question,
      }));
      setAnswers(resetAnswers);
    } else {
      setAnswers([]);
    }
    setIndex(0);
    setShowDashboard(false);
  }

  const imageUrl = q?.image ? getImageUrl(q.image) : null;
  const answeredCount = answers.filter(a => a && a.isAnswered).length;

  return (
    <div>
      <div className="card">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <div className="muted">Question {index + 1} / {total}</div>
          <div className="muted">Answered: {answeredCount}</div>
        </div>

        {/* Prev / Next buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <button
            className="btn ghost"
            onClick={handlePrev}
            disabled={index === 0}
          >
            Previous
          </button>
          <button
            className="btn ghost"
            onClick={handleNext}
            disabled={index === total - 1}
          >
            Next
          </button>
        </div>

        {/* Question */}
        <div className="question">
          <RenderWithMath
            text={q.content?.question || q.content?.statement || q.question || ''}
          />
        </div>

        {/* Image */}
        {imageUrl && (
          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                width: '100%',
                maxWidth: 220,
                aspectRatio: '1 / 1',
                borderRadius: 30,
                overflow: 'hidden',
                background: '#f1f5f9',
                boxShadow:
                  '0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
              }}
            >
              <img
                src={imageUrl}
                alt="image not Found"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Options */}
        <div className="options" style={{ marginTop: 12 }}>
          {optionsWithLabels.map(o => {
            const styleProps = {
              cursor: isAnswered ? 'not-allowed' : 'pointer',
            };

            let statusText = '';
            let statusColor = 'var(--muted)';

            if (isAnswered) {
              const isCorrectOpt = o.text === correctText;
              const isChosen = o.text === selectedText;

              if (isCorrectOpt) {
                styleProps.background =
                  'linear-gradient(90deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.08))';
                styleProps.borderColor = 'var(--success)';
                statusText = 'Correct';
                statusColor = 'var(--success)';
              } else if (isChosen) {
                styleProps.background =
                  'linear-gradient(90deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.08))';
                styleProps.borderColor = 'var(--danger)';
                statusText = 'Your choice';
                statusColor = 'var(--danger)';
              }
            }

            return (
              <div
                key={o.label}
                className="option"
                onClick={() => handleOptionClick(o)}
                style={styleProps}
              >
                <div>
                  <strong>{o.label}.</strong>{' '}
                  <RenderWithMath text={o.text} />
                </div>

                {isAnswered && statusText && (
                  <div style={{ fontWeight: 700, color: statusColor }}>
                    {statusText}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
            marginTop: 14,
          }}
        >
          <button className="btn ghost" onClick={restart}>
            Restart
          </button>

          {/* Submit only on last question */}
          {index === total - 1 && (
            <button
              className="btn primary"
              onClick={() => {
                clearAutoNext();
                setShowDashboard(true);
              }}
            >
              Submit
            </button>
          )}
        </div>
      </div>

      {/* ScoreDashboard */}
      {showDashboard && (
        <ScoreDashboard
          answers={answers}
          questions={questions}
          onClose={() => {
            setShowDashboard(false);
            restart();
          }}
        />
      )}
    </div>
  );
}
