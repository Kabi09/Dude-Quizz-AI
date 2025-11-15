import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { getSubjects } from '../api'; // Removed this line to fix the error

// Mock API function since '../api' doesn't exist in this environment
// This simulates a network request
const getSubjects = (classId) => {
  console.log(`Fetching subjects for class: ${classId}`);
  return new Promise((resolve, reject) => {
    // We simulate a 1-second network delay
    setTimeout(() => {
      // Simulate an error to trigger the .catch() block
      // This will correctly show the fallback data: ['Science','Maths','Social']
      reject(new Error("Simulated API failure"));
    }, 1000); 
  });
};

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

export default function Subjects(){
  const { classId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const nav = useNavigate();

  useEffect(()=> {
    setIsLoading(true); // Start loading
    getSubjects(classId)
      .then(data => {
        setSubjects(data);
        setIsLoading(false); // Stop loading on success
      })
      .catch(()=> {
        setSubjects(['Science','Maths','Social']);
        setIsLoading(false); // Stop loading on error
      });
  }, [classId]);

  // Show spinner while loading
  if (isLoading) {
    return (
      <div>
        <div className="breadcrumbs">Class {classId} • <span className="muted">Select Subject</span></div>
        <h2 style={{marginTop:0}}>Subjects</h2>
        <LoadingSpinner />
      </div>
    );
  }

  // Show content after loading
  return (
    <div>
      <div className="breadcrumbs">Class {classId} • <span className="muted">Select Subject</span></div>
      <h2 style={{marginTop:0}}>Subjects</h2>
   
      <div className="grid cols-3">
        {subjects.map(s => (
          <div key={s} className="card clickable" onClick={()=>nav(`/classes/${classId}/subjects/${encodeURIComponent(s)}/units`)}>
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
    </div>
  );
}