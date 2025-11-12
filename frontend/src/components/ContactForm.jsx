import React, { useState } from 'react';

// API URL-a .env file-la irunthu edukkalam (neenga AskAssistant-la pannathu)
const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState(''); // Error message-kaga
  const [busy, setBusy] = useState(false); // Button-a disable panna

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Itha async function-a maathidalam
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true); // Submit start
    setError('');
    setIsSent(false);

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // Success
        setIsSent(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        // Handle server error (e.g., "Please fill all fields")
        setError(data.message || 'Error sending message. Please try again.');
      }
    } catch (err) {
      // Handle fetch error (e.g., network down)
      console.error('Fetch error:', err);
      setError('Could not connect to server. Please check your connection.');
    } finally {
      setBusy(false); // Submit mudinjuthu
    }
  };

  return (
    <div className="contact-page-container">
      <div className="card contact-card">
        <h2>Contact Us</h2>
        <p className="muted">Have a question or feedback? We'd love to hear from you!</p>

        {isSent && (
          <div className="contact-success">
            <strong>Thank you!</strong> Your message has been sent successfully.
          </div>
        )}

        {/* Error message-a inga kaattalam */}
        {error && (
          <div className="contact-error" style={{color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', padding: 10, borderRadius: 8, marginBottom: 16, border: '1px solid rgba(239, 68, 68, 0.2)'}}>
            {error}
          </div>
        )}

        {/* Form inga */}
        {!isSent && (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={busy} // Disable panna
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={busy} // Disable panna
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                required
                disabled={busy} // Disable panna
              ></textarea>
            </div>
            {/* Button text-a maathalam */}
            <button type="submit" className="btn" disabled={busy}>
              {busy ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}