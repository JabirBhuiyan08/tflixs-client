import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/layout/SEOHead';

const About = () => (
  <div>
    <SEOHead page="about" title="About Tflixs – Free Fertilizer Recommendation Tool" />

    <section className="page-hero">
      <div className="container">
        <h1>🌿 About Tflixs</h1>
        <p>Empowering farmers worldwide with science-backed fertilizer guidance</p>
      </div>
    </section>

    <section className="section">
      <div className="container-sm">
        <div className="card" style={{ marginBottom: 32 }}>
          <div className="card-body" style={{ padding: '40px' }}>
            <h2 style={{ marginBottom: 16 }}>Our Mission</h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 20 }}>
              Tflixs was built to bridge the gap between agricultural science and everyday farming. Many farmers — especially smallholders — over-apply or under-apply fertilizers due to lack of accessible, localized guidance. This leads to wasted money, soil degradation, and reduced yields.
            </p>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
              Our free, science-based fertilizer calculator gives every farmer access to precise NPK recommendations — tailored to their crop, land area, and soil conditions — without any registration or cost. Available in multiple languages with local currency support.
            </p>
          </div>
        </div>

        <div className="grid-3" style={{ marginBottom: 40 }}>
          {[
            { icon: '🎯', title: 'Science-Based', desc: 'Recommendations based on established agronomic research and ICAR/FAO guidelines.' },
            { icon: '🌍', title: 'Free Forever',  desc: 'No paywalls, no subscriptions. Agriculture information should be accessible to all.' },
            { icon: '📱', title: 'Mobile-Friendly', desc: 'Works on any device — use it right in your field from any smartphone.' },
          ].map(item => (
            <div key={item.title} className="card">
              <div className="card-body" style={{ textAlign: 'center', padding: '32px 20px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{item.icon}</div>
                <h3 style={{ marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ background: 'var(--green-faint)', border: '1px solid var(--green-pale)' }}>
          <div className="card-body" style={{ textAlign: 'center', padding: '40px' }}>
            <h2 style={{ marginBottom: 16 }}>Ready to Optimize Your Farm?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Use our free calculator and read expert farming tips on our blog.</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/calculator" className="btn btn-primary btn-lg">Try the Calculator</Link>
              <Link to="/contact"    className="btn btn-outline btn-lg">Get in Touch</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default About;
