import React, { useState } from 'react';
import api from '../../utils/api';
import './NewsletterSignup.css';

const NewsletterSignup = ({ compact = false }) => {
  const [email, setEmail]     = useState('');
  const [name, setName]       = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await api.post('/api/newsletter/subscribe', { email, name });
      setSuccess(res.data.message);
      setEmail(''); setName('');
    } catch (err) {
      setError(err.response?.data?.message || 'Subscription failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (compact) return (
    <div className="newsletter-compact">
      <h4>📧 Get Farming Tips</h4>
      <p>Weekly tips on fertilizers and crop care.</p>
      {success ? (
        <div className="alert alert-success" style={{ fontSize: '0.85rem', padding: '10px 14px' }}>✅ {success}</div>
      ) : (
        <form onSubmit={handleSubmit} className="newsletter-compact__form">
          <input
            type="email"
            className="form-control"
            placeholder="Your email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '...' : 'Subscribe'}
          </button>
        </form>
      )}
      {error && <p style={{ color: 'red', fontSize: '0.78rem', marginTop: 6 }}>{error}</p>}
    </div>
  );

  return (
    <section className="newsletter-section">
      <div className="container newsletter-inner">
        <div className="newsletter-text">
          <div className="newsletter-icon">📧</div>
          <h2>Get Weekly Farming Tips</h2>
          <p>Join thousands of farmers getting expert advice on fertilizers, soil health, and crop management — free every week.</p>
          <ul className="newsletter-perks">
            <li>✅ Seasonal fertilizer reminders</li>
            <li>✅ Pest & disease alerts</li>
            <li>✅ New crop guides</li>
            <li>✅ No spam, unsubscribe anytime</li>
          </ul>
        </div>

        <div className="newsletter-form-wrap">
          {success ? (
            <div className="newsletter-success">
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎉</div>
              <h3>You're subscribed!</h3>
              <p>{success}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="newsletter-form">
              <div className="form-group">
                <label>Your Name (optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Farmer John"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="john@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && <div className="alert alert-error">{error}</div>}
              <button type="submit" className="btn btn-amber btn-lg" disabled={loading}
                style={{ width: '100%', justifyContent: 'center' }}>
                {loading ? '⏳ Subscribing...' : '📧 Subscribe Free'}
              </button>
              <p className="newsletter-disclaimer">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
