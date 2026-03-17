import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const PAGES = [
  { key: 'home', label: '🏠 Home Page' },
  { key: 'calculator', label: '🧮 Calculator Page' },
  { key: 'blog', label: '📝 Blog Listing' },
  { key: 'contact', label: '📬 Contact Page' },
  { key: 'about', label: 'ℹ️ About Page' },
  { key: 'global', label: '🌐 Global Defaults' },
];

const defaultSeo = {
  metaTitle: '', metaDescription: '', metaKeywords: '',
  ogTitle: '', ogDescription: '', ogImage: '',
  twitterCard: 'summary_large_image', canonicalUrl: '',
  robotsMeta: 'index, follow', schemaMarkup: ''
};

const AdminSEO = () => {
  const [activePage, setActivePage] = useState('home');
  const [forms, setForms] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/api/seo', { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } })
      .then(res => {
        const data = {};
        PAGES.forEach(p => {
          data[p.key] = { ...defaultSeo, ...(res.data.seoData[p.key] || {}) };
        });
        setForms(data);
      })
      .catch(() => toast.error('Failed to load SEO data'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForms(prev => ({ ...prev, [activePage]: { ...prev[activePage], [name]: value } }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/api/seo/${activePage}`, forms[activePage]);
      toast.success(`SEO settings saved for ${activePage} page!`);
    } catch { toast.error('Failed to save SEO settings'); }
    finally { setSaving(false); }
  };

  const form = forms[activePage] || defaultSeo;

  if (loading) return <div className="spinner" />;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>🔍 SEO Manager</h1>
          <p>Manage meta tags, keywords, and social sharing for every page.</p>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Page Selector */}
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header"><h3>Select Page</h3></div>
            <div style={{ padding: '8px 0' }}>
              {PAGES.map(p => (
                <button
                  key={p.key}
                  onClick={() => setActivePage(p.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    padding: '12px 20px',
                    background: activePage === p.key ? 'var(--green-faint)' : 'none',
                    border: 'none',
                    borderLeft: activePage === p.key ? '3px solid var(--green-primary)' : '3px solid transparent',
                    cursor: 'pointer',
                    font: 'inherit',
                    fontWeight: activePage === p.key ? '600' : '400',
                    color: activePage === p.key ? 'var(--green-primary)' : 'var(--text-secondary)',
                    textAlign: 'left',
                    fontSize: '0.92rem',
                    transition: 'all 0.15s'
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="card" style={{ background: 'var(--green-faint)', border: '1px solid var(--green-pale)' }}>
            <div className="card-body">
              <h4 style={{ marginBottom: 10 }}>💡 SEO Tips</h4>
              <ul style={{ listStyle: 'none', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                {[
                  'Meta title: 50–60 characters',
                  'Meta description: 150–160 characters',
                  'Use primary keyword in title',
                  'OG image: 1200×630px recommended',
                  'Keep keywords relevant & focused',
                  'Use schema markup for rich results'
                ].map(tip => (
                  <li key={tip} style={{ padding: '4px 0', borderBottom: '1px solid var(--border-light)' }}>✓ {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* SEO Form */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>{PAGES.find(p => p.key === activePage)?.label}</h3>
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
              {saving ? '⏳ Saving...' : '💾 Save'}
            </button>
          </div>
          <div className="card-body">
            <h4 style={{ marginBottom: 16, fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Basic Meta Tags</h4>

            <div className="form-group">
              <label>Meta Title</label>
              <input type="text" name="metaTitle" className="form-control" placeholder="Page title for search engines" value={form.metaTitle} onChange={handleChange} />
              <small style={{ color: form.metaTitle.length > 60 ? 'red' : 'var(--text-muted)', fontSize: '0.75rem' }}>{form.metaTitle.length}/60</small>
            </div>

            <div className="form-group">
              <label>Meta Description</label>
              <textarea name="metaDescription" className="form-control" rows={3} placeholder="Page description for search results" value={form.metaDescription} onChange={handleChange} />
              <small style={{ color: form.metaDescription.length > 160 ? 'red' : 'var(--text-muted)', fontSize: '0.75rem' }}>{form.metaDescription.length}/160</small>
            </div>

            <div className="form-group">
              <label>Meta Keywords</label>
              <input type="text" name="metaKeywords" className="form-control" placeholder="fertilizer calculator, NPK, farming tools, ..." value={form.metaKeywords} onChange={handleChange} />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Comma-separated</small>
            </div>

            <div className="form-group">
              <label>Robots Meta</label>
              <select name="robotsMeta" className="form-control" value={form.robotsMeta} onChange={handleChange}>
                <option value="index, follow">index, follow (default – recommended)</option>
                <option value="noindex, follow">noindex, follow</option>
                <option value="index, nofollow">index, nofollow</option>
                <option value="noindex, nofollow">noindex, nofollow</option>
              </select>
            </div>

            <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid var(--border-light)' }} />
            <h4 style={{ marginBottom: 16, fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Open Graph (Social Sharing)</h4>

            <div className="form-group">
              <label>OG Title</label>
              <input type="text" name="ogTitle" className="form-control" placeholder="Title for Facebook/LinkedIn shares" value={form.ogTitle} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>OG Description</label>
              <textarea name="ogDescription" className="form-control" rows={2} placeholder="Description for social shares" value={form.ogDescription} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>OG Image URL</label>
              <input type="url" name="ogImage" className="form-control" placeholder="https://tflixs.com/og-home.jpg (1200×630)" value={form.ogImage} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Twitter Card Type</label>
              <select name="twitterCard" className="form-control" value={form.twitterCard} onChange={handleChange}>
                <option value="summary_large_image">summary_large_image (recommended)</option>
                <option value="summary">summary</option>
              </select>
            </div>

            <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid var(--border-light)' }} />
            <h4 style={{ marginBottom: 16, fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Advanced</h4>

            <div className="form-group">
              <label>Canonical URL</label>
              <input type="url" name="canonicalUrl" className="form-control" placeholder="https://tflixs.com/page" value={form.canonicalUrl} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Schema Markup (JSON-LD)</label>
              <textarea name="schemaMarkup" className="form-control" rows={6} placeholder='{"@context":"https://schema.org","@type":"WebSite",...}' value={form.schemaMarkup} onChange={handleChange} style={{ fontFamily: 'monospace', fontSize: '0.85rem' }} />
            </div>

            <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>
              {saving ? '⏳ Saving...' : '💾 Save SEO Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSEO;
