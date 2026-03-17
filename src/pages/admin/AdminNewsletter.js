import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading]         = useState(true);

  const fetch = () => {
    setLoading(true);
    api.get('/api/newsletter')
      .then(res => setSubscribers(res.data.subscribers))
      .catch(() => toast.error('Failed to load subscribers'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const remove = async (id, email) => {
    if (!window.confirm(`Unsubscribe ${email}?`)) return;
    try {
      await api.delete(`/api/newsletter/${id}`);
      toast.success('Unsubscribed');
      fetch();
    } catch { toast.error('Failed'); }
  };

  const exportCSV = () => {
    const rows = [['Name','Email','Subscribed Date']];
    subscribers.forEach(s => rows.push([s.name || '', s.email, new Date(s.createdAt).toLocaleDateString()]));
    const csv  = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url; a.download = 'tflixs-subscribers.csv'; a.click();
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>📧 Newsletter Subscribers</h1>
          <p>{subscribers.length} active subscriber{subscribers.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-outline" onClick={exportCSV} disabled={subscribers.length === 0}>
          ⬇️ Export CSV
        </button>
      </div>

      <div className="card">
        {loading ? <div className="spinner" /> : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Source</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No subscribers yet. Add the newsletter section to your pages!
                  </td></tr>
                ) : subscribers.map(s => (
                  <tr key={s._id}>
                    <td><strong>{s.email}</strong></td>
                    <td>{s.name || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                    <td><span className="badge badge-green">{s.source}</span></td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(s._id, s.email)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNewsletter;
