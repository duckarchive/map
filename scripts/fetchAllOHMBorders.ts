import fs from 'fs';
import path from 'path';
import { Feature, FeatureCollection } from 'geojson';
import { fileURLToPath } from 'url';
import { expandBbox, overpass2geojson, OverpassResponse, UKRAINE_BBOX } from './helpers';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchBordersForYear(year: number, bbox: string): Promise<FeatureCollection> {
  // Using January 1st of the given year
  const date = `${year}-01-01`;

  const query = `
[out:json][timeout:60];
(
  relation(${bbox})["admin_level"="2"]
    (if: t["start_date"] <= "${date}" && (!is_tag("end_date") || t["end_date"] > "${date}"));
  way(r);
  node(w);
);
out geom;
`.trim();

  const res = await fetch(
    "https://overpass-api.openhistoricalmap.org/api/interpreter",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: new URLSearchParams({ data: query }).toString(),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch borders for year ${year}: ${res.statusText}`);
  }

  const json: OverpassResponse = await res.json();
  
  // Convert to GeoJSON
  const geojson = overpass2geojson(json);

  return geojson;
}

async function saveGeoJSON(year: number, geojson: FeatureCollection): Promise<void> {
  const outputDir = path.join(__dirname, '../public/assets/geojson/countries');
  const outputPath = path.join(outputDir, `${year}.geojson`);

  // Ensure directory exists
  fs.mkdirSync(outputDir, { recursive: true });

  // Save file
  fs.writeFileSync(outputPath, JSON.stringify(geojson, null, 2));
  console.log(`Saved borders for year ${year} to ${outputPath}`);
}

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const fromYear = parseInt(args[0]) || 1500;
  const toYear = parseInt(args[1]) || 1991;

  // Ukraine bounding box (minLat,minLon,maxLat,maxLon)
  const expandedBbox = expandBbox(UKRAINE_BBOX, 2).join(',');

  console.log(`Fetching historical borders from ${fromYear} to ${toYear} in bounding box: ${expandedBbox}`);

  for (let year = fromYear; year <= toYear; year++) {
    try {
      console.log(`Fetching borders for year ${year}...`);
      const borders = await fetchBordersForYear(year, expandedBbox);
      await saveGeoJSON(year, borders);
      
      // Add a small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error processing year ${year}:`, error instanceof Error ? error.message : error);
    }
  }

  console.log('Done!');
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
