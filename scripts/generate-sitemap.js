// scripts/generate-sitemap.js
const fs = require('fs');
const path = require('path');
const https = require('https');

const SITEMAP_URL = 'https://tflixs.vercel.app/sitemap.xml';
const OUTPUT_PATH = path.join(__dirname, '../build/sitemap.xml');

https.get(SITEMAP_URL, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync(OUTPUT_PATH, data);
    console.log('✅ Sitemap generated at build/sitemap.xml');
  });
}).on('error', (err) => {
  console.error('❌ Failed to fetch sitemap:', err.message);
  process.exit(1);
});