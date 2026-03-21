// src/components/SeedCalculator.js (updated with concise field descriptions)

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SeedCalculator.css';

const seedsData = [
  { id: 'corn', name: 'Corn (Maize)', seedsPerPound: 1500, germination: 95, purity: 99, emergence: 90, targetPopAcre: 28000 },
  { id: 'wheat', name: 'Wheat', seedsPerPound: 12000, germination: 90, purity: 98, emergence: 85, targetPopAcre: 1200000 },
  { id: 'rice', name: 'Rice (Paddy)', seedsPerPound: 18000, germination: 85, purity: 98, emergence: 80, targetPopAcre: 1500000 },
  { id: 'soybean', name: 'Soybean', seedsPerPound: 2500, germination: 90, purity: 99, emergence: 85, targetPopAcre: 140000 },
  { id: 'cotton', name: 'Cotton', seedsPerPound: 4500, germination: 85, purity: 98, emergence: 80, targetPopAcre: 50000 },
  { id: 'sunflower', name: 'Sunflower', seedsPerPound: 6500, germination: 90, purity: 98, emergence: 85, targetPopAcre: 25000 },
  { id: 'canola', name: 'Canola', seedsPerPound: 100000, germination: 95, purity: 99, emergence: 85, targetPopAcre: 800000 },
  { id: 'barley', name: 'Barley', seedsPerPound: 12000, germination: 90, purity: 98, emergence: 85, targetPopAcre: 1200000 },
  { id: 'sorghum', name: 'Sorghum', seedsPerPound: 14000, germination: 85, purity: 98, emergence: 80, targetPopAcre: 80000 },
];

