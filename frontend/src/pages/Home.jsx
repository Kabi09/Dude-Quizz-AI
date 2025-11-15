import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { getClasses } from '../api'; // Removed this line as '../api' could not be resolved

// API_URL constant removed to prevent 'import.meta' warnings in es2015 environment
// const API_URL = (typeof import.meta !== 'undefined' && import.meta.env)
//                   ? import.meta.env.VITE_API_URL || ''
//                   : '';

// Define the default classes as a constant
const DEFAULT_CLASSES = [
  { classId: '10', name: 'Class 10' },
  { classId: '11', name: 'Class 11' },
  { classId: '12', name: 'Class 12' }
];

export default function Home(){
  // Initialize the state with the default classes
  const [classes, setClasses] = useState(DEFAULT_CLASSES);
  const nav = useNavigate();

  useEffect(()=> {

    // Removed the fetch call that depended on API_URL
    /*
    if (API_URL) {
      fetch(`${API_URL}/vist`).catch(() => {
        console.log("Visit ping failed or API_URL is not set.");
      });
    }
    */

    // Since getClasses was removed, we no longer need to fetch
    // The component will just display the DEFAULT_CLASSES

    /*
    getClasses().then(data => {
      // If the API returns data (and it's not empty), update the state
      if (data && data.length > 0) {
        setClasses(data);
      }
      // If API returns empty data, the default classes will remain visible
    }).catch(()=> {
      // If the API call fails, we don't need to do anything,
      // because the default classes are already set.
      console.error("Failed to fetch classes, showing default classes.");
    });
    */
    
  }, []); // Empty dependency array means this runs once on mount

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