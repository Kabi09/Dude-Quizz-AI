import React from 'react';
import FormulaAuto from './FormulaAuto';

// RenderWithMath: detects $...$ LaTeX segments and simple chemical patterns like C_4H_10 or C4H10
// and renders them using FormulaAuto (which prefers KaTeX if available).
export default function RenderWithMath({ text }) {
  if (text === null || text === undefined) return null;
  const s = String(text);

  // split by $...$ blocks first
  const parts = [];
  let lastPos = 0;
  const dollarRe = /\$(.+?)\$/g;
  let m;
  while ((m = dollarRe.exec(s)) !== null) {
    const idx = m.index;
    if (idx > lastPos) parts.push({ type: 'text', value: s.slice(lastPos, idx) });
    parts.push({ type: 'tex', value: m[1] });
    lastPos = dollarRe.lastIndex;
  }
  if (lastPos < s.length) parts.push({ type: 'text', value: s.slice(lastPos) });

  // For text parts, additionally replace chemical patterns like C_4H_10 or C4H10
  const chemSimple = /([A-Za-z\)\]])(?:_?\{?\d+\}?|\d+)/g;

  function renderPart(part, key) {
    if (part.type === 'tex') {
      return <FormulaAuto key={key} tex={part.value} />;
    } else {
      const txt = part.value;
      const nodes = [];
      let last = 0;
      let mi;
      while ((mi = chemSimple.exec(txt)) !== null) {
        const i = mi.index;
        if (i > last) nodes.push(<span key={key + '-t-' + last}>{txt.slice(last, i)}</span>);
        const match = mi[0];
        let tex = match;
        tex = tex.replace(/([A-Za-z\)\]])(\d+)/g, '$1_{ $2 }');
        tex = tex.replace(/_\s*\{?\s*(\d+)\s*\}?/g, '_{$1}');
        nodes.push(<FormulaAuto key={key + '-m-' + i} tex={tex} />);
        last = i + match.length;
      }
      if (last < txt.length) nodes.push(<span key={key + '-end'}>{txt.slice(last)}</span>);
      return nodes;
    }
  }

  return <span>{parts.map((p,i)=> renderPart(p,i))}</span>;
}
