import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import './AdminBlogEditor.css';

const CATEGORIES = ['Crop Nutrition', 'Soil Health', 'Fertilizer Tips', 'Farming Guides', 'News', 'Other'];

const defaultForm = {
  title: '', slug: '', excerpt: '', content: '', category: 'Farming Guides',
  tags: '', featuredImage: '', published: false,
  metaTitle: '', metaDescription: '', metaKeywords: '', canonicalUrl: '', ogImage: ''
};

const AdminBlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    if (isEdit) {
      // fetch all admin blogs and find by id
      api.get('/api/blogs/admin').then(res => {
        const blog = res.data.blogs.find(b => b._id === id);
        if (blog) {
          // need full content, fetch by slug
          api.get(`/api/blogs/${blog.slug}`)
            .then(r => {
              const b = r.data.blog;
              setForm({
                title: b.title, slug: b.slug, excerpt: b.excerpt,
                content: b.content, category: b.category,
                tags: b.tags?.join(', ') || '', featuredImage: b.featuredImage || '',
                published: b.published,
                metaTitle: b.metaTitle || '', metaDescription: b.metaDescription || '',
                metaKeywords: b.metaKeywords || '', canonicalUrl: b.canonicalUrl || '',
                ogImage: b.ogImage || ''
              });
            }).catch(() => toast.error('Failed to load blog'))
            .finally(() => setFetching(false));
        } else { setFetching(false); }
      }).catch(() => setFetching(false));
    }
  }, [id, isEdit]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Auto-generate slug from title
  const handleTitleChange = e => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    setForm(prev => ({ ...prev, title, slug: prev.slug === '' || !isEdit ? slug : prev.slug }));
  };

  const handleSubmit = async (publish = null) => {
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      toast.error('Title, excerpt, and content are required.');
      return;
    }
    setLoading(true);
    const payload = {
      ...form,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      published: publish !== null ? publish : form.published
    };
    try {
      if (isEdit) {
        await api.put(`/api/blogs/${id}`, payload);
        toast.success('Post updated!');
      } else {
        await api.post('/api/blogs', payload);
        toast.success('Post created!');
        navigate('/admin/blogs');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="spinner" />;

  return (
    <div className="blog-editor">
      <div className="admin-page-header">
        <div>
          <h1>{isEdit ? '✏️ Edit Post' : '✍️ New Blog Post'}</h1>
          <p>Create and publish farming articles for your readers.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" onClick={() => navigate('/admin/blogs')}>Cancel</button>
          <button className="btn btn-outline" onClick={() => handleSubmit(false)} disabled={loading}>💾 Save Draft</button>
          <button className="btn btn-primary" onClick={() => handleSubmit(true)} disabled={loading}>
            {loading ? '⏳ Saving...' : '🚀 Publish'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="editor-tabs">
        {['content', 'seo', 'settings'].map(tab => (
          <button
            key={tab}
            className={`editor-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'content' && '📝 Content'}
            {tab === 'seo' && '🔍 SEO & Meta'}
            {tab === 'settings' && '⚙️ Settings'}
          </button>
        ))}
      </div>

      <div className="editor-body">
        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="editor-main">
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-body">
                <div className="form-group">
                  <label>Post Title *</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="e.g., Best Fertilizers for Rice in Kharif Season"
                    value={form.title}
                    onChange={handleTitleChange}
                  />
                </div>
                <div className="form-group">
                  <label>URL Slug</label>
                  <input
                    type="text"
                    name="slug"
                    className="form-control"
                    placeholder="auto-generated-from-title"
                    value={form.slug}
                    onChange={handleChange}
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    URL: /blog/{form.slug || 'your-post-slug'}
                  </small>
                </div>
                <div className="form-group">
                  <label>Excerpt / Summary *</label>
                  <textarea
                    name="excerpt"
                    className="form-control"
                    placeholder="Write a compelling summary (150–200 characters ideal)..."
                    rows={3}
                    value={form.excerpt}
                    onChange={handleChange}
                  />
                  <small style={{ color: form.excerpt.length > 200 ? 'red' : 'var(--text-muted)', fontSize: '0.78rem' }}>
                    {form.excerpt.length}/200 characters
                  </small>
                </div>
                <div className="form-group">
                  <label>Featured Image URL</label>
                  <input
                    type="url"
                    name="featuredImage"
                    className="form-control"
                    placeholder="https://example.com/image.jpg"
                    value={form.featuredImage}
                    onChange={handleChange}
                  />
                  {form.featuredImage && (
                    <img src={form.featuredImage} alt="preview" style={{ marginTop: 10, maxHeight: 120, borderRadius: 8 }} />
                  )}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><h3>Article Content *</h3></div>
              <div className="card-body">
                <div className="form-group">
                  <label>Content (HTML supported)</label>
                  <textarea
                    name="content"
                    className="form-control content-textarea"
                    placeholder="Write your full article content here. HTML tags are supported for formatting..."
                    value={form.content}
                    onChange={handleChange}
                    rows={20}
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    HTML is supported: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;blockquote&gt;, &lt;table&gt;, etc.
                  </small>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="card">
            <div className="card-header">
              <h3>🔍 SEO & Meta Data</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>
                These fields override the global SEO settings for this specific post.
              </p>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Meta Title</label>
                <input
                  type="text"
                  name="metaTitle"
                  className="form-control"
                  placeholder="Leave blank to use post title"
                  value={form.metaTitle}
                  onChange={handleChange}
                />
                <small style={{ color: form.metaTitle.length > 60 ? 'red' : 'var(--text-muted)', fontSize: '0.78rem' }}>
                  {form.metaTitle.length}/60 (ideal: 50–60)
                </small>
              </div>
              <div className="form-group">
                <label>Meta Description</label>
                <textarea
                  name="metaDescription"
                  className="form-control"
                  placeholder="Short description for search engines (150–160 characters ideal)"
                  rows={3}
                  value={form.metaDescription}
                  onChange={handleChange}
                />
                <small style={{ color: form.metaDescription.length > 160 ? 'red' : 'var(--text-muted)', fontSize: '0.78rem' }}>
                  {form.metaDescription.length}/160 characters
                </small>
              </div>
              <div className="form-group">
                <label>Meta Keywords</label>
                <input
                  type="text"
                  name="metaKeywords"
                  className="form-control"
                  placeholder="fertilizer calculator, rice fertilizer, NPK, ..."
                  value={form.metaKeywords}
                  onChange={handleChange}
                />
                <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Comma-separated keywords</small>
              </div>
              <div className="form-group">
                <label>OG Image URL (Social Share Image)</label>
                <input
                  type="url"
                  name="ogImage"
                  className="form-control"
                  placeholder="https://example.com/og-image.jpg (1200×630 ideal)"
                  value={form.ogImage}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Canonical URL</label>
                <input
                  type="url"
                  name="canonicalUrl"
                  className="form-control"
                  placeholder="https://tflixs.com/blog/your-post"
                  value={form.canonicalUrl}
                  onChange={handleChange}
                />
              </div>

              {/* Live SEO Preview */}
              <div className="seo-preview">
                <div className="seo-preview__label">Google Search Preview:</div>
                <div className="seo-preview__box">
                  <div className="seo-preview__title">{form.metaTitle || form.title || 'Your Post Title'} | Tflixs</div>
                  <div className="seo-preview__url">https://tflixs.com/blog/{form.slug || 'your-post'}</div>
                  <div className="seo-preview__desc">{form.metaDescription || form.excerpt || 'Your meta description will appear here...'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="card">
            <div className="card-header"><h3>⚙️ Post Settings</h3></div>
            <div className="card-body">
              <div className="form-group">
                <label>Category</label>
                <select name="category" className="form-control" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  className="form-control"
                  placeholder="fertilizer, rice, soil, NPK"
                  value={form.tags}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={form.published}
                  onChange={handleChange}
                  style={{ width: 18, height: 18, cursor: 'pointer' }}
                />
                <label htmlFor="published" style={{ cursor: 'pointer', marginBottom: 0, fontWeight: 600 }}>
                  Published (visible to public)
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBlogEditor;
