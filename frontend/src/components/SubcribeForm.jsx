// src/components/SubscribeForm.jsx
import React, { useState } from "react";

/**
 * Simple modern subscribe form
 * - client-side validation for email
 * - shows inline success / error messages
 * - non-blocking (no network call). Replace the fake submit with real API if needed.
 */
export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [message, setMessage] = useState("");

  function validateEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setMessage("");
    if (!validateEmail(email.trim())) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      setStatus("sending");
      // fake network delay -- replace with real fetch/axios call if desired
      await new Promise((r) => setTimeout(r, 700));
      // On success:
      setStatus("success");
      setMessage("Thanks — you're subscribed!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <form className="footer-subscribe" onSubmit={handleSubmit} aria-label="Subscribe to newsletter">
      <label htmlFor="footer-sub-email" className="sr-only">Email address</label>
      <input
        id="footer-sub-email"
        name="email"
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-invalid={status === "error"}
        aria-describedby="footer-sub-msg"
        required
      />
      <button
        type="submit"
        className={`footer-btn gradient ${status === "sending" ? "loading" : ""}`}
        aria-live="polite"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Subscribing…" : "Subscribe"}
      </button>

      <div id="footer-sub-msg" role="status" aria-live="polite" className={`footer-sub-msg ${status}`}>
        {message}
      </div>
    </form>
  );
}
