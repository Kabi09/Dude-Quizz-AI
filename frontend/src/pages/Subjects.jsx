// Subjects.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubjects } from '../api';
import LoadingSpinner from "../components/LoadingSpinner";

export default function Subjects(){
  const { classId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true); // 👈 loading state
  const nav = useNavigate();

  useEffect(()=> {
    setLoading(true);
    getSubjects(classId)
      .then(data => {
        setSubjects(data);
        setLoading(false);
      })
      .catch(()=> {
        setSubjects(['Science','Maths','Social']);
        setLoading(false);
      });
  }, [classId]);

  return (
    <div>
      <div className="breadcrumbs">Class {classId} • <span className="muted">Select Subject</span></div>
      <h2 style={{marginTop:0}}>Subjects</h2>

      {loading ? (
       <LoadingSpinner />  
      ) : (
        <div className="grid cols-3">
          {subjects.map(s => (
            <div
              key={s}
              className="card clickable"
              onClick={()=>nav(`/classes/${classId}/subjects/${encodeURIComponent(s)}/units`)}
            >
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                  <div style={{fontSize:16,fontWeight:700}}>{s}</div>
                  <div className="muted">Tap to view units</div>
                </div>
                <div style={{fontSize:12,color:'#4f46e5'}}>→</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
