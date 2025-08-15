const fs = require('fs');
const path = require('path');

// Check arguments
if (process.argv.length !== 4) {
  console.error('Usage: node cleanup.cjs <path-to-geojson> <path-to-txt>');
  process.exit(1);
}

const geojsonPath = process.argv[2];
const txtPath = process.argv[3];

// Read districts to filter
const idsToFilter = fs.readFileSync(txtPath, 'utf8')
  .split('\n')
  .map(line => +line.trim())
  .filter(Boolean);

// Read GeoJSON
const geojson = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));

// Filter features
if (!Array.isArray(geojson.features)) {
  console.error('Invalid GeoJSON: missing features array');
  process.exit(1);
}

geojson.features = geojson.features.filter(
  feature => !idsToFilter.includes(feature.properties.id)
);

// Write back to original file
fs.writeFileSync(geojsonPath, JSON.stringify(geojson), 'utf8');
console.log(`Filtered GeoJSON saved to ${geojsonPath}`);