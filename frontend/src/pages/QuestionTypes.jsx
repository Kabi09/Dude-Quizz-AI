import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { getQuestions } from '../api'; // Removed this line to fix the error

// Mock API function since '../api' doesn't exist in this environment
// This simulates a network request
const getQuestions = ({ class: classId, subject, unit_no, unit_name }) => {
  console.log(`Fetching questions for: ${classId}, ${subject}, ${unit_no}, ${unit_name}`);
  return new Promise((resolve, reject) => {
    // We simulate a 1-second network delay
    setTimeout(() => {
      // Simulate an error to trigger the .catch() block
      // This will correctly show the fallback data
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

export default function QuestionTypes(){
  const { classId, subject, unit_no, unit_name } = useParams();
  const [types, setTypes] = useState([]); // will hold [{ type, sections: [..] }]
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const nav = useNavigate();

  useEffect(()=> {
    setIsLoading(true); // Start loading
    getQuestions({ class: classId, subject, unit_no, unit_name })
      .then(qs => {
        // build map: type -> Set of sections
        const map = new Map();
        qs.forEach(q => {
          const t = (q.type || 'MCQ').toString();
          const sec = (q.section || q.content?.section || '').toString().trim();
          if (!map.has(t)) map.set(t, new Set());
          if (sec) map.get(t).add(sec);
        });

        // convert to array of objects with joined sections for display
        const arr = Array.from(map.entries()).map(([type, sectionSet]) => {
          const sections = Array.from(sectionSet);
          return { type, sections };
        });

        // if there were no questions, ensure a small default
        if (arr.length === 0) {
          setTypes([{ type: 'MCQ', sections: ['I. சரியான விடையைத் தேர்வு செய்யவும்'] }]);
        } else {
          setTypes(arr);
        }
        setIsLoading(false); // Stop loading on success
      })
      .catch(()=> {
        setTypes([{ type: 'MCQ', sections: ['I. சரியான விடையைத் தேர்வு செய்யவும்'] }]);
        setIsLoading(false); // Stop loading on error
      });
  }, [classId, subject, unit_no,unit_name]);

  // Show spinner while loading
  if (isLoading) {
    return (
      <div>
        <div className="breadcrumbs">Class {classId} • {subject} • Unit {unit_no} • <span className="muted">Question Types</span></div>
        <h2 style={{marginTop:0}}>Pick a Question Type</h2>
        <LoadingSpinner />
      </div>
    );
  }

  // Show content after loading
  return (
    <div>
      <div className="breadcrumbs">Class {classId} • {subject} • Unit {unit_no} • <span className="muted">Question Types</span></div>
      <h2 style={{marginTop:0}}>Pick a Question Type</h2>

      <div className="grid cols-3">
        {types.map(({ type, sections }) => {
          const displaySections = (sections && sections.length) ? sections.join(' · ') : 'Practice questions';
          return (
            <div
              key={type}
              className="card clickable"
              onClick={() =>
                nav(`/practice/${classId}/${encodeURIComponent(subject)}/${unit_no}/${encodeURIComponent(unit_name)}/${encodeURIComponent(type)}`)
              }
            >
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                <div style={{fontWeight:700}}>{type}</div>
                <div className="muted">{displaySections}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}