import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/layout/SEOHead';
import AdSlot from '../components/layout/AdSlot';
import WeatherWidget from '../components/layout/WeatherWidget';
import { useLocale } from '../context/LocaleContext';
import './Home.css';

const features = [
  { icon: '🌾', key: 'cropSpecific',    title: 'Crop-Specific Recommendations', desc: 'Tailored NPK ratios for 18+ crops including rice, wheat, vegetables, and fruits.' },
  { icon: '🧪', key: 'soilAnalysis',    title: 'Soil Analysis Integration',      desc: 'Input your soil test results for precision-adjusted fertilizer recommendations.' },
  { icon: '📐', key: 'multiArea',       title: 'Multiple Area Units',            desc: 'Works with hectares, acres, bigha, katha, decimal – any land measurement system.' },
  { icon: '💰', key: 'costEst',         title: 'Cost Estimation',                desc: 'Get approximate fertilizer cost estimates to help plan your farming budget.' },
  { icon: '📅', key: 'schedule',        title: 'Application Schedule',           desc: 'Know exactly when and how to split your fertilizer application for best results.' },
  { icon: '🌱', key: 'organic',         title: 'Organic Options',                desc: 'Includes vermicompost, FYM, and neem cake alongside chemical fertilizers.' },
];

const crops = [
  { name: 'Rice', icon: '🌾' }, { name: 'Wheat', icon: '🌿' }, { name: 'Maize', icon: '🌽' },
  { name: 'Tomato', icon: '🍅' }, { name: 'Potato', icon: '🥔' }, { name: 'Sugarcane', icon: '🎋' },
  { name: 'Cotton', icon: '🌱' }, { name: 'Banana', icon: '🍌' },
];

const Home = () => {
  const { t } = useLocale();

  const steps = [
    { step: '1', title: t('selectCrop'),  desc: 'Choose from 18+ crops.' },
    { step: '2', title: t('enterArea'),   desc: 'Any unit: acre, bigha, hectare.' },
    { step: '3', title: t('soilData'),    desc: 'Optional but improves accuracy.' },
    { step: '4', title: t('results'),     desc: 'Instant NPK plan + costs.' },
  ];

  return (
    <div className="home">
      <SEOHead page="home" />

      {/* Hero */}
      <section className="hero">
        <div className="hero__bg-pattern" />
        <div className="container hero__content">
          <div className="hero__badge"><span>🌱</span> {t('freeForFarmers')}</div>
          <h1 className="hero__title">
            {t('heroTitle')}<br />
            <span className="hero__title-accent">{t('heroSubtitle')}</span>
          </h1>
          <p className="hero__subtitle">{t('heroDesc')}</p>
          <div className="hero__actions">
            <Link to="/calculator" className="btn btn-primary btn-lg">
              {t('startCalculating')}
            </Link>
            <Link to="/blog" className="btn btn-outline btn-lg">
              {t('readFarmingTips')}
            </Link>
          </div>
          <div className="hero__stats">
            <div className="hero__stat"><strong>18+</strong><span>Crops</span></div>
            <div className="hero__stat-divider" />
            <div className="hero__stat"><strong>15+</strong><span>Fertilizers</span></div>
            <div className="hero__stat-divider" />
            <div className="hero__stat"><strong>100%</strong><span>Free</span></div>
          </div>
        </div>
      </section>

      {/* Ad – Header */}
      <div className="container" style={{ padding: '16px 20px' }}>
        <AdSlot slot="header" />
      </div>

      {/* Crops strip */}
      <section className="crops-strip">
        <div className="container">
          <p className="crops-strip__label">Supported Crops:</p>
          <div className="crops-strip__list">
            {crops.map(c => (
              <Link to="/calculator" key={c.name} className="crops-strip__item">
                <span>{c.icon}</span>
                <span>{c.name}</span>
              </Link>
            ))}
            <Link to="/calculator" className="crops-strip__item crops-strip__more">+ More →</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Everything You Need for Precision Farming</h2>
            <p className="section-subtitle">Our calculator goes beyond basic NPK ratios — it considers your soil, crop, area, and budget.</p>
          </div>
          <div className="grid-3 features__grid">
            {features.map(f => (
              <div key={f.key} className="feature-card card">
                <div className="card-body">
                  <div className="feature-card__icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section how-it-works">
        <div className="container">
          <div className="section-header center">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Get your fertilizer plan in 4 simple steps.</p>
          </div>
          <div className="steps">
            {steps.map((s, i) => (
              <div key={s.step} className="step">
                <div className="step__number">{s.step}</div>
                <div className="step__content">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
                {i < steps.length - 1 && <div className="step__arrow">→</div>}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/calculator" className="btn btn-primary btn-lg">{t('startCalculating')}</Link>
          </div>
        </div>
      </section>

      {/* Ad – mid page */}
      <div className="container" style={{ padding: '0 20px 40px' }}>
        <AdSlot slot="belowCalculator" />
      </div>

      {/* Tools Grid + Weather */}
      <section className="section tools-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">More Free Farming Tools</h2>
            <p className="section-subtitle">Everything you need to make smarter farming decisions.</p>
          </div>
          <div className="tools-grid">
            <Link to="/calendar" className="tool-card card">
              <div className="card-body">
                <div className="tool-card__icon">📅</div>
                <h3>Crop Calendar</h3>
                <p>Planting and harvesting schedules for 15+ crops by month.</p>
                <span className="tool-card__link">Explore →</span>
              </div>
            </Link>
            <Link to="/pest-guide" className="tool-card card">
              <div className="card-body">
                <div className="tool-card__icon">💊</div>
                <h3>Pest & Disease Guide</h3>
                <p>Identify and treat common crop problems with expert advice.</p>
                <span className="tool-card__link">Explore →</span>
              </div>
            </Link>
            <Link to="/calculator" className="tool-card card">
              <div className="card-body">
                <div className="tool-card__icon">🧮</div>
                <h3>Fertilizer Calculator</h3>
                <p>Get precise NPK recommendations for any crop and area.</p>
                <span className="tool-card__link">Calculate →</span>
              </div>
            </Link>
            <div className="tool-card weather-card">
              <WeatherWidget />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container cta-banner__inner">
          <div className="cta-banner__text">
            <h2>Ready to Optimize Your Crop Nutrition?</h2>
            <p>Join thousands of farmers using Tflixs. No signup required.</p>
          </div>
          <Link to="/calculator" className="btn btn-amber btn-lg">{t('startCalculating')}</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
