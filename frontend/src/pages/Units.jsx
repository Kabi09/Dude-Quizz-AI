import React, { useEffect, useState } from 'react';
import { useParams, useNavigate,Link } from 'react-router-dom';
import { getUnits } from '../api';

export default function Units(){
  const { classId, subject } = useParams();
  const [units, setUnits] = useState([]);
  const nav = useNavigate();

  useEffect(()=> {
    getUnits(classId, subject).then(setUnits).catch(()=> setUnits([
      { unit_no: '1', unit_name: 'Introduction' },
      { unit_no: '2', unit_name: 'Advanced Concepts' },
      { unit_no: '3', unit_name: 'Revision' }
    ]));
  }, [classId, subject]);

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
