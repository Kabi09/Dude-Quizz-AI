// Subjects.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // ⭐ UPDATED: added Link
import { getSubjects } from '../api';
import LoadingSpinner from "../components/LoadingSpinner";


export default function Subjects() {
  const { classId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    setLoading(true);
    getSubjects(classId)
      .then((data) => {
        setSubjects(data);
        setLoading(false);
      })
      .catch(() => {
        setSubjects(['Science', 'Maths', 'Social']);
        setLoading(false);
      });
  }, [classId]);

  return (
    <div>
      {/* ⭐ UPDATED: clickable breadcrumb */}
      <div className="breadcrumbs">
        <Link to="/" className="crumb-link">   {/* ⭐ Class-all (all classes) */}
          Class {classId}
        </Link>
        <span> • </span>
        <span className="muted">Subjects</span> {/* current page – not clickable */}
      </div>

      <h2 style={{ marginTop: 0 }}>Subjects</h2>

      {loading ? (
  <LoadingSpinner />
) : (
        <div className="grid cols-3">
          {subjects.map((s) => (
            <div
              key={s}
              className="card clickable"
              onClick={() =>
                nav(
                  `/classes/${classId}/subjects/${encodeURIComponent(
                    s
                  )}/units`
                )
              }
            >
              <div style={{ fontWeight: 700, fontSize: 16 }}>{s}</div>
              <div className="muted">View Units →</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
