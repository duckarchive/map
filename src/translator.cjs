const fs = require('fs');
const path = require('path');

// Get input file from CLI arguments
const [,, inputFile] = process.argv;

if (!inputFile) {
  console.error('Usage: node translator.cjs <input.geojson>');
  process.exit(1);
}

// Read and parse GeoJSON
const geojson = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

// Prepare light data (remove geometry)
let features = geojson.features || [];
const lightData = features.map(f => {
  const { geometry, ...rest } = f;
  return rest;
});

// Write minimized JSON
const outJson = path.basename(inputFile, path.extname(inputFile)) + '_light.json';
fs.writeFileSync(outJson, JSON.stringify(lightData));

// Prepare CSV
if (lightData.length > 0) {
  const headers = Object.keys(lightData[0].properties || {});
  const csvRows = [
    headers.join(','),
    ...lightData.map(f => headers.map(h => JSON.stringify(f.properties?.[h] ?? '')).join(','))
  ];
  const outCsv = path.basename(inputFile, path.extname(inputFile)) + '_light.csv';
  fs.writeFileSync(outCsv, csvRows.join('\n'));
} else {
  console.warn('No features found in GeoJSON.');
}