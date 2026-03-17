import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const AD_UNITS = [
  { key: 'header', label: '📢 Header Banner (728×90)', desc: 'Shown at the top of every page below the main nav' },
  { key: 'sidebar', label: '📌 Sidebar Rectangle (300×250)', desc: 'Shown in calculator and blog post sidebars' },
  { key: 'inArticle', label: '📖 In-Article Ad', desc: 'Shown between blog post content' },
  { key: 'belowCalculator', label: '🧮 Below Calculator', desc: 'Shown after calculator results are displayed' },
  { key: 'footer', label: '🔻 Footer Banner', desc: 'Shown in the footer area' },
];

const AdminAdsense = () => {
  const [config, setConfig] = useState({
    publisherId: '', enabled: false, autoAds: false,
    adUnits: {
      header: { adSlot: '', enabled: false },
      sidebar: { adSlot: '', enabled: false },
      inArticle: { adSlot: '', enabled: false },
      belowCalculator: { adSlot: '', enabled: false },
      footer: { adSlot: '', enabled: false }
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/api/adsense')
      .then(res => {
        const c = res.data.config;
        setConfig({
          publisherId: c.publisherId || '',
          enabled: c.enabled || false,
          autoAds: c.autoAds || false,
          adUnits: {
            header: { adSlot: '', enabled: false, ...(c.adUnits?.header || {}) },
            sidebar: { adSlot: '', enabled: false, ...(c.adUnits?.sidebar || {}) },
            inArticle: { adSlot: '', enabled: false, ...(c.adUnits?.inArticle || {}) },
            belowCalculator: { adSlot: '', enabled: false, ...(c.adUnits?.belowCalculator || {}) },
            footer: { adSlot: '', enabled: false, ...(c.adUnits?.footer || {}) }
          }
        });
      })
      .catch(() => toast.error('Failed to load AdSense config'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleUnitChange = (unitKey, field, value) => {
    setConfig(prev => ({
      ...prev,
      adUnits: { ...prev.adUnits, [unitKey]: { ...prev.adUnits[unitKey], [field]: value } }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/api/adsense', config);
      toast.success('AdSense settings saved! Reload the site to apply changes.');
    } catch { toast.error('Failed to save AdSense settings'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>💰 Google AdSense</h1>
          <p>Configure your AdSense publisher ID and ad unit placements.</p>
        </div>
      </div>

      {/* Setup Guide */}
      <div className="card" style={{ marginBottom: 24, background: '#fffbeb', border: '1px solid #fcd34d' }}>
        <div className="card-body">
          <h4>📋 Setup Guide</h4>
          <ol style={{ marginLeft: 20, marginTop: 8, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <li>Sign up at <a href="https://adsense.google.com" target="_blank" rel="noreferrer">adsense.google.com</a> and get your Publisher ID (<code>ca-pub-XXXXXXXXXXXXXXXX</code>)</li>
            <li>Add your website and wait for approval</li>
            <li>Create individual Ad Units in your AdSense dashboard and copy the <strong>Ad Slot IDs</strong></li>
            <li>Paste the Publisher ID and each Ad Slot ID below, enable the ones you want to show</li>
            <li>Save settings – ads will appear automatically once approved</li>
          </ol>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header"><h3>Publisher Settings</h3></div>
        <div className="card-body">
          <div className="form-group">
            <label>Publisher ID *</label>
            <input
              type="text"
              name="publisherId"
              className="form-control"
              placeholder="ca-pub-XXXXXXXXXXXXXXXX"
              value={config.publisherId}
              onChange={handleChange}
            />
            <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Found in your AdSense account → Account settings</small>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '12px 16px', background: 'var(--border-light)', borderRadius: 8 }}>
              <input type="checkbox" name="enabled" checked={config.enabled} onChange={handleChange} style={{ width: 18, height: 18 }} />
              <div>
                <strong>Enable AdSense Ads</strong>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>Master switch – turns all ads on or off</p>
              </div>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '12px 16px', background: 'var(--border-light)', borderRadius: 8 }}>
              <input type="checkbox" name="autoAds" checked={config.autoAds} onChange={handleChange} style={{ width: 18, height: 18 }} />
              <div>
                <strong>Auto Ads</strong>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>Let Google automatically place ads across your site</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Ad Units */}
      <div className="card">
        <div className="card-header"><h3>Ad Unit Placements</h3></div>
        <div className="card-body">
          {AD_UNITS.map(unit => (
            <div key={unit.key} style={{ padding: '16px 0', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <strong style={{ fontSize: '0.95rem' }}>{unit.label}</strong>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>{unit.desc}</p>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <input
                    type="checkbox"
                    checked={config.adUnits[unit.key]?.enabled || false}
                    onChange={e => handleUnitChange(unit.key, 'enabled', e.target.checked)}
                    style={{ width: 16, height: 16 }}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Enable</span>
                </label>
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Ad Slot ID</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., 1234567890"
                  value={config.adUnits[unit.key]?.adSlot || ''}
                  onChange={e => handleUnitChange(unit.key, 'adSlot', e.target.value)}
                  style={{ maxWidth: 300 }}
                />
              </div>
            </div>
          ))}

          <button
            className="btn btn-primary btn-lg"
            onClick={handleSave}
            disabled={saving}
            style={{ marginTop: 24, width: '100%', justifyContent: 'center' }}
          >
            {saving ? '⏳ Saving...' : '💾 Save AdSense Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAdsense;
