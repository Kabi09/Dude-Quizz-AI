import React, { useEffect, useMemo, useRef, useState } from 'react';
import 'katex/dist/katex.min.css';
import renderMathInElement from 'katex/contrib/auto-render';
import Tesseract from 'tesseract.js';

/** --- Stream Chat Helper --- **/
async function streamChat({ url, payload, onChunk }) {
  // ... (ellam code appadiye irukkattum)
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return { ok: false, status: res.status, statusText: res.statusText };
  const ct = (res.headers.get('content-type') || '').toLowerCase();
  const reader = res.body?.getReader();
  if (!reader) return { ok: true };
  const decoder = new TextDecoder();
  let buf = '';

  const extractText = (raw) => {
    try {
      const j = JSON.parse(raw);
      const a =
        j?.choices?.[0]?.delta?.content ??
        j?.choices?.[0]?.message?.content ??
        j?.message?.content ??
        j?.content;
      if (typeof a === 'string') return a;
    } catch {}
    if (/^\s*[{[]/.test(raw)) return '';
    return raw;
  };

  // SSE Stream
  if (ct.includes('text/event-stream')) {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const frames = buf.split(/\n\n/);
      buf = frames.pop() || '';
      for (const f of frames) {
        const line = f.split('\n').find((l) => l.startsWith('data:'));
        if (!line) continue;
        const raw = line.slice(5).trim();
        if (raw === '[DONE]') continue;
        const text = extractText(raw);
        if (text) onChunk(text);
      }
    }
    return { ok: true };
  }

  // NDJSON/raw
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buf.indexOf('\n')) !== -1) {
      const line = buf.slice(0, idx);
      buf = buf.slice(idx + 1);
      const s = line.trim();
      if (!s) continue;
      const text = extractText(s);
      if (text) onChunk(text);
    }
  }
  const tail = buf.trim();
  if (tail) {
    const text = extractText(tail);
    if (text) onChunk(text);
  }
  return { ok: true };
}

/** --- DB Saver --- **/
async function saveChatToDB(role, content) {
  // ... (ellam code appadiye irukkattum)
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, content }),
    });
  } catch (err) {
    console.error('DB save error:', err);
  }
}

