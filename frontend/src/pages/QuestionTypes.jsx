// QuestionTypes.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // ⭐ uses Link for breadcrumbs
import { getQuestions } from '../api';
import LoadingSpinner from "../components/LoadingSpinner";

export default function QuestionTypes() {
  const { classId, subject, unit_no, unit_name } = useParams();
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    setLoading(true);

    getQuestions({ class: classId, subject, unit_no, unit_name })
      .then((qs) => {
        // ⭐ SECTION LOGIC FROM OLD CODE
        const map = new Map();
        qs.forEach((q) => {
          const t = (q.type || 'MCQ').toString();
          const sec = (q.section || q.content?.section || '').toString().trim();

          if (!map.has(t)) map.set(t, new Set());
          if (sec) map.get(t).add(sec);
        });

        const arr = Array.from(map.entries()).map(([type, sectionSet]) => {
          const sections = Array.from(sectionSet);
          return { type, sections };
        });

        if (arr.length === 0) {
          setTypes([
            {
              type: 'MCQ',
              sections: ['I. சரியான விடையைத் தேர்வு செய்யவும்'],
            },
          ]);
        } else {
          setTypes(arr);
        }

        setLoading(false);
      })
      .catch(() => {
        setTypes([
          {
            type: 'MCQ',
            sections: ['I. சரியான விடையைத் தேர்வு செய்யவும்'],
          },
        ]);
        setLoading(false);
      });
  }, [classId, subject, unit_no, unit_name]);

  return (
    <div>
      {/* ⭐ CLICKABLE BREADCRUMBS */}
      <div className="breadcrumbs">
        <Link to="/" className="crumb-link">
          Class {classId}
        </Link>
        <span> • </span>

        <Link
          to={`/classes/${classId}/subjects`}
          className="crumb-link"
        >
          {subject}
        </Link>
        <span> • </span>

        <Link
          to={`/classes/${classId}/subjects/${encodeURIComponent(
            subject
          )}/units`}
          className="crumb-link"
        >
          Unit {unit_no}
        </Link>
        <span> • </span>

        <span className="muted">Question Types</span>
      </div>

      <h2 style={{ marginTop: 0 }}>Question Types</h2>

      {loading ? (
  <LoadingSpinner />
       ) : (
        <div className="grid cols-3">
          {types.map(({ type, sections }) => {
            const displaySections =
              sections && sections.length
                ? sections.join(' · ')
                : 'Practice questions';

            return (
              <div
                key={type}
                className="card clickable"
                onClick={() =>
                  nav(
                    `/practice/${classId}/${encodeURIComponent(
                      subject
                    )}/${unit_no}/${encodeURIComponent(
                      unit_name
                    )}/${encodeURIComponent(type)}`
                  )
                }
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{type}</div>
                  <div className="muted">{displaySections}</div>
                  <div className="muted">Start →</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
