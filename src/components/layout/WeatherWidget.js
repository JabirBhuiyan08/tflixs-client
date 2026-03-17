import React, { useState, useEffect } from 'react';
import './WeatherWidget.css';

const WEATHER_CODES = {
  0:  { label: 'Clear Sky',     icon: '☀️' },
  1:  { label: 'Mainly Clear',  icon: '🌤️' },
  2:  { label: 'Partly Cloudy', icon: '⛅' },
  3:  { label: 'Overcast',      icon: '☁️' },
  45: { label: 'Foggy',         icon: '🌫️' },
  48: { label: 'Icy Fog',       icon: '🌫️' },
  51: { label: 'Light Drizzle', icon: '🌦️' },
  53: { label: 'Drizzle',       icon: '🌦️' },
  55: { label: 'Heavy Drizzle', icon: '🌧️' },
  61: { label: 'Light Rain',    icon: '🌧️' },
  63: { label: 'Rain',          icon: '🌧️' },
  65: { label: 'Heavy Rain',    icon: '🌧️' },
  71: { label: 'Light Snow',    icon: '🌨️' },
  73: { label: 'Snow',          icon: '❄️'  },
  75: { label: 'Heavy Snow',    icon: '❄️'  },
  80: { label: 'Rain Showers',  icon: '🌦️' },
  81: { label: 'Rain Showers',  icon: '🌧️' },
  82: { label: 'Heavy Showers', icon: '⛈️'  },
  95: { label: 'Thunderstorm',  icon: '⛈️'  },
  96: { label: 'Thunderstorm',  icon: '⛈️'  },
  99: { label: 'Thunderstorm',  icon: '⛈️'  },
};

const getFarmingTip = (code, temp) => {
  if (code >= 95) return '⚠️ Thunderstorm expected — secure equipment, avoid fieldwork';
  if (code >= 61) return '💧 Rain detected — delay fertilizer application to avoid runoff';
  if (code >= 51) return '🌦️ Drizzle expected — light irrigation not needed today';
  if (code === 0 || code === 1) {
    if (temp > 35) return '🌡️ Very hot — water crops early morning or evening';
    if (temp < 10) return '🥶 Cold weather — protect sensitive crops from frost';
    return '✅ Good conditions for fieldwork and fertilizer application';
  }
  if (code >= 71) return '❄️ Snow/frost risk — protect crops with covers';
  return '🌱 Monitor crop conditions closely today';
};

/**
 * Get location from IP — HTTPS only APIs to avoid mixed content errors.
 * All APIs listed are free, no key needed, and CORS-friendly.
 */
const getLocationFromIP = async () => {
  // Option 1: ipwho.is — free, HTTPS, CORS-friendly, no key
  try {
    const res  = await fetch('https://ipwho.is/');
    const data = await res.json();
    if (data.success && data.latitude) {
      return {
        lat:     data.latitude,
        lon:     data.longitude,
        city:    data.city    || 'Your Location',
        country: data.country || '',
      };
    }
  } catch (_) {}

  // Option 2: ip-api.com via HTTPS proxy — same data, HTTPS
  try {
    const res  = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    if (data.latitude) {
      return {
        lat:     data.latitude,
        lon:     data.longitude,
        city:    data.city         || 'Your Location',
        country: data.country_name || '',
      };
    }
  } catch (_) {}

  // Option 3: Abstract API — free tier, HTTPS
  try {
    const res  = await fetch('https://ipgeolocation.abstractapi.com/v1/?api_key=free');
    const data = await res.json();
    if (data.latitude) {
      return {
        lat:     parseFloat(data.latitude),
        lon:     parseFloat(data.longitude),
        city:    data.city    || 'Your Location',
        country: data.country || '',
      };
    }
  } catch (_) {}

  return null;
};

/**
 * Fetch weather from Open-Meteo — 100% free, no API key, HTTPS, CORS-friendly
 */
const fetchWeatherData = async (lat, lon) => {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,precipitation` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code` +
    `&timezone=auto&forecast_days=5`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  return res.json();
};

