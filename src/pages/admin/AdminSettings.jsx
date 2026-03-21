import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const AdminSettings = () => {
  const { admin, changePassword } = useAuth();
  const [saving, setSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // Refs for uncontrolled inputs – allows browser autofill
  const currentRef = useRef(null);
  const newRef = useRef(null);
  const confirmRef = useRef(null);

  const handlePasswordChange = async e => {
    e.preventDefault();

    const current = currentRef.current.value;
    const newPw = newRef.current.value;
    const confirm = confirmRef.current.value;

    if (newPw !== confirm) {
      toast.error('New passwords do not match!');
      return;
    }
    if (newPw.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    setSaving(true);
    try {
      await changePassword(current, newPw);
      toast.success('Password updated successfully via Firebase!');

      // Clear fields after success
      currentRef.current.value = '';
      newRef.current.value = '';
      confirmRef.current.value = '';
    } catch (err) {
      const code = err?.code || '';
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        toast.error('Current password is incorrect.');
      } else if (code === 'auth/too-many-requests') {
        toast.error('Too many attempts. Please wait and try again.');
      } else {
        toast.error(err?.message || 'Failed to update password.');
      }
    } finally {
      setSaving(false);
    }
  };

  // Reusable password input component (uncontrolled)
  const PassInput = ({ id, name, placeholder, show, onToggle, refProp, autoComplete }) => (
    <div style={{ position: 'relative' }}>
      <input
        id={id}
        type={show ? 'text' : 'password'}
        name={name}
        className="form-control"
        placeholder={placeholder}
        ref={refProp}
        autoComplete={autoComplete}
        defaultValue=""  // initial empty, but browser autofill can populate
        style={{ paddingRight: 44 }}
      />
      <button
        type="button"
        onClick={onToggle}
        style={{
          position: 'absolute', right: 12, top: '50%',
          transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '1.1rem', color: 'var(--text-muted)'
        }}
        aria-label={show ? 'Hide' : 'Show'}
      >
        {show ? '🙈' : '👁'}
      </button>
    </div>
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>⚙️ Settings</h1>
          <p>Manage your admin account and Firebase authentication.</p>
        </div>
      </div>

      <div style={{ maxWidth: 600 }}>

        {/* Account Info */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header"><h3>Account Information</h3></div>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'var(--green-pale)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', fontWeight: 700, color: 'var(--green-dark)'
              }}>
                {admin?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>{admin?.name || 'Admin'}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{admin?.email}</div>
                <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
                  <span className="badge badge-green">Administrator</span>
                  <span className="badge" style={{ background: '#fff8f0', color: '#c2500f', border: '1px solid #fde8cc' }}>
                    🔥 Firebase Auth
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="card">
          <div className="card-header">
            <h3>🔒 Change Password</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Password is updated directly in Firebase Authentication.
            </p>
          </div>
          <div className="card-body">
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <PassInput
                  id="currentPassword"
                  name="currentPassword"
                  placeholder="Enter current password"
                  show={showCurrent}
                  onToggle={() => setShowCurrent(v => !v)}
                  refProp={currentRef}
                  autoComplete="current-password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <PassInput
                  id="newPassword"
                  name="newPassword"
                  placeholder="At least 8 characters"
                  show={showNew}
                  onToggle={() => setShowNew(v => !v)}
                  refProp={newRef}
                  autoComplete="new-password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type={showNew ? 'text' : 'password'}  // match visibility with new password field
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Repeat new password"
                  ref={confirmRef}
                  autoComplete="new-password"
                  defaultValue=""
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? '⏳ Updating…' : '🔒 Update Password'}
              </button>
            </form>
          </div>
        </div>

        {/* Info panel */}
        <div className="card" style={{ marginTop: 24, background: '#f8fafc' }}>
          <div className="card-body">
            <h4 style={{ marginBottom: 12 }}>🛠️ Quick Reference</h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 2 }}>
              <div><strong>Site:</strong> <a href="/" target="_blank" rel="noreferrer">View Website →</a></div>
              <div><strong>Auth Provider:</strong> 🔥 Firebase Authentication (Email/Password)</div>
              <div><strong>Admin Email:</strong> {admin?.email}</div>
              <div><strong>Single Admin:</strong> Only the email in <code>REACT_APP_ADMIN_EMAIL</code> can log in</div>
              <div><strong>Firebase Console:</strong> <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer">console.firebase.google.com →</a></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;