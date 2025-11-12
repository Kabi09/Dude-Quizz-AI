import React, { useEffect, useState } from 'react';

// Fallback formula renderer. If KaTeX is available as window.katex, use it.
// Otherwise, perform a safe transformation converting X4 -> X_{4} and X_{4} -> <sub>4</sub>.
// This component attempts to dynamically load KaTeX from CDN if missing.
export default function FormulaAuto({ tex = '', display = false, className = '' }) {
  const [katexLoaded, setKatexLoaded] = useState(typeof window !== 'undefined' && !!window.katex);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.katex) { setKatexLoaded(true); return; }
    // inject CSS if missing
    if (!document.querySelector('link[href*="katex.min.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
      document.head.appendChild(link);
    }
    if (!document.querySelector('script[data-katex]')) {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js';
      s.async = true;
      s.setAttribute('data-katex', '1');
      s.onload = () => { setKatexLoaded(true); };
      s.onerror = () => { setKatexLoaded(false); };
      document.head.appendChild(s);
    }
  }, []);

  const raw0 = String(tex || '').trim();
  let raw = raw0;
  if (raw.startsWith('$') && raw.endsWith('$')) raw = raw.slice(1, -1);

  // If KaTeX is present on window, use it to render HTML
  if (katexLoaded && typeof window !== 'undefined' && window.katex && typeof window.katex.renderToString === 'function') {
    try {
      const html = window.katex.renderToString(raw, { throwOnError: false, displayMode: !!display, strict: 'ignore' });
      return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
    } catch (e) {
      // fall through to fallback rendering
    }
  }

  // Fallback: escape HTML and replace patterns for subscripts
  const escapeHtml = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  let s = escapeHtml(raw);

  // Convert _{n} and _n to <sub>n</sub>
  s = s.replace(/_\{(\d+)\}/g, '<sub>$1</sub>');
  s = s.replace(/_(\d+)/g, '<sub>$1</sub>');
  // Convert letter+digits like C4 -> C<sub>4</sub>
  s = s.replace(/([A-Za-z\)\]])(\d+)/g, '$1<sub>$2</sub>');

  return <span className={className} dangerouslySetInnerHTML={{ __html: s }} />;
}