const WeatherWidget = () => {
  const [weather,  setWeather]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [location, setLocation] = useState('');
  const [unit,     setUnit]     = useState('C');
  const [error,    setError]    = useState('');

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        let lat, lon, cityName;

        // Step 1: Try browser geolocation (asks user — most accurate)
        const geoResult = await new Promise((resolve) => {
          if (!navigator.geolocation) { resolve(null); return; }
          navigator.geolocation.getCurrentPosition(
            pos  => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
            ()   => resolve(null),
            { timeout: 5000, maximumAge: 600000 }
          );
        });

        if (geoResult) {
          lat = geoResult.lat;
          lon = geoResult.lon;
          // Reverse geocode with Nominatim (free, HTTPS, CORS-ok)
          try {
            const geoRes  = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
              { headers: { 'Accept-Language': 'en' } }
            );
            const geoData = await geoRes.json();
            const addr    = geoData.address || {};
            const city    = addr.city || addr.town || addr.village || addr.county || 'Your Location';
            const country = addr.country || '';
            cityName      = country ? `${city}, ${country}` : city;
          } catch (_) {
            cityName = 'Your Location';
          }
        } else {
          // Step 2: IP-based location (silent, no permission needed)
          const ipLoc = await getLocationFromIP();
          if (ipLoc) {
            lat      = ipLoc.lat;
            lon      = ipLoc.lon;
            cityName = ipLoc.country ? `${ipLoc.city}, ${ipLoc.country}` : ipLoc.city;
          } else {
            // Step 3: Absolute fallback — Dhaka (your base location)
            lat      = 23.8103;
            lon      = 90.4125;
            cityName = 'Dhaka, Bangladesh';
          }
        }

        const data = await fetchWeatherData(lat, lon);

        if (!cancelled && data?.current) {
          setWeather(data);
          setLocation(cityName);
        } else if (!cancelled) {
          setError('Could not load weather data');
        }
      } catch (err) {
        console.warn('Weather widget error:', err.message);
        if (!cancelled) setError('Weather data unavailable');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();
    return () => { cancelled = true; };
  }, []);

  const toF      = (c) => Math.round(c * 9 / 5 + 32);
  const dispTemp = (c) => unit === 'C' ? `${Math.round(c)}°C` : `${toF(c)}°F`;

  if (loading) return (
    <div className="weather-widget weather-widget--loading">
      <div className="weather-loading">
        <div className="spinner" style={{ width: 24, height: 24, margin: 0 }} />
        <span>Detecting location...</span>
      </div>
    </div>
  );

  if (error || !weather?.current) return (
    <div className="weather-widget weather-widget--error">
      <div className="weather-loading" style={{ flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: '1.5rem' }}>🌡️</span>
        <span style={{ fontSize: '0.82rem' }}>Weather unavailable</span>
        <span style={{ fontSize: '0.72rem', opacity: 0.6 }}>Check your connection</span>
      </div>
    </div>
  );

  const cur   = weather.current;
  const daily = weather.daily;
  const code  = cur.weather_code;
  const wInfo = WEATHER_CODES[code] || { label: 'Unknown', icon: '🌡️' };
  const tip   = getFarmingTip(code, cur.temperature_2m);
  const days  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="weather-widget">
      <div className="weather-header">
        <div className="weather-location">
          <span>📍</span>
          <span title={location}>{location.length > 22 ? location.slice(0, 22) + '…' : location}</span>
        </div>
        <button className="weather-unit-toggle" onClick={() => setUnit(u => u === 'C' ? 'F' : 'C')}>
          °{unit === 'C' ? 'F' : 'C'}
        </button>
      </div>

      <div className="weather-current">
        <div className="weather-icon">{wInfo.icon}</div>
        <div className="weather-temp">{dispTemp(cur.temperature_2m)}</div>
        <div className="weather-desc">{wInfo.label}</div>
      </div>

      <div className="weather-stats">
        <div className="weather-stat">
          <span>💧</span>
          <span>{cur.relative_humidity_2m}%</span>
          <small>Humidity</small>
        </div>
        <div className="weather-stat">
          <span>💨</span>
          <span>{Math.round(cur.wind_speed_10m)} km/h</span>
          <small>Wind</small>
        </div>
        <div className="weather-stat">
          <span>🌧️</span>
          <span>{cur.precipitation} mm</span>
          <small>Rain</small>
        </div>
      </div>

      <div className="weather-tip">{tip}</div>

      <div className="weather-forecast">
        {daily.time.slice(0, 5).map((date, i) => {
          const d     = new Date(date);
          const dCode = daily.weather_code[i];
          const dInfo = WEATHER_CODES[dCode] || { icon: '🌡️' };
          return (
            <div key={date} className="weather-day">
              <span className="weather-day__name">{i === 0 ? 'Today' : days[d.getDay()]}</span>
              <span className="weather-day__icon">{dInfo.icon}</span>
              <span className="weather-day__high">{dispTemp(daily.temperature_2m_max[i])}</span>
              <span className="weather-day__low">{dispTemp(daily.temperature_2m_min[i])}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherWidget;
