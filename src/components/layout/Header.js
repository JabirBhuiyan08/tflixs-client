import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import LanguageSwitcher from './LanguageSwitcher';
import './Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useLocale();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
        <Link to="/" className="header__logo">
          <span className="header__logo-icon">🌿</span>
          <span>
            <span className="header__logo-main">T</span>
            <span className="header__logo-accent">flixs</span>
          </span>
        </Link>

        <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>{t('home')}</NavLink>
          <NavLink to="/calculator" className={({ isActive }) => isActive ? 'active' : ''}>{t('calculator')}</NavLink>
          <NavLink to="/calendar"   className={({ isActive }) => isActive ? 'active' : ''}>Calendar</NavLink>
          <NavLink to="/pest-guide" className={({ isActive }) => isActive ? 'active' : ''}>Pest Guide</NavLink>
          <NavLink to="/blog"       className={({ isActive }) => isActive ? 'active' : ''}>{t('blog')}</NavLink>
          <NavLink to="/contact"    className={({ isActive }) => isActive ? 'active' : ''}>{t('contact')}</NavLink>
          <Link to="/calculator" className="btn btn-primary btn-sm header__cta">
            {t('tryCalculator')}
          </Link>
        </nav>

        <div className="header__right">
          <LanguageSwitcher />
          <button
            className={`header__burger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
