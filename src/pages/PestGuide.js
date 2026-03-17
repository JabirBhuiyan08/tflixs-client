import React, { useState } from 'react';
import SEOHead from '../components/layout/SEOHead';
import AdSlot from '../components/layout/AdSlot';
import './PestGuide.css';

const PESTS = [
  {
    id: 'bph',
    name: 'Brown Planthopper',     icon: '🦗', type: 'Pest',
    crops: ['Rice'],
    severity: 'High',
    symptoms: 'Circular yellowing patches in field called "hopperburn". Plants dry out rapidly from center.',
    cause: 'Nilaparvata lugens — sucks phloem sap from rice plants.',
    treatment: [
      'Drain water from field immediately',
      'Apply Imidacloprid 17.8% SL @ 125ml/acre',
      'Avoid excessive nitrogen application',
      'Use resistant varieties like IR64, BRRI dhan29'
    ],
    prevention: 'Avoid dense planting. Use balanced NPK — excess N attracts BPH.',
    image: '🌾'
  },
  {
    id: 'stem_borer',
    name: 'Stem Borer',            icon: '🐛', type: 'Pest',
    crops: ['Rice', 'Maize', 'Sugarcane'],
    severity: 'High',
    symptoms: 'Dead heart in vegetative stage. White ears at heading. Hollow stems with frass.',
    cause: 'Scirpophaga incertulas larvae bore into stems.',
    treatment: [
      'Apply Chlorpyrifos 20 EC @ 2ml/L water',
      'Carbofuran 3G granules in whorl @ 15 kg/acre',
      'Release Trichogramma egg parasitoids',
      'Pull out and destroy affected tillers'
    ],
    prevention: 'Destroy stubble after harvest. Avoid ratoon crops if infestation was severe.',
    image: '🌾'
  },
  {
    id: 'aphids',
    name: 'Aphids',                icon: '🐜', type: 'Pest',
    crops: ['Mustard', 'Wheat', 'Vegetables', 'Cotton'],
    severity: 'Medium',
    symptoms: 'Curled, yellowing leaves. Sticky honeydew on leaves. Black sooty mold on honeydew.',
    cause: 'Lipaphis erysimi and other Aphid species suck plant sap.',
    treatment: [
      'Spray Dimethoate 30 EC @ 1.5ml/L',
      'Imidacloprid 17.8 SL @ 0.5ml/L',
      'Neem oil 5ml/L as organic option',
      'Yellow sticky traps for monitoring'
    ],
    prevention: 'Avoid excessive N fertilizer. Conserve natural enemies (ladybirds, lacewings).',
    image: '🌼'
  },
  {
    id: 'late_blight',
    name: 'Late Blight',           icon: '🍄', type: 'Disease',
    crops: ['Potato', 'Tomato'],
    severity: 'High',
    symptoms: 'Water-soaked lesions on leaves turning brown/black. White mold on underside in humid conditions.',
    cause: 'Phytophthora infestans — fungal-like pathogen. Spreads in cool, wet conditions.',
    treatment: [
      'Mancozeb 75 WP @ 2.5g/L at first sign',
      'Metalaxyl + Mancozeb @ 2.5g/L',
      'Spray every 7 days during outbreak',
      'Remove and destroy infected plants'
    ],
    prevention: 'Use certified disease-free seed. Avoid overhead irrigation. Crop rotation.',
    image: '🥔'
  },
  {
    id: 'blast',
    name: 'Rice Blast',            icon: '💨', type: 'Disease',
    crops: ['Rice'],
    severity: 'High',
    symptoms: 'Diamond-shaped gray lesions on leaves with brown borders. Neck rot causing white ears.',
    cause: 'Magnaporthe oryzae fungus. Spreads via wind. Favoured by high humidity and N excess.',
    treatment: [
      'Tricyclazole 75 WP @ 0.6g/L at boot stage',
      'Isoprothiolane 40 EC @ 1.5ml/L',
      'Spray twice at 10 day intervals',
      'Drain field temporarily'
    ],
    prevention: 'Avoid excessive nitrogen. Use resistant varieties. Do not over-irrigate.',
    image: '🌾'
  },
  {
    id: 'whitefly',
    name: 'Whitefly',              icon: '🦋', type: 'Pest',
    crops: ['Tomato', 'Chilli', 'Cotton', 'Vegetables'],
    severity: 'Medium',
    symptoms: 'Yellow stippling on leaves. Honeydew and sooty mold. Virus transmission — leaf curl.',
    cause: 'Bemisia tabaci. Also transmits Tomato Yellow Leaf Curl Virus (TYLCV).',
    treatment: [
      'Imidacloprid 17.8 SL @ 0.5ml/L',
      'Thiamethoxam 25 WG @ 0.2g/L',
      'Neem oil 5ml/L every 5 days',
      'Yellow sticky traps @ 20/acre'
    ],
    prevention: 'Use reflective mulch to repel. Avoid planting near infested crops. Remove weeds.',
    image: '🍅'
  },
  {
    id: 'fusarium',
    name: 'Fusarium Wilt',         icon: '🌿', type: 'Disease',
    crops: ['Tomato', 'Chilli', 'Banana', 'Cotton'],
    severity: 'High',
    symptoms: 'One-sided wilting of plant. Yellow leaves starting from bottom. Brown vascular tissue inside stem.',
    cause: 'Fusarium oxysporum soil-borne fungus. Spreads through infected soil and water.',
    treatment: [
      'No effective cure once infected — remove plants',
      'Soil drench with Carbendazim 50 WP @ 2g/L',
      'Trichoderma viride bio-agent @ 5g/kg soil',
      'Avoid waterlogging'
    ],
    prevention: 'Crop rotation (3–4 years). Use grafted seedlings. Raised bed cultivation.',
    image: '🍅'
  },
  {
    id: 'thrips',
    name: 'Thrips',                icon: '🦠', type: 'Pest',
    crops: ['Onion', 'Chilli', 'Cotton', 'Rice'],
    severity: 'Medium',
    symptoms: 'Silver streaks on leaves. Leaf tip curling. Distorted growth. Onion leaves turn silvery-white.',
    cause: 'Thrips tabaci and Frankliniella schultzei — tiny insects rasping leaf surfaces.',
    treatment: [
      'Spinosad 45 SC @ 0.3ml/L',
      'Fipronil 5 SC @ 1.5ml/L',
      'Dimethoate 30 EC @ 2ml/L',
      'Blue sticky traps for monitoring'
    ],
    prevention: 'Reflective mulch. Remove crop debris. Avoid excess nitrogen fertilizer.',
    image: '🧅'
  },
  {
    id: 'nutrient_n',
    name: 'Nitrogen Deficiency',   icon: '🍃', type: 'Deficiency',
    crops: ['All Crops'],
    severity: 'Medium',
    symptoms: 'Yellowing starts from older/lower leaves and moves upward. Stunted growth. Pale green color overall.',
    cause: 'Insufficient nitrogen in soil. Poor uptake due to waterlogging or soil compaction.',
    treatment: [
      'Apply Urea @ 20–25 kg/acre as top dressing',
      'Foliar spray of Urea 2% solution',
      'Apply Ammonium Sulphate for quick release',
      'Improve drainage if waterlogged'
    ],
    prevention: 'Follow recommended NPK schedule. Split N application in 3 doses.',
    image: '🌱'
  },
  {
    id: 'nutrient_fe',
    name: 'Iron Deficiency',       icon: '🌱', type: 'Deficiency',
    crops: ['Rice', 'Wheat', 'Vegetables'],
    severity: 'Medium',
    symptoms: 'Interveinal chlorosis on young/upper leaves first. Leaves yellow between green veins.',
    cause: 'Alkaline soils (high pH). Waterlogged conditions. Excess phosphorus or zinc.',
    treatment: [
      'Foliar spray of FeSO4 (Ferrous Sulphate) 0.5%',
      'Soil application of FeSO4 @ 25 kg/ha',
      'Acidify soil with elemental sulfur',
      'Apply chelated iron (Fe-EDTA) for faster response'
    ],
    prevention: 'Maintain soil pH 6–6.5. Avoid excessive P application. Use organic matter.',
    image: '🌾'
  },
];

