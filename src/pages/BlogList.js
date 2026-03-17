import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import SEOHead from '../components/layout/SEOHead';
import AdSlot from '../components/layout/AdSlot';
import './BlogList.css';

const CATEGORIES = ['All', 'Crop Nutrition', 'Soil Health', 'Fertilizer Tips', 'Farming Guides', 'News', 'Other'];

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category') || 'All';
  const search = searchParams.get('search') || '';
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 9 };
    if (category !== 'All') params.category = category;
    if (search) params.search = search;
    api.get('/api/blogs', { params })
      .then(res => {
        setBlogs(res.data.blogs);
        setTotal(res.data.total);
        setPages(res.data.pages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, category, search]);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    next.set(key, value);
    next.set('page', '1');
    setSearchParams(next);
  };

  const handleSearch = e => {
    e.preventDefault();
    setFilter('search', searchInput);
  };

  return (
    <div className="blog-page">
      <SEOHead page="blog" />

      <section className="page-hero">
        <div className="container">
          <h1>🌾 Farming Blog</h1>
          <p>Expert tips on fertilizers, soil health, and crop management</p>
        </div>
      </section>

      <div className="container" style={{ padding: '16px 20px 0' }}>
        <AdSlot slot="header" />
      </div>

      <div className="container section-sm">
        {/* Search + Filter */}
        <div className="blog-controls">
          <form onSubmit={handleSearch} className="blog-search">
            <input
              type="text"
              className="form-control"
              placeholder="Search articles..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
          <div className="blog-categories">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`cat-btn ${category === cat ? 'active' : ''}`}
                onClick={() => setFilter('category', cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : blogs.length === 0 ? (
          <div className="no-blogs">
            <p>📝 No articles found. Check back soon!</p>
            <Link to="/blog" className="btn btn-outline" onClick={() => setSearchParams({})}>Clear Filters</Link>
          </div>
        ) : (
          <>
            <p className="blog-count">{total} article{total !== 1 ? 's' : ''} found</p>
            <div className="blog-grid">
              {blogs.map((blog, i) => (
                <React.Fragment key={blog._id}>
                  <article className="blog-card card">
                    {blog.featuredImage && (
                      <div className="blog-card__img">
                        <img src={blog.featuredImage} alt={blog.title} loading="lazy" />
                      </div>
                    )}
                    {!blog.featuredImage && (
                      <div className="blog-card__img-placeholder">🌱</div>
                    )}
                    <div className="card-body blog-card__body">
                      <div className="blog-card__meta">
                        <span className="badge badge-green">{blog.category}</span>
                        <span className="blog-card__date">{new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <h2 className="blog-card__title">
                        <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                      </h2>
                      <p className="blog-card__excerpt">{blog.excerpt}</p>
                      <div className="blog-card__footer">
                        <Link to={`/blog/${blog.slug}`} className="btn btn-outline btn-sm">Read More →</Link>
                        <span className="blog-card__views">👁 {blog.views}</span>
                      </div>
                    </div>
                  </article>
                  {/* Ad after 3rd post */}
                  {i === 2 && <div className="blog-grid__ad"><AdSlot slot="inArticle" /></div>}
                </React.Fragment>
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="pagination">
                <button onClick={() => setFilter('page', page - 1)} disabled={page === 1}>‹</button>
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button key={p} className={p === page ? 'active' : ''} onClick={() => setFilter('page', p)}>{p}</button>
                ))}
                <button onClick={() => setFilter('page', page + 1)} disabled={page === pages}>›</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogList;
