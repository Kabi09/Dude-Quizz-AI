import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUnits } from '../api';

// Loading Spinner Component
function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: #4f46e5; /* Loading color */
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
      `}</style>
      <div className="spinner"></div>
    </div>
  );
}

export default function Units(){
  const { classId, subject } = useParams();
  const [units, setUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const nav = useNavigate();

  useEffect(()=> {
    setIsLoading(true); // Start loading
    getUnits(classId, subject)
      .then(data => {
        setUnits(data);
        setIsLoading(false); // Stop loading on success
      })
      .catch(()=> {
        setUnits([
          { unit_no: '1', unit_name: 'Introduction' },
          { unit_no: '2', unit_name: 'Advanced Concepts' },
          { unit_no: '3', unit_name: 'Revision' }
        ]);
        setIsLoading(false); // Stop loading on error
      });
  }, [classId, subject]);

  // Show spinner while loading
  if (isLoading) {
    return (
      <div>
        <div className="breadcrumbs">
          <Link to={`/classes/${classId}/subjects`}>Class {classId}</Link> • 
          {subject} • 
          <span className="muted">Units</span>
        </div>
        <h2 style={{marginTop:0}}>Units</h2>
        <LoadingSpinner />
      </div>
    );
  }

  // Show content after loading
  return (
    <div>
     <div className="breadcrumbs">
        <Link to={`/classes/${classId}/subjects`}>Class {classId}</Link> • 
        {subject} • 
        <span className="muted">Units</span>
      </div>
      <h2 style={{marginTop:0}}>Units</h2>
      <div className="grid cols-2">
        {units.map(u => (
          <div key={u.unit_no} className="card clickable" onClick={()=>nav(`/practice/${classId}/${encodeURIComponent(subject)}/${u.unit_no}/${encodeURIComponent(u.unit_name)}`)}>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <div style={{fontWeight:700}}>Unit {u.unit_no} — {u.unit_name}</div>
              <div className="muted">Practice questions and tests</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}