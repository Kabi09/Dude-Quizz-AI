import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// FormulaKaTeX renders LaTeX math (inline) using KaTeX.
// Usage: <FormulaKaTeX tex="C_{4}H_{10}" /> or <FormulaKaTeX tex="\\mathrm{C_{4}H_{10}}"/>
export default function FormulaKaTeX({ tex = '', display = false, className = '' }) {
  const input = String(tex || '');

  // If user passed $...$ strip them
  let raw = input.trim();
  if (raw.startsWith('$') && raw.endsWith('$')) raw = raw.slice(1, -1);

  // KaTeX expects LaTeX-ish input. For chemical formulae it's usually fine.
  let html = '';
  try {
    html = katex.renderToString(raw, {
      throwOnError: false,
      displayMode: !!display,
      strict: 'ignore'
    });
  } catch (e) {
    // fallback: escape and show raw
    const esc = raw.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    html = esc;
  }

  return <span className={"katex-inline " + className} dangerouslySetInnerHTML={{ __html: html }} />;
}
