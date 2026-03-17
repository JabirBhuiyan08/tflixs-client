import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import SitemapStatus from '../../components/admin/SitemapStatus';
import '../../components/admin/AdminLayout.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ blogs: 0, messages: 0, unread: 0, published: 0 });
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/blogs/admin'),
      api.get('/api/contact')
    ]).then(([blogsRes, contactsRes]) => {
      const blogs = blogsRes.data.blogs;
      const messages = contactsRes.data.messages;
      setStats({
        blogs: blogs.length,
        published: blogs.filter(b => b.published).length,
        messages: messages.length,
        unread: messages.filter(m => m.status === 'unread').length
      });
      setRecentBlogs(blogs.slice(0, 5));
      setRecentMessages(messages.slice(0, 5));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statItems = [
    { icon: '📝', label: 'Total Posts', value: stats.blogs, color: '#dbeafe', link: '/admin/blogs' },
    { icon: '✅', label: 'Published', value: stats.published, color: '#d1fae5', link: '/admin/blogs' },
    { icon: '📬', label: 'Messages', value: stats.messages, color: '#fef3cd', link: '/admin/contacts' },
    { icon: '🔔', label: 'Unread', value: stats.unread, color: '#fee2e2', link: '/admin/contacts' },
  ];

  if (loading) return <div className="spinner" />;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening on your site.</p>
        </div>
        <Link to="/admin/blogs/new" className="btn btn-primary">+ New Blog Post</Link>
      </div>

      {/* Stats */}
      <div className="stat-cards">
        {statItems.map(s => (
          <Link to={s.link} key={s.label} className="stat-card" style={{ textDecoration: 'none' }}>
            <div className="stat-card__icon" style={{ background: s.color }}>{s.icon}</div>
            <div>
              <div className="stat-card__value">{s.value}</div>
              <div className="stat-card__label">{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Recent Posts */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Recent Blog Posts</h3>
            <Link to="/admin/blogs" className="btn btn-outline btn-sm">View All</Link>
          </div>
          <div className="table-responsive">
            <table>
              <thead><tr><th>Title</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {recentBlogs.length === 0 ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No posts yet</td></tr>
                ) : recentBlogs.map(b => (
                  <tr key={b._id}>
                    <td>
                      <Link to={`/admin/blogs/edit/${b._id}`} style={{ color: 'var(--green-primary)', fontWeight: 500 }}>
                        {b.title.length > 40 ? b.title.slice(0, 40) + '...' : b.title}
                      </Link>
                    </td>
                    <td>
                      <span className={`badge ${b.published ? 'badge-green' : 'badge-amber'}`}>
                        {b.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Recent Messages</h3>
            <Link to="/admin/contacts" className="btn btn-outline btn-sm">View All</Link>
          </div>
          <div className="table-responsive">
            <table>
              <thead><tr><th>Name</th><th>Subject</th><th>Status</th></tr></thead>
              <tbody>
                {recentMessages.length === 0 ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No messages yet</td></tr>
                ) : recentMessages.map(m => (
                  <tr key={m._id}>
                    <td style={{ fontWeight: 500 }}>{m.name}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{m.subject}</td>
                    <td>
                      <span className={`badge ${m.status === 'unread' ? 'badge-red' : m.status === 'read' ? 'badge-blue' : 'badge-green'}`}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header"><h3>Quick Actions</h3></div>
        <div className="card-body">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/admin/blogs/new" className="btn btn-primary">✍️ Write New Post</Link>
            <Link to="/admin/seo" className="btn btn-outline">🔍 Update SEO</Link>
            <Link to="/admin/adsense" className="btn btn-outline">💰 AdSense Settings</Link>
            <Link to="/admin/contacts" className="btn btn-outline">📬 Check Messages</Link>
            <a href="/" target="_blank" rel="noreferrer" className="btn btn-outline">🌐 View Site</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
