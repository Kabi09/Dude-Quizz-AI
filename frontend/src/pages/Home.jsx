import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClasses } from '../api';



export default function Home(){
  const [classes, setClasses] = useState([]);
  const nav = useNavigate();

  useEffect(()=> {
    fetch(`${API_URL}/vist`).catch(() => {});
    
    getClasses().then(data => setClasses(data)).catch(()=> {
      // fallback demo classes
      setClasses([{ classId: '10', name: 'Class 10' }, { classId: '11', name: 'Class 11' }, { classId: '12', name: 'Class 12' }]);
    });
  }, []);

  return (
    <div>
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