export default function AskAssistant({ isOpen, setIsOpen }) { 
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [model, setModel] = useState('kimi-k2:1t-cloud');
  const [messages, setMessages] = useState([
    // ... (messages array appadiye irukkattum)
    {
  role: 'system',
  content:
    `'Your name is Dude AI. Unga persona oru knowledgeable, respectful, and friendly best friend (machi, bro, maamey use pannalam). Unga primary goal Tamil medium students-ku (Std 5-12) help panrathu.

**Core Mission:**
1.  **Prioritize Simple Tamil:** Complex topics-a (Science, Maths) saadharana, elithana Tamil-la pesi puriya vaikanum.
2.  **Explain English Words:** Technical English words use panna vendi vantha, athukana Tamil artham allathu oru simple explanation (bracket-la) kudukanum.
3.  **Encourage and Be Patient:** Students-ku doubt varathu sagajam. Eppovum encouraging-a, porumaiya pesanum.

**Answering Style (Effective Answers):**
* **Maths:** Eppa ketaalum, **step-by-step** solutions (padipadiyaaga) kanakka pottu kaatanum.
* **Science & Other Topics:** Maranthu pogakoodatha alavuku, **real-world examples (nijavaazhkai udhaaranangal)** allathu **analogies (uvamaigal)** use panni explain pannanu. (Example: "Bro, ithu eppadi work aaguthuna..." nu aarambikalam).
* **Clarity:** Pathilgal eppovum short, clear, and to-the-point-a irukanum.

**Rules:**
* **Bad Words:** User use panna, cool-a irukanum. Respectful-a, "Sorry machi, athu purila, vera maari kelu" nu topic-a maathanum.
* **Creator Info (Kabilan):** Unga creator Kabilan (Web Developer, B.E CSE, Nagapattinam). Aana, intha thagavala user specifically "unnai yar create pannathu?", "unga owner yar?" nu ketta mattum-thaan sollanum. Neengala mun vanthu solla koodathu.'`
},
    {
      role: 'assistant',
      content: 'Machi! நான் Dude AI. என்ன doubt Machi? சொல்லு, நம்ம நண்பனா பேசலாம் 😊',
    },
  ]);

  const API_BASE = useMemo(() => {
    // ... (ellam code appadiye irukkattum)
    const raw = import.meta.env.VITE_API_URL || '/api';
    return String(raw).replace(/\/$/, '');
  }, []);
  const CHAT_URL = `${API_BASE}/ollama/chat`;

  const listRef = useRef(null);
  useEffect(() => {
    if (isOpen && listRef.current) { 
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [isOpen, messages]); 

  // ... (send, onKeyDown, onPickImage functions ellam appadiye irukkattum)
  async function send() {
    const text = input.trim();
    if (!text || busy) return;

    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    await saveChatToDB('user', text);
    setInput('');

    const idx = next.length;
    setMessages((m) => [...m, { role: 'assistant', content: '' }]);
    setBusy(true);

    try {
      const result = await streamChat({
        url: CHAT_URL,
        payload: { model, messages: next, stream: true },
        onChunk: async (chunk) => {
          const clean = chunk.replace(/\r/g, '').replace(/\n{3,}/g, '\n\n');
          setMessages((m) => {
            const copy = [...m];
            copy[idx] = {
              role: 'assistant',
              content: (copy[idx]?.content || '') + clean,
            };
            return copy;
          });
          await saveChatToDB('assistant', clean);
        },
      });

      if (!result.ok) {
        const r = await fetch(CHAT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, messages: next, stream: false }),
        });
        const data = r.ok ? await r.json() : null;
        const final =
          data?.choices?.[0]?.message?.content ||
          data?.message?.content ||
          (r.ok ? '(no content)' : `⚠️ ${r.status} ${r.statusText}`);
        setMessages((m) => {
          const copy = [...m];
          copy[idx] = { role: 'assistant', content: final };
          return copy;
        });
        await saveChatToDB('assistant', final);
      }
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: `⚠️ ${e?.message || e}` }]);
    } finally {
      setBusy(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  async function onPickImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setBusy(true);
      const { data } = await Tesseract.recognize(file, 'eng+tam');
      const text = (data?.text || '').trim();
      if (text) {
        setInput((prev) => (prev ? `${prev}\n\n${text}` : text));
      } else {
        setMessages((m) => [
          ...m,
          { role: 'assistant', content: '⚠️ OCR-ல text கிடைக்கலை, இன்னொரு படம் try பண்ணலாமா machi?' },
        ]);
      }
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', content: `⚠️ OCR error: ${err?.message || err}` }]);
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  }


  return (
    <div>
        {/* Toggle Floating Button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Ask"
        style={{
          position: 'fixed',
          bottom: '1rem', 
          right: '1rem', 
          zIndex: 1000, 
          width: 48,
          height: 48,
          borderRadius: 999,
          background: 'conic-gradient(from 180deg at 50% 50%, #7C3AED 0deg, #06B6D4 160deg, #22C55E 260deg)',
          color: '#fff',
          display: 'grid',
          placeItems: 'center',
          boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
          fontWeight: 800,
          fontSize: 20,
          border: 'none',
          cursor: 'pointer',
          
          /* === MARUBADIYUM ITHA ADD PANNUNGA === */
          animation: 'pulse-ask-button 2.5s ease-in-out infinite',
          
        }}
      >
        ? {/* <-- Inga <span> venam, direct-a '?' podunga */}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            right: '1rem',  
            zIndex: 1000, 
            top: '5rem', 
            bottom: '5rem',
            maxHeight: '560px', 
            width: 380,
            maxWidth: 'calc(100vw - 24px)',
            borderRadius: 16,
            background: 'rgba(17, 24, 39, 0.78)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 60px rgba(2,6,23,0.45)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* Left Side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, rgba(124,58,237,1), rgba(14,165,233,1))',
                  boxShadow: '0 4px 14px rgba(99,102,241,0.45)',
                }}
              />
              <div>
                <div style={{ color: '#fff', fontWeight: 800 }}>Ask (தமிழ்)</div>
                <div style={{ color: '#aab1c2', fontSize: 12 }}>Short & Clear</div>
              </div>
            </div>

            {/* === START: ITHA MAATHIRUKKOM === */}
            {/* Right Side Wrapper */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Model Select */}
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                style={{
                  background: 'rgba(0,0,0,0.25)',
                  color: '#e5e7eb',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.12)',
                  padding: '4px 6px',
                  fontSize: 12,
                }}
              >
                <option value="kimi-k2:1t-cloud">kimi-k2:1t-cloud</option>
                <option value="gpt-oss:20b">gpt-oss:20b</option>
                <option value="gpt-oss:120b">gpt-oss:120b</option>
                <option value="deepseek-v3.1:671b-cloud">deepseek-v3.1:671b-cloud</option>
                <option value="qwen3-coder:480b-cloud">qwen3-coder:480b-cloud</option>
              </select>

              {/* New Close Button */}
              <button
                onClick={() => setIsOpen(false)} // Click panna chat close aagum
                title="Close chat"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#aab1c2', // Muted color
                  fontSize: 24,      // "×" size
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '0 4px',
                  lineHeight: 0.8,   // "×" symbol-a center panna
                }}
              >
                &times; 
              </button>
            </div>
            {/* === END: MAATHAM MUDINJUTHU === */}

          </div>

          {/* Messages */}
          <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'grid', gap: 10 }}>
            {/* ... (Messages content ellam appadiye irukkattum) ... */}
            {messages.filter((m) => m.role !== 'system').map((m, i) => (
              <Bubble key={i} role={m.role} content={m.content} />
            ))}
            {busy && <div style={{ color: '#aab1c2', fontSize: 12 }}>சிந்திக்கிறது…</div>}
          </div>

          {/* Composer */}
          <div
            style={{
              padding: 10,
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              gap: 8,
              alignItems: 'flex-end',
            }}
          >
            {/* ... (Composer content ellam appadiye irukkattum) ... */}
            <label
              htmlFor="imageUpload"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 42,
                height: 42,
                borderRadius: 12,
                background: 'linear-gradient(145deg, rgba(59,130,246,0.12), rgba(124,58,237,0.12))',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.1), 0 2px 6px rgba(0,0,0,0.25)',
                color: '#e5e7eb',
                fontSize: 24,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                backdropFilter: 'blur(8px)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background =
                  'linear-gradient(145deg, rgba(59,130,246,0.25), rgba(124,58,237,0.25))';
                e.currentTarget.style.transform = 'scale(1.08)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background =
                  'linear-gradient(145deg, rgba(59,130,246,0.12), rgba(124,58,237,0.12))';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              title="Upload image for OCR"
            >
              <span style={{ marginTop: -2 }}>+</span>
              <input id="imageUpload" type="file" accept="image/*" onChange={onPickImage} style={{ display: 'none' }} />
            </label>

            <textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="உங்கள் கேள்வியை இங்கே எழுதுங்கள்…"
              style={{
                flex: 1,
                minHeight: 56,
                maxHeight: 140,
                resize: 'vertical',
                background: 'rgba(0,0,0,0.25)',
                color: '#e5e7eb',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 12,
                padding: '10px 12px',
                outline: 'none',
                lineHeight: 1.35,
              }}
            />

            <button
              onClick={send}
              disabled={busy}
              title="Send"
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                display: 'grid',
                placeItems: 'center',
                background: busy
                  ? 'linear-gradient(135deg,#94a3b84d,#64748b4d)'
                  : 'linear-gradient(135deg,#22c55e,#06b6d4)',
                color: '#0f172a',
                border: '1px solid rgba(255,255,255,0.14)',
                cursor: busy ? 'not-allowed' : 'pointer',
                fontWeight: 800,
                fontSize: 16,
                boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
              }}
            >
              ➤
            </button>
          </div>
          <p>   Dude AI can make mistakes, so double-check it</p>
        </div>
      )}
    </div>
  );
}

function Bubble({ role, content }) {
  // ... (Bubble component appadiye irukkattum)
  const me = role === 'user';
  const ref = React.useRef(null);
  const text = (content || '').replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').replace(/[ \t]+\n/g, '\n').trim();

  useEffect(() => {
    if (!ref.current) return;
    try {
      renderMathInElement(ref.current, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false },
        ],
        throwOnError: false,
        strict: 'ignore',
      });
    } catch {}
  }, [text]);

  return (
    <div style={{ display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start' }}>
      <div
        ref={ref}
        style={{
          maxWidth: 280,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          padding: '10px 12px',
          borderRadius: 14,
          background: me ? '#d1fae530' : '#0b1220',
          color: me ? '#111827' : '#e5e7eb',
          border: me ? '1px solid #86efac66' : '1px solid rgba(255,255,255,0.08)',
          boxShadow: me ? '0 4px 12px rgba(22,163,74,0.15)' : 'none',
          fontSize: 14.5,
          lineHeight: 1.45,
          overflowX: 'auto',
        }}
      >
        {text}
      </div>
    </div>
  );
}