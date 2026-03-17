import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Tracks page views in Google Analytics on every React route change.
 * Required because React is a SPA — the page doesn't actually reload
 * when navigating between pages, so GA needs to be told manually.
 *
 * Measurement ID: G-M2ENGZ03JL
 */
const GATracker = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Make sure gtag is loaded
    if (typeof window.gtag !== 'function') return;

    window.gtag('config', 'G-M2ENGZ03JL', {
      page_path: pathname + search,
    });
  }, [pathname, search]);

  return null;
};

export default GATracker;
