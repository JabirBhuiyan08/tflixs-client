import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AdsenseContext = createContext(null);
export const useAdsense = () => useContext(AdsenseContext);

export const AdsenseProvider = ({ children }) => {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    api.get('/api/adsense')
      .then(res => {
        setConfig(res.data.config);
        const c = res.data.config;
        if (c?.enabled && c?.publisherId) {
          // Inject AdSense script dynamically
          const existing = document.querySelector('script[data-adsense]');
          if (!existing) {
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${c.publisherId}`;
            script.crossOrigin = 'anonymous';
            script.setAttribute('data-adsense', 'true');
            document.head.appendChild(script);
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <AdsenseContext.Provider value={{ config }}>
      {children}
    </AdsenseContext.Provider>
  );
};
