import React, { useState, useRef, useEffect } from 'react';
import { useLocale } from '../../context/LocaleContext';
import './LanguageSwitcher.css';

// The full list shown in the dropdown
const OPTIONS = [
  { code: 'US', flag: '🇺🇸', label: 'English (US)',  currency: 'USD' },
  { code: 'GB', flag: '🇬🇧', label: 'English (UK)',  currency: 'GBP' },
  { code: 'BD', flag: '🇧🇩', label: 'বাংলা',          currency: 'BDT' },
  { code: 'IN', flag: '🇮🇳', label: 'हिंदी',          currency: 'INR' },
  { code: 'PK', flag: '🇵🇰', label: 'اردو',           currency: 'PKR' },
  { code: 'ID', flag: '🇮🇩', label: 'Indonesia',      currency: 'IDR' },
  { code: 'PH', flag: '🇵🇭', label: 'Filipino',       currency: 'PHP' },
  { code: 'VN', flag: '🇻🇳', label: 'Tiếng Việt',     currency: 'VND' },
  { code: 'TH', flag: '🇹🇭', label: 'ภาษาไทย',        currency: 'THB' },
  { code: 'MY', flag: '🇲🇾', label: 'Melayu',         currency: 'MYR' },
  { code: 'CN', flag: '🇨🇳', label: '中文',            currency: 'CNY' },
  { code: 'JP', flag: '🇯🇵', label: '日本語',           currency: 'JPY' },
  { code: 'KR', flag: '🇰🇷', label: '한국어',           currency: 'KRW' },
  { code: 'NG', flag: '🇳🇬', label: 'English (NG)',   currency: 'NGN' },
  { code: 'KE', flag: '🇰🇪', label: 'English (KE)',   currency: 'KES' },
  { code: 'EG', flag: '🇪🇬', label: 'العربية',         currency: 'EGP' },
  { code: 'SA', flag: '🇸🇦', label: 'العربية (SA)',    currency: 'SAR' },
  { code: 'BR', flag: '🇧🇷', label: 'Português',      currency: 'BRL' },
  { code: 'MX', flag: '🇲🇽', label: 'Español',        currency: 'MXN' },
  { code: 'DE', flag: '🇩🇪', label: 'Deutsch',        currency: 'EUR' },
  { code: 'FR', flag: '🇫🇷', label: 'Français',       currency: 'EUR' },
  { code: 'AU', flag: '🇦🇺', label: 'English (AU)',   currency: 'AUD' },
];

const FLAG_MAP = Object.fromEntries(OPTIONS.map(o => [o.code, o.flag]));

const LanguageSwitcher = () => {
  const { locale, setManualLocale, resetLocale } = useLocale();
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentFlag = FLAG_MAP[locale.country] || '🌐';

  const filtered = OPTIONS.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase()) ||
    o.currency.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (code) => {
    setManualLocale(code);
    setOpen(false);
    setSearch('');
  };

  return (
    <div className="lang-switcher" ref={ref}>
      <button
        className="lang-switcher__btn"
        onClick={() => setOpen(v => !v)}
        aria-label="Change language and currency"
        title={`${locale.languageName} · ${locale.currency}`}
      >
        <span className="lang-switcher__flag">{currentFlag}</span>
        <span className="lang-switcher__code">{locale.currency}</span>
        <span className="lang-switcher__arrow">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="lang-switcher__dropdown">
          <div className="lang-switcher__header">
            <span>🌍 Language & Currency</span>
          </div>

          {/* Search */}
          <div className="lang-switcher__search">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="lang-switcher__search-input"
              autoFocus
            />
          </div>

          {/* Current selection */}
          <div className="lang-switcher__current">
            <span>✓ Current: {currentFlag} {locale.languageName} · {locale.currency}</span>
          </div>

          {/* Options */}
          <div className="lang-switcher__list">
            {filtered.map(opt => (
              <button
                key={opt.code}
                className={`lang-switcher__item ${locale.country === opt.code ? 'active' : ''}`}
                onClick={() => handleSelect(opt.code)}
              >
                <span className="lang-switcher__item-flag">{opt.flag}</span>
                <span className="lang-switcher__item-label">{opt.label}</span>
                <span className="lang-switcher__item-currency">{opt.currency}</span>
                {locale.country === opt.code && <span className="lang-switcher__check">✓</span>}
              </button>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                No results found
              </div>
            )}
          </div>

          {/* Auto-detect option */}
          <button className="lang-switcher__auto" onClick={() => { resetLocale(); setOpen(false); }}>
            🔄 Auto-detect my location
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
