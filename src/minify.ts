import fs from 'fs';
import { FeatureCollection } from 'geojson';

function main(): void {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.error("Usage: tsx minify.ts <geojson-file>");
    console.error("Example: tsx minify.ts input.geojson");
    process.exit(1);
  }

  const filePath = args[0];

  if (!fs.existsSync(filePath)) {
    console.error(`Error: File "${filePath}" does not exist`);
    process.exit(1);
  }

  try {
    console.log(`Reading GeoJSON file: ${filePath}`);
    const geojsonContent = fs.readFileSync(filePath, 'utf8');
    const geojsonData: FeatureCollection = JSON.parse(geojsonContent);

    console.log(`Processing ${geojsonData.features?.length || 0} features...`);
    
    // Save minified JSON back to the same file
    fs.writeFileSync(filePath, JSON.stringify(geojsonData));
    
    console.log(`Saved minified GeoJSON to ${filePath}`);

  } catch (error) {
    console.error(`Error processing file: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
