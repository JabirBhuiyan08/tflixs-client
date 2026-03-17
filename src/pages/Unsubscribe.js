import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import SEOHead from '../components/layout/SEOHead';

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail]     = useState(searchParams.get('email') || '');
  const [status, setStatus]   = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  // Auto-submit if email is in URL params (clicked from email)
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      handleUnsubscribe(emailParam);
    }
  }, []); // eslint-disable-line

  const handleUnsubscribe = async (emailToUse) => {
    const target = emailToUse || email;
    if (!target) return;
    setStatus('loading');
    try {
      const res = await api.post('/api/newsletter/unsubscribe', { email: target });
      setStatus('success');
      setMessage(res.data.message);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div>
      <SEOHead
        title="Unsubscribe – Tflixs Newsletter"
        description="Unsubscribe from the Tflixs newsletter."
      />
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>

          {status === 'success' ? (
            <div className="card">
              <div className="card-body" style={{ padding: 40 }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
                <h2 style={{ marginBottom: 12 }}>Unsubscribed</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>{message}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 24 }}>
                  You won't receive any more newsletters from Tflixs. You can still use all our free tools.
                </p>
                <Link to="/" className="btn btn-primary">Go to Homepage</Link>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body" style={{ padding: 40 }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>📧</div>
                <h2 style={{ marginBottom: 8 }}>Unsubscribe</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
                  Enter your email address to unsubscribe from the Tflixs newsletter.
                </p>

                {status === 'error' && (
                  <div className="alert alert-error" style={{ marginBottom: 16 }}>{message}</div>
                )}

                <div className="form-group" style={{ textAlign: 'left' }}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={status === 'loading'}
                  />
                </div>

                <button
                  className="btn btn-danger btn-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => handleUnsubscribe()}
                  disabled={!email || status === 'loading'}
                >
                  {status === 'loading' ? '⏳ Processing...' : 'Unsubscribe'}
                </button>

                <p style={{ marginTop: 16, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Changed your mind? <Link to="/">Stay subscribed →</Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Need Helmet for noindex
const { Helmet } = require('react-helmet-async');

export default Unsubscribe;
