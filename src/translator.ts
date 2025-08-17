import fs from "fs";
import path from "path";
import { FeatureCollection } from "@turf/helpers";

interface LightFeature {
  type: string;
  properties: Record<string, any>;
}

// Function to process a GeoJSON file
function processGeoJSON(inputFile: string): void {
  if (!fs.existsSync(inputFile)) {
    console.error(`Error: File "${inputFile}" does not exist`);
    process.exit(1);
  }

  try {
    // Read and parse GeoJSON
    const geojson: FeatureCollection = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

    // Prepare light data (remove geometry)
    const features = geojson.features || [];
    const lightData: LightFeature[] = features.map(f => {
      const { geometry, ...rest } = f;
      return rest;
    });

    // Write minimized JSON
    const outJson = path.basename(inputFile, path.extname(inputFile)) + '_light.json';
    fs.writeFileSync(outJson, JSON.stringify(lightData));

    // Prepare CSV
    if (lightData.length > 0 && lightData[0].properties) {
      const headers = Object.keys(lightData[0].properties);
      const csvRows = [
        headers.join(','),
        ...lightData.map(f => headers.map(h => JSON.stringify(f.properties?.[h] ?? '')).join(','))
      ];
      const outCsv = path.basename(inputFile, path.extname(inputFile)) + '_light.csv';
      fs.writeFileSync(outCsv, csvRows.join('\n'));
      
      console.log(`Processed ${lightData.length} features`);
      console.log(`Output files created:`);
      console.log(`- JSON: ${outJson}`);
      console.log(`- CSV: ${outCsv}`);
    } else {
      console.warn('No features found in GeoJSON.');
    }
  } catch (error) {
    console.error(`Error processing file: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
}

// Main entry point
function main(): void {
  const args = process.argv.slice(2);
  
  if (!args[0]) {
    console.error('Usage: ts-node translator.ts <input.geojson>');
    process.exit(1);
  }

  processGeoJSON(args[0]);
}

// Run main function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
