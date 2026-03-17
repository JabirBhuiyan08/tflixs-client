import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../utils/api';

const SITE_NAME = 'Tflixs';
const SITE_DOMAIN = 'https://tflixs.com'; // change to your domain

const SEOHead = ({
  page,
  title: propTitle,
  description: propDesc,
  keywords: propKeywords,
  ogImage: propOgImage,
  canonicalUrl: propCanonical,
  children
}) => {
  const [seo, setSeo] = useState(null);

  useEffect(() => {
    if (page) {
      api.get(`/api/seo/${page}`).then(res => setSeo(res.data.seo)).catch(() => {});
    }
  }, [page]);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : SITE_DOMAIN;

  const title       = propTitle       || seo?.metaTitle       || `${SITE_NAME} – Free NPK Fertilizer Calculator for Farmers`;
  const description = propDesc        || seo?.metaDescription  || 'Free online fertilizer calculator for farmers. Get accurate NPK recommendations for rice, wheat, vegetables and more crops. No registration required.';
  const keywords    = propKeywords    || seo?.metaKeywords     || 'fertilizer calculator, NPK calculator, crop nutrition, farming tool, Tflixs, soil nutrient calculator';
  const ogImage     = propOgImage     || seo?.ogImage          || `${SITE_DOMAIN}/og-image.jpg`;
  const canonical   = propCanonical   || seo?.canonicalUrl     || currentUrl;
  const robots      = seo?.robotsMeta || 'index, follow';

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description"        content={description} />
      <meta name="keywords"           content={keywords} />
      <meta name="robots"             content={robots} />
      <link rel="canonical"           href={canonical} />

      {/* Open Graph */}
      <meta property="og:type"        content="website" />
      <meta property="og:title"       content={seo?.ogTitle       || title} />
      <meta property="og:description" content={seo?.ogDescription || description} />
      <meta property="og:image"       content={ogImage} />
      <meta property="og:url"         content={canonical} />
      <meta property="og:site_name"   content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card"        content={seo?.twitterCard || 'summary_large_image'} />
      <meta name="twitter:title"       content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={ogImage} />

      {/* Schema */}
      {seo?.schemaMarkup && (
        <script type="application/ld+json">{seo.schemaMarkup}</script>
      )}

      {children}
    </Helmet>
  );
};

export default SEOHead;
