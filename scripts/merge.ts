import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { Feature, FeatureCollection } from "@turf/helpers";

// Helper to read JSON file
function readJSON(filePath: string): FeatureCollection {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Helper to write JSON file
function writeJSON(filePath: string, data: FeatureCollection): void {
  fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
}

interface TranslationRow {
  Distr_ID: string;
  Gub_ID: string;
  state_uk: string;
  district_uk: string;
  [key: string]: string;
}

// Helper to read CSV file
function readCSV(filePath: string): TranslationRow[] {
  const content = fs.readFileSync(filePath, 'utf8');
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
}

// Main logic
function main(): void {
  if (process.argv.length < 4) {
    console.error('Usage: ts-node merge.ts <geojson_file> <translations_csv>');
    process.exit(1);
  }

  const geojsonPath = process.argv[2];
  const csvPath = process.argv[3];

  const geojson = readJSON(geojsonPath);
  const translations = readCSV(csvPath);

  // Build translation map: key = Distr_ID + Gub_ID
  const translationMap = new Map<string, TranslationRow>();
  for (const row of translations) {
    const key = `${row.Distr_ID}${row.Gub_ID}`;
    translationMap.set(key, row);
  }

  // Extend GeoJSON features
  for (const feature of geojson.features) {
    const props = feature.properties || {};
    const key = `${props.Distr_ID}${props.Gub_ID}`;
    const translation = translationMap.get(key);
    
    if (translation) {
      // Merge translation fields into properties with filtering and renaming
      if (translation.state_uk) props.state = translation.state_uk;
      if (translation.district_uk) props.district = translation.district_uk;
    }
    
    // Remove unwanted properties from original data
    delete props.Distr_ID;
    delete props.Gub_ID;
    delete props.RISTAT_ID;
    delete props.order;
    delete props.Name_RU;
    delete props.Name_ENG;
    delete props.prov_RU;
    delete props.prov_ENG;
    
    feature.properties = props;
  }

  // Sort features alphabetically by district for consistent ID assignment
  geojson.features.sort((a, b) => {
    const aName = (a.properties?.district as string) || '';
    const bName = (b.properties?.district as string) || '';
    return aName.localeCompare(bName, 'uk');
  });

  // Create unique state values and assign state_id
  const uniqueStates = [...new Set(geojson.features.map(f => f.properties?.state as string).filter(Boolean))];
  uniqueStates.sort((a, b) => a.localeCompare(b, 'uk'));
  
  const stateIdMap = new Map<string, number>();
  uniqueStates.forEach((state, index) => {
    stateIdMap.set(state, index + 1);
  });

  // Assign incremental IDs and state_id
  geojson.features.forEach((feature, index) => {
    if (feature.properties) {
      feature.properties.id = index + 1;
      if (feature.properties.state) {
        feature.properties.state_id = stateIdMap.get(feature.properties.state);
      }
    }
  });

  // Write updated GeoJSON back to file
  writeJSON(geojsonPath, geojson);
  
  // Log summary
  console.log(`Updated ${geojson.features.length} features`);
  console.log(`Found ${uniqueStates.length} unique states`);
  if (geojson.features[0]?.properties) {
    console.log('Sample feature:', geojson.features[0].properties);
  }
}

if (process.argv[1] === import.meta.url) {
  main();
}
