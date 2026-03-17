import React, { useEffect, useRef } from 'react';
import { useAdsense } from '../../context/AdsenseContext';

const AdSlot = ({ slot, format = 'auto', style = {}, className = '' }) => {
  const { config } = useAdsense();
  const adRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!config?.enabled || !config?.publisherId || pushed.current) return;
    const unitConfig = config?.adUnits?.[slot];
    if (!unitConfig?.enabled || !unitConfig?.adSlot) return;
    try {
      pushed.current = true;
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, [config, slot]);

  if (!config?.enabled || !config?.publisherId) {
    // Show placeholder in development
    return (
      <div className={`ad-slot ${className}`} style={{ minHeight: 90, ...style }}>
        <span>Ad Space ({slot})</span>
      </div>
    );
  }

  const unitConfig = config?.adUnits?.[slot];
  if (!unitConfig?.enabled || !unitConfig?.adSlot) return null;

  return (
    <div className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={config.publisherId}
        data-ad-slot={unitConfig.adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
        ref={adRef}
      />
    </div>
  );
};

export default AdSlot;