const SeedCalculator = () => {
  const [mode, setMode] = useState('basic');
  const [area, setArea] = useState('');
  const [areaUnit, setAreaUnit] = useState('acre');
  const [selectedSeed, setSelectedSeed] = useState('');
  const [result, setResult] = useState(null);
  const [wasteBuffer, setWasteBuffer] = useState(false);

  const [desiredPopulation, setDesiredPopulation] = useState('');
  const [seedsPerPoundBasic, setSeedsPerPoundBasic] = useState('');

  const [desiredPopulationAdv, setDesiredPopulationAdv] = useState('');
  const [seedsPerPoundAdv, setSeedsPerPoundAdv] = useState('');
  const [germinationRate, setGerminationRate] = useState('');
  const [purityRate, setPurityRate] = useState('');
  const [emergenceFactor, setEmergenceFactor] = useState('');

  const handleSeedChange = (e) => {
    const seedId = e.target.value;
    const seed = seedsData.find((s) => s.id === seedId);
    if (seed) {
      setSelectedSeed(seedId);
      if (mode === 'basic') {
        setSeedsPerPoundBasic(seed.seedsPerPound.toString());
        setDesiredPopulation(seed.targetPopAcre.toString());
      } else {
        setSeedsPerPoundAdv(seed.seedsPerPound.toString());
        setGerminationRate(seed.germination.toString());
        setPurityRate(seed.purity.toString());
        setEmergenceFactor(seed.emergence.toString());
        setDesiredPopulationAdv(seed.targetPopAcre.toString());
      }
      toast.info(`Loaded typical values for ${seed.name}. You can adjust them as needed.`);
    } else {
      setSelectedSeed('');
      if (mode === 'basic') {
        setSeedsPerPoundBasic('');
        setDesiredPopulation('');
      } else {
        setSeedsPerPoundAdv('');
        setGerminationRate('');
        setPurityRate('');
        setEmergenceFactor('');
        setDesiredPopulationAdv('');
      }
    }
  };

  const resetForm = () => {
    setArea('');
    setAreaUnit('acre');
    setSelectedSeed('');
    setResult(null);
    setWasteBuffer(false);
    if (mode === 'basic') {
      setDesiredPopulation('');
      setSeedsPerPoundBasic('');
    } else {
      setDesiredPopulationAdv('');
      setSeedsPerPoundAdv('');
      setGerminationRate('');
      setPurityRate('');
      setEmergenceFactor('');
    }
    toast.info('Form reset.');
  };

  const calculate = () => {
    const areaNum = parseFloat(area);
    if (isNaN(areaNum) || areaNum <= 0) {
      toast.error('Please enter a valid area.');
      return;
    }

    let areaInAcres = areaNum;
    if (areaUnit === 'hectare') {
      areaInAcres = areaNum * 2.471;
    }

    let seedLbsPerAcre, totalSeedLbs;

    if (mode === 'basic') {
      const desiredPop = parseFloat(desiredPopulation);
      const seedsPerLb = parseFloat(seedsPerPoundBasic);
      if (isNaN(desiredPop) || isNaN(seedsPerLb) || desiredPop <= 0 || seedsPerLb <= 0) {
        toast.error('Please fill in desired population and seeds per pound with valid numbers.');
        return;
      }
      seedLbsPerAcre = desiredPop / seedsPerLb;
    } else {
      const desiredPop = parseFloat(desiredPopulationAdv);
      const seedsPerLb = parseFloat(seedsPerPoundAdv);
      const germination = parseFloat(germinationRate) / 100;
      const purity = parseFloat(purityRate) / 100;
      const emergence = parseFloat(emergenceFactor) / 100;
      if (
        isNaN(desiredPop) ||
        isNaN(seedsPerLb) ||
        isNaN(germination) ||
        isNaN(purity) ||
        isNaN(emergence) ||
        desiredPop <= 0 ||
        seedsPerLb <= 0
      ) {
        toast.error('Please fill in all fields with valid numbers.');
        return;
      }
      const plsFactor = germination * purity * emergence;
      if (plsFactor <= 0) {
        toast.error('Invalid germination, purity, or emergence values.');
        return;
      }
      seedLbsPerAcre = desiredPop / (seedsPerLb * plsFactor);
    }

    totalSeedLbs = seedLbsPerAcre * areaInAcres;

    if (wasteBuffer) {
      totalSeedLbs *= 1.05;
      seedLbsPerAcre *= 1.05;
    }

    const kgPerHa = seedLbsPerAcre * 1.12085;

    setResult({
      mode,
      seedLbsPerAcre: seedLbsPerAcre.toFixed(2),
      totalSeedLbs: totalSeedLbs.toFixed(2),
      kgPerHa: kgPerHa.toFixed(2),
      areaUnit,
      selectedSeed,
      wasteBuffer,
    });
    toast.success('Calculation complete!');
  };

  const selectedSeedName = seedsData.find((s) => s.id === selectedSeed)?.name || '';

  return (
    <>
      <Helmet>
        <title>Seeding Rate Calculator - Tflixs</title>
        <meta
          name="description"
          content="Calculate precise seeding rates for your farm. Choose basic or advanced mode. Select your crop, enter field size, and get exact seed requirements in pounds per acre and kg per hectare. Free seed rate calculator for farmers."
        />
        <meta
          name="keywords"
          content="seeding rate calculator, seed rate calculator, planting rate, seed per acre, basic seed calculator, advanced seed calculator, Tflixs"
        />
        <link rel="canonical" href="https://tflixs.com/seed-calculator" />
      </Helmet>

      <div className="seed-calculator">
        <h2>Seed Rate Calculator</h2>
        <p className="subtitle">Calculate the exact seed needed for your field</p>

        <div className="mode-tabs">
          <button className={`mode-tab ${mode === 'basic' ? 'active' : ''}`} onClick={() => setMode('basic')}>
            Basic
          </button>
          <button className={`mode-tab ${mode === 'advanced' ? 'active' : ''}`} onClick={() => setMode('advanced')}>
            Advanced
          </button>
        </div>

        <div className="form-grid">
          {/* Seed Selection */}
          <div className="input-group full-width">
            <label>Select Seed / Crop</label>
            <select value={selectedSeed} onChange={handleSeedChange}>
              <option value="">-- Select a seed type (optional) --</option>
              {seedsData.map((seed) => (
                <option key={seed.id} value={seed.id}>
                  {seed.name}
                </option>
              ))}
            </select>
            <p className="field-description">
              Choose a crop to auto‑fill typical values. You can still edit them.
            </p>
          </div>

          {/* Area */}
          <div className="input-group">
            <label>Area</label>
            <input
              type="number"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g., 50"
              step="any"
            />
            <select value={areaUnit} onChange={(e) => setAreaUnit(e.target.value)}>
              <option value="acre">Acres</option>
              <option value="hectare">Hectares</option>
            </select>
            <p className="field-description">
              Field size. 1 acre = 0.405 ha | 1 ha = 2.471 acres.
            </p>
          </div>

          {/* Mode-specific fields */}
          {mode === 'basic' ? (
            <>
              <div className="input-group">
                <label>
                  Desired Population
                  <span className="tooltip-icon" data-tooltip="Target plants per acre/ha. Example: Corn ≈ 28,000 plants/acre.">ⓘ</span>
                </label>
                <input
                  type="number"
                  value={desiredPopulation}
                  onChange={(e) => setDesiredPopulation(e.target.value)}
                  placeholder={`Plants per ${areaUnit === 'acre' ? 'acre' : 'hectare'}`}
                  step="any"
                />
                <span className="unit-hint">
                  plants/{areaUnit === 'acre' ? 'acre' : 'ha'}
                </span>
                <p className="field-description">Final harvest plants per unit area.</p>
              </div>
              <div className="input-group">
                <label>
                  Seeds per Pound
                  <span className="tooltip-icon" data-tooltip="Number of seeds in one pound. Wheat ~12,000, Corn ~1,500.">ⓘ</span>
                </label>
                <input
                  type="number"
                  value={seedsPerPoundBasic}
                  onChange={(e) => setSeedsPerPoundBasic(e.target.value)}
                  placeholder="e.g., 12000"
                  step="any"
                />
                <span className="unit-hint">seeds/lb</span>
                <p className="field-description">Seeds in 1 lb (check seed bag).</p>
              </div>
            </>
          ) : (
            <>
              <div className="input-group">
                <label>
                  Desired Population
                  <span className="tooltip-icon" data-tooltip="Target plants per acre/ha. Example: Corn ≈ 28,000 plants/acre.">ⓘ</span>
                </label>
                <input
                  type="number"
                  value={desiredPopulationAdv}
                  onChange={(e) => setDesiredPopulationAdv(e.target.value)}
                  placeholder={`Plants per ${areaUnit === 'acre' ? 'acre' : 'hectare'}`}
                  step="any"
                />
                <span className="unit-hint">
                  plants/{areaUnit === 'acre' ? 'acre' : 'ha'}
                </span>
                <p className="field-description">Final harvest plants per unit area.</p>
              </div>
              <div className="input-group">
                <label>
                  Seeds per Pound
                  <span className="tooltip-icon" data-tooltip="Number of seeds in one pound. Wheat ~12,000, Corn ~1,500.">ⓘ</span>
                </label>
                <input
                  type="number"
                  value={seedsPerPoundAdv}
                  onChange={(e) => setSeedsPerPoundAdv(e.target.value)}
                  placeholder="e.g., 12000"
                  step="any"
                />
                <span className="unit-hint">seeds/lb</span>
                <p className="field-description">Seeds in 1 lb (seed bag).</p>
              </div>
              <div className="input-group">
                <label>
                  Germination Rate (%)
                  <span className="tooltip-icon" data-tooltip="% of seeds that sprout under ideal lab conditions. Found on seed label.">ⓘ</span>
                </label>
                <input
                  type="number"
                  value={germinationRate}
                  onChange={(e) => setGerminationRate(e.target.value)}
                  placeholder="e.g., 95"
                  step="any"
                />
                <span className="unit-hint">%</span>
                <p className="field-description">% seeds that sprout (seed label).</p>
              </div>
              <div className="input-group">
                <label>
                  Purity Rate (%)
                  <span className="tooltip-icon" data-tooltip="% of pure crop seed in the lot (excluding weeds/inert matter). On seed label.">ⓘ</span>
                </label>
                <input
                  type="number"
                  value={purityRate}
                  onChange={(e) => setPurityRate(e.target.value)}
                  placeholder="e.g., 98"
                  step="any"
                />
                <span className="unit-hint">%</span>
                <p className="field-description">% pure seed (seed label).</p>
              </div>
              <div className="input-group">
                <label>
                  Field Emergence (%)
                  <span className="tooltip-icon" data-tooltip="% of germinated seeds that survive to become established plants. Accounts for field losses.">ⓘ</span>
                </label>
                <input
                  type="number"
                  value={emergenceFactor}
                  onChange={(e) => setEmergenceFactor(e.target.value)}
                  placeholder="e.g., 85"
                  step="any"
                />
                <span className="unit-hint">%</span>
                <p className="field-description">% seeds that establish in field.</p>
              </div>
            </>
          )}

          {/* Waste Buffer Toggle */}
          <div className="input-group full-width">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={wasteBuffer}
                onChange={(e) => setWasteBuffer(e.target.checked)}
              />
              Add 5% safety buffer
            </label>
            <p className="field-description">Extra seed for spillage/calibration.</p>
          </div>
        </div>

        <div className="button-group">
          <button onClick={calculate} className="btn-primary">
            Calculate
          </button>
          <button onClick={resetForm} className="btn-secondary">
            Reset
          </button>
        </div>

        {result && (
          <div className="result-card">
            <h3>Results ({result.mode === 'basic' ? 'Basic' : 'Advanced'})</h3>
            {result.selectedSeed && (
              <div className="result-item">
                <span>Crop:</span>
                <strong>{selectedSeedName}</strong>
              </div>
            )}
            <div className="result-item">
              <span>Seed Rate:</span>
              <strong>{result.seedLbsPerAcre} lb/acre</strong>
              <span className="tooltip">ℹ️<span className="tooltip-text">Pounds of seed required per acre.</span></span>
            </div>
            <div className="result-item">
              <span>Seed Rate (metric):</span>
              <strong>{result.kgPerHa} kg/ha</strong>
              <span className="tooltip">ℹ️<span className="tooltip-text">Kilograms per hectare (1 lb/acre ≈ 1.12085 kg/ha).</span></span>
            </div>
            <div className="result-item">
              <span>Total Seed Needed:</span>
              <strong>
                {result.totalSeedLbs} lb for {area} {result.areaUnit}
                {area !== '1' && 's'}
              </strong>
              <span className="tooltip">ℹ️<span className="tooltip-text">Total pounds of seed for your entire field.</span></span>
            </div>
            {result.wasteBuffer && (
              <div className="result-item">
                <span>Included:</span>
                <strong>+5% safety buffer</strong>
              </div>
            )}
            {result.mode === 'advanced' && (
              <div className="result-note">
                <small>
                  * Calculation accounts for germination, purity, and field emergence.<br />
                  Formula: <strong>Seed lb/acre = Desired Plants / (Seeds/lb × Germ% × Purity% × Emergence%)</strong>
                </small>
              </div>
            )}
            {result.mode === 'basic' && (
              <div className="result-note">
                <small>
                  * Basic calculation assumes 100% establishment (no losses). For more accurate results, use Advanced mode.
                </small>
              </div>
            )}
          </div>
        )}

        <div className="glossary">
          <h3>Understanding the Terms</h3>
          <ul>
            <li><strong>lb</strong> – Pound (unit of weight). 1 lb = 0.454 kg.</li>
            <li><strong>kg/ha</strong> – Kilograms per hectare, the standard metric unit for seed rates.</li>
            <li><strong>Acre</strong> – 1 acre = 43,560 sq ft ≈ 0.405 hectares.</li>
            <li><strong>Hectare</strong> – 1 hectare = 10,000 m² ≈ 2.471 acres.</li>
            <li><strong>Seeds per Pound</strong> – Number of seeds in one pound.</li>
            <li><strong>Germination Rate</strong> – % seeds that sprout under ideal lab conditions.</li>
            <li><strong>Purity Rate</strong> – % pure crop seed in the lot (excluding weeds/inert matter).</li>
            <li><strong>Field Emergence Factor</strong> – % of germinated seeds that survive to become established plants.</li>
            <li><strong>Desired Plant Population</strong> – Target number of plants per unit area at harvest.</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default SeedCalculator;