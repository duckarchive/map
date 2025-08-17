import { feature } from 'topojson-client';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Get the input file from command line argument
const inputFile = process.argv[2];
if (!inputFile) {
  console.error('Please provide an input TopoJSON file path');
  process.exit(1);
}

try {
  // Read the TopoJSON file
  const topoData = JSON.parse(readFileSync(inputFile, 'utf8'));

  // Get the first object in the TopoJSON (usually there's only one)
  const layerName = Object.keys(topoData.objects)[0];
  if (!layerName) {
    throw new Error('No objects found in TopoJSON');
  }

  // Convert to GeoJSON
  const geoJson = feature(topoData, topoData.objects[layerName]);

  // Create output filename by replacing .topojson or .json with .geojson
  const outputFile = inputFile.replace(/\.(topojson|json)$/, '.geojson');

  // Write the GeoJSON file
  writeFileSync(outputFile, JSON.stringify(geoJson, null, 2));
  console.log(`Successfully converted ${inputFile} to ${outputFile}`);
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error('Error converting file:', error.message);
  } else {
    console.error('Error converting file:', error);
  }
  process.exit(1);
}
