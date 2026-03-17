import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import AdSlot from '../components/layout/AdSlot';
import NewsletterSignup from '../components/layout/NewsletterSignup';
import './BlogPost.css';

const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/api/blogs/${slug}`)
      .then(res => setBlog(res.data.blog))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;
  if (notFound) return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <h2>Article Not Found</h2>
      <p style={{ color: 'var(--text-muted)', margin: '16px 0' }}>This article may have been removed or the URL is incorrect.</p>
      <Link to="/blog" className="btn btn-primary">← Back to Blog</Link>
    </div>
  );
  if (!blog) return null;

  const siteUrl = window.location.origin;
  const title = blog.metaTitle || blog.title;
  const description = blog.metaDescription || blog.excerpt;
  const keywords = blog.metaKeywords || blog.tags?.join(', ');
  const ogImage = blog.ogImage || blog.featuredImage || `${siteUrl}/og-image.jpg`;

  return (
    <div className="post-page">
      <Helmet>
        <title>{title} | Tflixs Blog</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={blog.canonicalUrl || window.location.href} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": blog.title,
          "description": blog.excerpt,
          "image": blog.featuredImage,
          "datePublished": blog.createdAt,
          "dateModified": blog.updatedAt,
          "author": { "@type": "Person", "name": blog.author }
        })}</script>
      </Helmet>

      <div className="container post-layout">
        <article className="post-main">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <Link to="/blog">Blog</Link>
            <span>›</span>
            <span>{blog.category}</span>
          </nav>

          {/* Header */}
          <header className="post-header">
            <div className="post-meta">
              <span className="badge badge-green">{blog.category}</span>
              <span className="post-date">{new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span className="post-views">👁 {blog.views} views</span>
            </div>
            <h1>{blog.title}</h1>
            <p className="post-excerpt">{blog.excerpt}</p>
            {blog.tags?.length > 0 && (
              <div className="post-tags">
                {blog.tags.map(tag => <span key={tag} className="post-tag">#{tag}</span>)}
              </div>
            )}
          </header>

          {blog.featuredImage && (
            <div className="post-featured-img">
              <img src={blog.featuredImage} alt={blog.title} />
            </div>
          )}

          <AdSlot slot="inArticle" style={{ margin: '20px 0' }} />

          {/* Content */}
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Footer */}
          <div className="post-footer">
            <div className="post-footer__author">
              <div className="author-avatar">✍️</div>
              <div>
                <strong>{blog.author}</strong>
                <p>Agriculture Expert at Tflixs</p>
              </div>
            </div>
            <Link to="/blog" className="btn btn-outline">← More Articles</Link>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="post-sidebar">
          <AdSlot slot="sidebar" />

          <div className="card sidebar-card">
            <div className="card-body">
              <h3>🧮 Try Our Calculator</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '8px 0 16px' }}>
                Get precise fertilizer recommendations for your crop.
              </p>
              <Link to="/calculator" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Open Calculator
              </Link>
            </div>
          </div>

          <NewsletterSignup compact />
        </aside>
      </div>
    </div>
  );
};

export default BlogPost;
