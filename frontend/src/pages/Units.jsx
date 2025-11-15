// Units.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUnits } from '../api';
import LoadingSpinner from "../components/LoadingSpinner";

export default function Units() {
  const { classId, subject } = useParams();
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    setLoading(true);
    getUnits(classId, subject)
      .then((data) => {
        setUnits(data);
        setLoading(false);
      })
      .catch(() => {
        setUnits([
          { unit_no: '1', unit_name: 'Introduction' },
          { unit_no: '2', unit_name: 'Advanced Concepts' },
        ]);
        setLoading(false);
      });
  }, [classId, subject]);

  return (
    <div>
      {/* ⭐ UPDATED: clickable breadcrumb */}
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
        <span className="muted">Units</span>                  
      </div>

      <h2 style={{ marginTop: 0 }}>Units</h2>

      {loading ? (
  <LoadingSpinner />
) : (
        <div className="grid cols-2">
          {units.map((u) => (
            <div
              key={u.unit_no}
              className="card clickable"
              onClick={() =>
                nav(
                  `/practice/${classId}/${encodeURIComponent(
                    subject
                  )}/${u.unit_no}/${encodeURIComponent(u.unit_name)}`
                )
              }
            >
              <div style={{ fontWeight: 700 }}>
                Unit {u.unit_no}: {u.unit_name}
              </div>
              <div className="muted">Open →</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
