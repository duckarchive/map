const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

// Helper to read JSON file
function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Helper to write JSON file
function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
}

// Helper to read CSV file
function readCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return csv.parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
}

// Main logic
function main() {
  if (process.argv.length < 4) {
    console.error('Usage: node merge.cjs <geojson_file> <translations_csv>');
    process.exit(1);
  }

  const geojsonPath = process.argv[2];
  const csvPath = process.argv[3];

  const geojson = readJSON(geojsonPath);
  const translations = readCSV(csvPath);

  // Build translation map: key = Distr_ID + Gub_ID
  const translationMap = {};
  for (const row of translations) {
    const key = `${row.Distr_ID}${row.Gub_ID}`;
    translationMap[key] = row;
  }

  // Extend GeoJSON features
  for (const feature of geojson.features) {
    const props = feature.properties || {};
    const key = `${props.Distr_ID}${props.Gub_ID}`;
    if (translationMap[key]) {
      // Merge translation fields into properties with filtering and renaming
      const translation = translationMap[key];
      
      // Add translated fields with renamed properties
      // if (translation.Name_RU) props.district_ru = translation.Name_RU;
      // if (translation.Name_ENG) props.district_en = translation.Name_ENG;
      // if (translation.prov_RU) props.state_ru = translation.prov_RU;
      // if (translation.prov_ENG) props.state_en = translation.prov_ENG;
      if (translation.prov_RU) props.state = translation.state_uk;
      if (translation.prov_ENG) props.district = translation.district_uk;
      
      // Add other translation fields (excluding the ones we don't want and the renamed ones)
      // for (const [k, v] of Object.entries(translation)) {
      //   if (!['Distr_ID', 'Gub_ID', 'RISTAT_ID', 'order', 'Name_RU', 'Name_ENG', 'prov_RU', 'prov_ENG'].includes(k)) {
      //     props[k] = v;
      //   }
      // }
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
    const aName = a.properties.district || '';
    const bName = b.properties.district || '';
    return aName.localeCompare(bName, 'uk');
  });

  // Create unique state values and assign state_id
  const uniqueStates = [...new Set(geojson.features.map(f => f.properties.state).filter(Boolean))];
  uniqueStates.sort((a, b) => a.localeCompare(b, 'uk'));
  
  const stateIdMap = {};
  uniqueStates.forEach((state, index) => {
    stateIdMap[state] = index + 1;
  });

  // Assign incremental IDs and state_id
  geojson.features.forEach((feature, index) => {
    feature.properties.id = index + 1;
    if (feature.properties.state && stateIdMap[feature.properties.state]) {
      feature.properties.state_id = stateIdMap[feature.properties.state];
    }
  });

  // Save to NAME_translated.geojson
  const { dir, name } = path.parse(geojsonPath);
  const outPath = path.join(dir, `${name}_translated.geojson`);
  writeJSON(outPath, geojson);

  console.log(`Extended GeoJSON saved to ${outPath}`);
  console.log(`Total districts: ${geojson.features.length}`);
  console.log(`Total unique states: ${uniqueStates.length}`);
}

main();