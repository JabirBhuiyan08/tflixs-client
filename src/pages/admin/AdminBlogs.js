import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchBlogs = () => {
    setLoading(true);
    api.get('/api/blogs/admin')
      .then(res => setBlogs(res.data.blogs))
      .catch(() => toast.error('Failed to load blogs'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBlogs(); }, []);

  const togglePublish = async (blog) => {
    try {
      await api.put(`/api/blogs/${blog._id}`, { published: !blog.published });
      toast.success(`Post ${!blog.published ? 'published' : 'unpublished'}!`);
      fetchBlogs();
    } catch { toast.error('Failed to update post'); }
  };

  const deletePost = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/api/blogs/${id}`);
      toast.success('Post deleted');
      fetchBlogs();
    } catch { toast.error('Failed to delete post'); }
  };

  const filtered = blogs.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Blog Posts</h1>
          <p>Manage and publish your farming articles.</p>
        </div>
        <Link to="/admin/blogs/new" className="btn btn-primary">+ New Post</Link>
      </div>

      <div className="card">
        <div className="card-header" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search posts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 300 }}
          />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {filtered.length} post{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? <div className="spinner" /> : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No posts found. <Link to="/admin/blogs/new">Create your first post →</Link>
                  </td></tr>
                ) : filtered.map(blog => (
                  <tr key={blog._id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{blog.title.length > 50 ? blog.title.slice(0, 50) + '...' : blog.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>/blog/{blog.slug}</div>
                    </td>
                    <td><span className="badge badge-green">{blog.category}</span></td>
                    <td>
                      <button
                        className={`badge ${blog.published ? 'badge-green' : 'badge-amber'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        onClick={() => togglePublish(blog)}
                        title="Click to toggle"
                      >
                        {blog.published ? '✅ Published' : '⏸ Draft'}
                      </button>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>👁 {blog.views}</td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link to={`/admin/blogs/edit/${blog._id}`} className="btn btn-outline btn-sm">Edit</Link>
                        {blog.published && (
                          <a href={`/blog/${blog.slug}`} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">View</a>
                        )}
                        <button className="btn btn-danger btn-sm" onClick={() => deletePost(blog._id, blog.title)}>Delete</button>
                      </div>
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

export default AdminBlogs;