const TYPES    = ['All', 'Pest', 'Disease', 'Deficiency'];
const SEVERITY = { High: 'badge-red', Medium: 'badge-amber', Low: 'badge-green' };

const PestGuide = () => {
  const [type, setType]       = useState('All');
  const [search, setSearch]   = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = PESTS.filter(p =>
    (type === 'All' || p.type === type) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.crops.some(c => c.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div>
      <SEOHead
        page="pest-guide"
        title="Pest & Disease Guide – Identify and Treat Crop Problems | Tflixs"
        description="Identify and treat common crop pests, diseases and nutrient deficiencies. Free guide for rice, wheat, vegetables and more."
      />

      <section className="page-hero">
        <div className="container">
          <h1>💊 Pest & Disease Guide</h1>
          <p>Identify problems and get treatment recommendations</p>
        </div>
      </section>

      <div className="container section-sm">
        <AdSlot slot="header" style={{ marginBottom: 24 }} />

        <div className="pest-controls">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search by pest name or crop..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 300 }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            {TYPES.map(t => (
              <button key={t} className={`btn btn-sm ${type === t ? 'btn-primary' : 'btn-outline'}`} onClick={() => setType(t)}>
                {t === 'All' ? '🔍 All' : t === 'Pest' ? '🦗 Pests' : t === 'Disease' ? '🍄 Diseases' : '🌿 Deficiencies'}
              </button>
            ))}
          </div>
        </div>

        <div className="pest-grid">
          {filtered.map(pest => (
            <div
              key={pest.id}
              className={`pest-card card ${selected?.id === pest.id ? 'pest-card--active' : ''}`}
              onClick={() => setSelected(selected?.id === pest.id ? null : pest)}
            >
              <div className="card-body">
                <div className="pest-card__header">
                  <span className="pest-card__icon">{pest.icon}</span>
                  <div>
                    <h3>{pest.name}</h3>
                    <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                      <span className={`badge ${SEVERITY[pest.severity]}`}>{pest.severity} Risk</span>
                      <span className="badge badge-blue">{pest.type}</span>
                    </div>
                  </div>
                </div>
                <div className="pest-card__crops">
                  {pest.crops.map(c => <span key={c} className="pest-crop-tag">{c}</span>)}
                </div>
                <p className="pest-card__symptoms">{pest.symptoms.slice(0, 90)}...</p>
                <button className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                  {selected?.id === pest.id ? '▲ Hide Details' : '▼ View Treatment'}
                </button>
              </div>

              {/* Expanded Detail */}
              {selected?.id === pest.id && (
                <div className="pest-detail">
                  <div className="pest-detail__section">
                    <h4>🔍 Symptoms</h4>
                    <p>{pest.symptoms}</p>
                  </div>
                  <div className="pest-detail__section">
                    <h4>🦠 Cause</h4>
                    <p>{pest.cause}</p>
                  </div>
                  <div className="pest-detail__section">
                    <h4>💊 Treatment</h4>
                    <ul>{pest.treatment.map((t, i) => <li key={i}>{t}</li>)}</ul>
                  </div>
                  <div className="pest-detail__section">
                    <h4>🛡️ Prevention</h4>
                    <p>{pest.prevention}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.1rem' }}>No results found for "{search}"</p>
          </div>
        )}

        <AdSlot slot="belowCalculator" style={{ marginTop: 32 }} />
      </div>
    </div>
  );
};

export default PestGuide;
