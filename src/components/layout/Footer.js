import React from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();
  const { t } = useLocale();

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container footer__grid">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span>🌿</span>
              <span>Tflixs</span>
            </Link>
            <p>{t('footerTagline')}</p>
            <div className="footer__badges">
              <span className="badge badge-green">Free to Use</span>
              <span className="badge badge-amber">No Login Required</span>
            </div>
          </div>

          <div className="footer__col">
            <h4>Tools</h4>
            <ul>
              <li><Link to="/calculator">NPK Calculator</Link></li>
              <li><Link to="/calendar">Crop Calendar</Link></li>
              <li><Link to="/pest-guide">Pest & Disease Guide</Link></li>
              <li><Link to="/calculator">Soil Analysis</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Resources</h4>
            <ul>
              <li><Link to="/blog">Farming Blog</Link></li>
              <li><Link to="/blog?category=Soil+Health">Soil Health</Link></li>
              <li><Link to="/blog?category=Crop+Nutrition">Crop Nutrition</Link></li>
              <li><Link to="/blog?category=Fertilizer+Tips">Fertilizer Tips</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><a href="/sitemap.xml">Sitemap</a></li>
              <li><Link to="/admin/login">Admin</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>{t('copyright', { year })}</p>
          <p className="footer__disclaimer">
            Calculator results are for guidance only. Consult an agronomist for professional advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
