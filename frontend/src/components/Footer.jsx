import React, { useState } from 'react'; // <-- useState import pannunga
import { Link } from 'react-router-dom';

// API URL (neenga .env la vechirukeenga)
const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function Footer() {
  // Puthu state add pannurom
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Itha full-ah maathrom
  const handleSubscribe = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_URL}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message);
         fetch(`${API_URL}/visit/em?email=${encodeURIComponent(email)}`).catch(() => {});
        setEmail(''); // Form-a reset pannu
      } else {
        // Handle error (e.g., "Already subscribed")
        setError(data.message || 'Subscription failed.');
      }
    } catch (err) {
      setError('Could not connect to server.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <footer className="site-footer-new">
      <div className="footer-container container">
        
        <div className="footer-column footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/classes/10/subjects">Class 10</Link></li>
            <li><Link to="/classes/12/subjects">Class 12</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-column footer-subscribe">
          <div className="footer-column footer-about">
            <h4 className="footer-brand">Dude AI & Quizz</h4>
            <p>Your friendly guide to learning and practicing for exams. Built with ❤️ .</p>
            <p>
              <strong>Email:</strong> finallykabilan@gmail.com
            </p>
          </div>
          <h4>Subscribe</h4>
          <p>Get the latest updates and new quizzes delivered to your inbox.</p>
          
          {/* Ippo intha form correct-ah work aagum */}
          <form className="footer-subscribe-form" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="Your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy}
              required 
            />
            <button type="submit" className="btn" disabled={busy}>
              {busy ? '...' : 'Subscribe'}
            </button>
          </form>
          
          {/* Success/Error message kaatturathukku */}
          {success && <p style={{ color: 'var(--success)', fontSize: 13, marginTop: 8 }}>{success}</p>}
          {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 8 }}>{error}</p>}

        </div>

      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Dude AI & Dude Quizz. All rights reserved.</p>
      </div>
    </footer>
  );
}