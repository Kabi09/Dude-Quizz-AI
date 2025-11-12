// src/utils/ScrollToTop.jsx

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Every time the path changes, scroll to the top
    window.scrollTo(0, 0);
  }, [pathname]); // Run this effect when 'pathname' changes

  return null; // This component doesn't render anything
}