import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

// Simple icons for the buttons (No changes here)
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 18, height: 18 }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 008.25-4.498z" />
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 20, height: 20 }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591z" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 24, height: 24 }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

export default function Navbar({ onAskAiClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // === 1. ITHA MAATHUNGA ===
  // Page load aagumbothu, localStorage-a check pannurom.
  // 'theme' == 'dark' nu iruntha 'true' aagum, illana 'false' aagum.
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  // ==========================

  // === 2. ITHA MAATHUNGA ===
  // 'isDarkMode' state maaraum pothu ellam, class-a add/remove pannu
  // appadiye, antha choice-a 'localStorage'-la save pannu.
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark'); // Save pannu
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light'); // Save pannu
    }
  }, [isDarkMode]);
  // ==========================

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="site-header-new sticky-nav">
      <div className="navbar-container container">
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <div className="logo-new"><img src="/icon.png" alt="Dude Quizz Logo" style={{ width: '100%', height: '100%' }} /></div>
          Dude Quizz
        </Link>

        <button 
          className="mobile-menu-toggle" 
          aria-label="Toggle menu"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <MenuIcon />
        </button>

        <nav className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <NavLink to="/" onClick={closeMobileMenu} end>Home</NavLink>
          <NavLink to="/classes/10/subjects" onClick={closeMobileMenu}>Class 10</NavLink>
          <NavLink to="/classes/11/subjects" onClick={closeMobileMenu}>Class 11</NavLink>
          <NavLink to="/classes/12/subjects" onClick={closeMobileMenu}>Class 12</NavLink>
          <NavLink to="/contact" onClick={closeMobileMenu}>Contact</NavLink>
          
          <div className="navbar-actions">
            <button 
              onClick={() => { onAskAiClick(); closeMobileMenu(); }} 
              className="btn btn-ask-ai"
            >
              Ask AI
            </button>
            <button 
              onClick={toggleDarkMode} 
              className="btn-icon btn-dark-mode" 
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}