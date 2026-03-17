import React, { useState } from 'react';
import api from '../utils/api';
import SEOHead from '../components/layout/SEOHead';
import './Contact.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await api.post('/api/contact', form);
      setSuccess(res.data.message);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SEOHead page="contact" title="Contact Us – Tflixs" />

      <section className="page-hero">
        <div className="container">
          <h1>📬 Contact Us</h1>
          <p>Have a question, feedback, or suggestion? We'd love to hear from you.</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-layout">
          {/* Contact Info */}
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
              Whether you have questions about fertilizer recommendations, want to suggest a new crop, or have feedback about our tools — we're here to help.
            </p>
            <div className="info-cards">
              <div className="info-card">
                <div className="info-card__icon">📧</div>
                <div>
                  <strong>Email</strong>
                  <p>support@tflixs.com</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-card__icon">🕐</div>
                <div>
                  <strong>Response Time</strong>
                  <p>Within 24–48 hours</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-card__icon">🌐</div>
                <div>
                  <strong>Service Area</strong>
                  <p>Worldwide – all major crops</p>
                </div>
              </div>
            </div>

            <div className="contact-faq">
              <h3>Frequently Asked</h3>
              {[
                { q: 'Is the calculator free?', a: 'Yes, 100% free. No registration needed.' },
                { q: 'How accurate are the results?', a: 'Based on standard agronomic research. Soil test data improves accuracy.' },
                { q: 'Can you add a specific crop?', a: 'Yes! Use this form to request new crops.' },
              ].map(faq => (
                <div key={faq.q} className="faq-item">
                  <strong>Q: {faq.q}</strong>
                  <p>A: {faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-wrap">
            <div className="card">
              <div className="card-header">
                <h2>Send a Message</h2>
              </div>
              <div className="card-body">
                {success && <div className="alert alert-success">✅ {success}</div>}
                {error && <div className="alert alert-error">❌ {error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="grid-2">
                    <div className="form-group">
                      <label>Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="John Farmer"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Subject *</label>
                    <select name="subject" className="form-control" value={form.subject} onChange={handleChange} required>
                      <option value="">Select a subject...</option>
                      <option>Calculator Feedback</option>
                      <option>Request a New Crop</option>
                      <option>Bug Report</option>
                      <option>General Inquiry</option>
                      <option>Partnership / Advertising</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Message *</label>
                    <textarea
                      name="message"
                      className="form-control"
                      placeholder="Write your message here..."
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                    {loading ? '⏳ Sending...' : '📤 Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
