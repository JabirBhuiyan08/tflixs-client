import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import SEOHead from '../components/layout/SEOHead';
import AdSlot from '../components/layout/AdSlot';
import WeatherWidget from '../components/layout/WeatherWidget';
import NewsletterSignup from '../components/layout/NewsletterSignup';
import { useLocale } from '../context/LocaleContext';
import './Calculator.css';

const AREA_UNITS = [
  { value: 'hectare', label: 'Hectare (ha)' },
  { value: 'acre', label: 'Acre' },
  { value: 'bigha', label: 'Bigha' },
  { value: 'katha', label: 'Katha' },
  { value: 'decimal', label: 'Decimal' },
];

const SOIL_LEVELS = [
  { value: '', label: 'Unknown / Skip' },
  { value: '0', label: 'Low' },
  { value: '1', label: 'Medium' },
  { value: '2', label: 'High' },
];

const Calculator = () => {
  const { t, formatPrice, locale } = useLocale();
  const [crops, setCrops] = useState([]);
  const [fertilizers, setFertilizers] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Form state
  const [selectedCrop, setSelectedCrop] = useState('');
  const [area, setArea] = useState('');
  const [areaUnit, setAreaUnit] = useState('acre');
  const [soilN, setSoilN] = useState('');
  const [soilP, setSoilP] = useState('');
  const [soilK, setSoilK] = useState('');
  const [searchCrop, setSearchCrop] = useState('');

  useEffect(() => {
    api.get('/api/calculator/crops').then(r => setCrops(r.data.crops));
    api.get('/api/calculator/fertilizers').then(r => setFertilizers(r.data.fertilizers));
  }, []);

  const filteredCrops = crops.filter(c =>
    c.name.toLowerCase().includes(searchCrop.toLowerCase())
  );

  const handleCalculate = async () => {
    if (!selectedCrop || !area || parseFloat(area) <= 0) {
      setError('Please select a crop and enter a valid area.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/calculator/calculate', {
        cropId: selectedCrop,
        area: parseFloat(area),
        areaUnit,
        soilN: soilN ? parseInt(soilN) : 0,
        soilP: soilP ? parseInt(soilP) : 0,
        soilK: soilK ? parseInt(soilK) : 0,
        selectedFertilizers: [],
        crops
      });
      setResult(res.data.result);
      setStep(4);
    } catch (e) {
      setError(e.response?.data?.message || 'Calculation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedCropObj = crops.find(c => c.id === selectedCrop);

  const handleReset = () => {
    setResult(null);
    setStep(1);
    setSelectedCrop('');
    setArea('');
    setSoilN(''); setSoilP(''); setSoilK('');
    setError('');
  };

  return (
    <div className="calc-page">
      <SEOHead page="calculator" title="Fertilizer Calculator – Free NPK Calculator for Crops" />

      <section className="page-hero">
        <div className="container">
          <h1>🧮 Fertilizer Calculator</h1>
          <p>Get precise NPK recommendations for your crop and land</p>
        </div>
      </section>

      <div className="container calc-layout">
        <div className="calc-main">



          {/* Progress Steps */}
          {step < 4 && (() => {
            const steps = [
              t('selectCrop'),
              t('enterArea'),
              t('soilData'),
              t('results'),
            ];
            return (
              <div className="calc-progress">
                {steps.map((label, i) => {
                  const stepNum = i + 1;
                  const isDone   = step > stepNum;
                  const isActive = step === stepNum;
                  return (
                    <div
                      key={stepNum}
                      className={`calc-progress__step${isDone ? ' done' : ''}${isActive ? ' active' : ''}`}
                    >
                      <div className="calc-progress__dot">
                        {isDone ? '✓' : stepNum}
                      </div>
                      <span>{label}</span>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {error && <div className="alert alert-error">{error}</div>}

          {/* Step 1: Crop Selection */}
          {step === 1 && (
            <div className="calc-step card">
              <div className="card-header">
                <h2>Step 1: Select Your Crop</h2>
                <p>Choose the crop you want to grow this season.</p>
              </div>
              <div className="card-body">
                <input
                  type="text"
                  className="form-control"
                  placeholder="🔍 Search crops..."
                  value={searchCrop}
                  onChange={e => setSearchCrop(e.target.value)}
                  style={{ marginBottom: 20 }}
                />
                <div className="crop-grid">
                  {filteredCrops.map(crop => (
                    <button
                      key={crop.id}
                      className={`crop-btn ${selectedCrop === crop.id ? 'selected' : ''}`}
                      onClick={() => setSelectedCrop(crop.id)}
                    >
                      <span className="crop-btn__icon">{crop.icon}</span>
                      <span className="crop-btn__name">{crop.name}</span>
                      <span className="crop-btn__season">{crop.season}</span>
                    </button>
                  ))}
                </div>
                <div className="calc-nav">
                  <div />
                  <button
                    className="btn btn-primary"
                    onClick={() => { if (!selectedCrop) { setError('Please select a crop.'); return; } setError(''); setStep(2); }}
                  >
                    {t('nextStep')}: {t('enterArea')} →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Area */}
          {step === 2 && (
            <div className="calc-step card">
              <div className="card-header">
                <h2>Step 2: Enter Land Area</h2>
                <p>How much land are you farming?</p>
              </div>
              <div className="card-body">
                {selectedCropObj && (
                  <div className="selected-crop-badge">
                    <span>{selectedCropObj.icon}</span>
                    <span>Selected: <strong>{selectedCropObj.name}</strong></span>
                    <button className="btn-link" onClick={() => setStep(1)}>Change</button>
                  </div>
                )}
                <div className="grid-2" style={{ marginTop: 24 }}>
                  <div className="form-group">
                    <label>Land Area *</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="e.g., 2.5"
                      value={area}
                      min="0.01"
                      step="0.01"
                      onChange={e => setArea(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Unit of Measurement</label>
                    <select className="form-control" value={areaUnit} onChange={e => setAreaUnit(e.target.value)}>
                      {AREA_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="calc-nav">
                  <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                  <button
                    className="btn btn-primary"
                    onClick={() => { if (!area || parseFloat(area) <= 0) { setError('Please enter a valid area.'); return; } setError(''); setStep(3); }}
                  >
                    Next: Soil Data →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Soil Data */}
          {step === 3 && (
            <div className="calc-step card">
              <div className="card-header">
                <h2>Step 3: Soil Nutrient Levels</h2>
                <p>Optional: Add soil test results for more accurate recommendations. You can skip this step.</p>
              </div>
              <div className="card-body">
                <div className="soil-info alert alert-info">
                  💡 <strong>Tip:</strong> Get your soil tested at your nearest Krishi Kendra or agriculture department for best results.
                </div>
                <div className="grid-3" style={{ marginTop: 20 }}>
                  <div className="form-group">
                    <label>🟤 Nitrogen (N) Level</label>
                    <select className="form-control" value={soilN} onChange={e => setSoilN(e.target.value)}>
                      {SOIL_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>🟡 Phosphorus (P) Level</label>
                    <select className="form-control" value={soilP} onChange={e => setSoilP(e.target.value)}>
                      {SOIL_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>🟣 Potassium (K) Level</label>
                    <select className="form-control" value={soilK} onChange={e => setSoilK(e.target.value)}>
                      {SOIL_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="calc-nav">
                  <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
                  <button className="btn btn-primary" onClick={handleCalculate} disabled={loading}>
                  {loading ? t('calculating') : t('calculate')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Results */}
          {step === 4 && result && (
            <div className="calc-results">
              <div className="results-header card">
                <div className="card-body">
                  <div className="results-title">
                    <div>
                      <h2>✅ Fertilizer Recommendations</h2>
                      <p>For <strong>{result.crop}</strong> on <strong>{result.area} hectares</strong></p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => window.print()}>🖨️ Print / PDF</button>
                      <button className="btn btn-outline btn-sm" onClick={handleReset}>🔄 New</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* NPK Summary */}
              <div className="npk-cards">
                <div className="npk-card npk-n">
                  <div className="npk-card__label">Nitrogen (N)</div>
                  <div className="npk-card__value">{result.requiredNPK.n} kg</div>
                  <div className="npk-card__sub">Total required</div>
                </div>
                <div className="npk-card npk-p">
                  <div className="npk-card__label">Phosphorus (P₂O₅)</div>
                  <div className="npk-card__value">{result.requiredNPK.p} kg</div>
                  <div className="npk-card__sub">Total required</div>
                </div>
                <div className="npk-card npk-k">
                  <div className="npk-card__label">Potassium (K₂O)</div>
                  <div className="npk-card__value">{result.requiredNPK.k} kg</div>
                  <div className="npk-card__sub">Total required</div>
                </div>
              </div>

              {result.source && (
                <div className="alert alert-info" style={{ marginTop: 12, fontSize: '0.82rem' }}>
                  📚 <strong>Data Source:</strong> {result.source} guidelines
                  {result.yieldTarget && ` · Target yield: ${result.yieldTarget}`}
                </div>
              )}

              <AdSlot slot="belowCalculator" style={{ margin: '16px 0' }} />

              {/* Recommendations Table */}
              <div className="card" style={{ marginTop: 24 }}>
                <div className="card-header"><h3>📦 Recommended Fertilizers</h3></div>
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Fertilizer</th>
                        <th>Total Qty</th>
                        <th>Per Hectare</th>
                        <th>{t('estCost')} ({locale.currency})</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.recommendations.map((r, i) => (
                        <tr key={i}>
                          <td><strong>{r.fertilizer}</strong></td>
                          <td><span className="badge badge-green">{r.requiredKg} kg</span></td>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{r.perHa} kg/ha</td>
                          <td>{formatPrice(r.costUSD)}</td>
                        </tr>
                      ))}
                      <tr className="total-row">
                        <td><strong>{t('totalCost')}</strong></td>
                        <td /><td />
                        <td><strong>{formatPrice(result.totalCostUSD)}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Application Schedule */}
              <div className="card" style={{ marginTop: 24 }}>
                <div className="card-header"><h3>📅 Application Schedule</h3></div>
                <div className="card-body">
                  {result.applicationSchedule.map((s, i) => (
                    <div key={i} className="schedule-row">
                      <div className="schedule-row__timing">
                        <span className="schedule-row__dot">{i + 1}</span>
                        <strong>{s.timing}</strong>
                      </div>
                      <div className="schedule-row__share">{s.share}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="alert alert-warning" style={{ marginTop: 20 }}>
                ⚠️ <strong>Disclaimer:</strong> {result.disclaimer || t('disclaimer')}
              </div>
              {result.priceNote && (
                <div className="alert alert-info" style={{ marginTop: 8, fontSize: '0.8rem' }}>
                  💱 {result.priceNote} {t('currencyNote', { currency: locale.currency })}
                </div>
              )}

              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <button className="btn btn-primary btn-lg" onClick={handleReset}>🔄 Calculate for Another Crop</button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="calc-sidebar">
          <AdSlot slot="sidebar" />

          <WeatherWidget />

          <div className="card sidebar-card">
            <div className="card-body">
              <h3>💡 Quick Tips</h3>
              <ul className="tips-list">
                <li>Test your soil every 2–3 years</li>
                <li>Split N application for better uptake</li>
                <li>Apply P and K as basal dose</li>
                <li>Use organic matter to improve soil health</li>
                <li>Monitor crop at 30 and 60 DAS</li>
              </ul>
            </div>
          </div>

          <div className="card sidebar-card">
            <div className="card-body">
              <h3>📊 NPK Basics</h3>
              <div className="npk-info">
                <div className="npk-info__item">
                  <span className="npk-info__symbol n">N</span>
                  <div>
                    <strong>Nitrogen</strong>
                    <p>Leaf growth & green color</p>
                  </div>
                </div>
                <div className="npk-info__item">
                  <span className="npk-info__symbol p">P</span>
                  <div>
                    <strong>Phosphorus</strong>
                    <p>Root & flower development</p>
                  </div>
                </div>
                <div className="npk-info__item">
                  <span className="npk-info__symbol k">K</span>
                  <div>
                    <strong>Potassium</strong>
                    <p>Fruit quality & disease resistance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <NewsletterSignup compact />
        </aside>
      </div>
    </div>
  );
};

export default Calculator;
