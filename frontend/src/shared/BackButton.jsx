import React from 'react';
import { useNavigate } from 'react-router-dom';

// Intha Icon namma munnadi use pannathu
const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{width: 16, height: 16}}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

export default function BackButton() {
  const nav = useNavigate();

  // 'nav(-1)' sonna, adhu previous history (URL) ku pogum
  return (
    <button 
      onClick={() => nav(-1)} 
      className="btn-back" // Namma style.css la irunthu varum
    >
      <BackIcon />
      Back
    </button>
  );
}