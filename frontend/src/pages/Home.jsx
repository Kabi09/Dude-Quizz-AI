import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClasses } from '../api';
const API_URL = import.meta.env.VITE_API_URL || '/api';



export default function Home(){
  const [classes, setClasses] = useState([]);
  const nav = useNavigate();

  useEffect(()=> {
    fetch(`${API_URL}/visit1`).catch(() => {});

    getClasses().then(data => setClasses(data)).catch(()=> {
      // fallback demo classes
      setClasses([{ classId: '10', name: 'Class 10' }, { classId: '11', name: 'Class 11' }, { classId: '12', name: 'Class 12' }]);
    });
  }, []);

  return (
    <div>

<h3
  style={{
    background: "#f8fafc",
    padding: "14px 18px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    color: "#1e293b",
    fontSize: "18px",
    fontWeight: 500,
    lineHeight: "1.6",
    maxWidth: "700px",
    marginBottom: "24px",
  }}
>
  It has been identified that several answers are incorrect. A correction is
  required{" "}
  <strong style={{ fontWeight: 600, color: "#0f172a" }}>
    within the next 24 hours.
  </strong>
</h3>

      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
        <div>
          <h2 style={{margin:0}}>Choose Your Class</h2>
          <div className="muted">Start practicing — pick a class to continue</div>
        </div>
        <div className="pill">Practice Mode</div>
      </div>


      <div className="grid cols-3">
       
        {classes.map(c => (
          <div key={c.classId} className="card clickable" onClick={()=>nav(`/classes/${c.classId}/subjects`)}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
               
                <div style={{fontSize:16,fontWeight:700}}>Class {c.classId}</div>
                <div className="muted">{c.name}</div>
              </div>

              <div style={{fontSize:12,color:'#fff',background:'#111827',padding:'6px 10px',borderRadius:8}}>Start</div>
            </div>
          </div>
        ))}
      </div>



    </div>
  );
}
