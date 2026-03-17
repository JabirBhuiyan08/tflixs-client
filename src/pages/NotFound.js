import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{ textAlign: 'center', padding: '120px 20px' }}>
    <div style={{ fontSize: '5rem', marginBottom: 16 }}>🌱</div>
    <h1 style={{ fontSize: '3rem', marginBottom: 8 }}>404</h1>
    <h2 style={{ fontSize: '1.4rem', marginBottom: 16, color: 'var(--text-secondary)' }}>Page Not Found</h2>
    <p style={{ color: 'var(--text-muted)', marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
      The page you're looking for doesn't exist. It may have been moved or deleted.
    </p>
    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
      <Link to="/" className="btn btn-primary">Go Home</Link>
      <Link to="/calculator" className="btn btn-outline">Try Calculator</Link>
    </div>
  </div>
);

export default NotFound;
