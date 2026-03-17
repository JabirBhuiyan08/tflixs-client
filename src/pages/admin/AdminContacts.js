import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const AdminContacts = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchMessages = () => {
    setLoading(true);
    api.get('/api/contact')
      .then(res => setMessages(res.data.messages))
      .catch(() => toast.error('Failed to load messages'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/contact/${id}/status`, { status });
      setMessages(prev => prev.map(m => m._id === id ? { ...m, status } : m));
      if (selected?._id === id) setSelected(prev => ({ ...prev, status }));
      toast.success('Status updated');
    } catch { toast.error('Failed to update status'); }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/api/contact/${id}`);
      setMessages(prev => prev.filter(m => m._id !== id));
      if (selected?._id === id) setSelected(null);
      toast.success('Message deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const openMessage = async (msg) => {
    setSelected(msg);
    if (msg.status === 'unread') await updateStatus(msg._id, 'read');
  };

  const filtered = messages.filter(m => filter === 'all' ? true : m.status === filter);
  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>📬 Contact Messages</h1>
          <p>{unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All messages read'}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'unread', 'read', 'replied'].map(f => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'unread' && unreadCount > 0 && ` (${unreadCount})`}
          </button>
        ))}
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Message List */}
        <div className="card">
          {loading ? <div className="spinner" /> : (
            filtered.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No messages found.</div>
            ) : (
              <div>
                {filtered.map(msg => (
                  <div
                    key={msg._id}
                    className={`msg-item ${selected?._id === msg._id ? 'active' : ''} ${msg.status === 'unread' ? 'unread' : ''}`}
                    onClick={() => openMessage(msg)}
                    style={{
                      padding: '14px 18px',
                      borderBottom: '1px solid var(--border-light)',
                      cursor: 'pointer',
                      background: selected?._id === msg._id ? 'var(--green-faint)' : msg.status === 'unread' ? '#fffbeb' : 'white',
                      transition: 'background 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <strong style={{ fontSize: '0.92rem' }}>{msg.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{msg.subject}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {msg.message.slice(0, 60)}...
                      </span>
                      <span className={`badge ${msg.status === 'unread' ? 'badge-red' : msg.status === 'read' ? 'badge-blue' : 'badge-green'}`}>
                        {msg.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Message Detail */}
        {selected ? (
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: 0 }}>{selected.subject}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                  From: {selected.name} ({selected.email}) · {new Date(selected.createdAt).toLocaleString()}
                </p>
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => deleteMessage(selected._id)}>Delete</button>
            </div>
            <div className="card-body">
              <div style={{ background: 'var(--border-light)', padding: '16px', borderRadius: 8, fontSize: '0.92rem', lineHeight: 1.7, marginBottom: 20, whiteSpace: 'pre-wrap' }}>
                {selected.message}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="btn btn-primary btn-sm">
                  📧 Reply via Email
                </a>
                <button className="btn btn-outline btn-sm" onClick={() => updateStatus(selected._id, 'replied')}>
                  ✅ Mark Replied
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => updateStatus(selected._id, 'read')}>
                  👁 Mark Read
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>📬</div>
              <p>Select a message to read it</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContacts;
