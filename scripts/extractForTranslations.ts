import fs from 'fs';
import { FeatureCollection } from 'geojson';
import { uniq } from 'lodash';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

interface Properties {
  admin_level_1?: string;
  admin_level_2?: string;
  admin_level_3?: string;
  [key: string]: any;
}

function extractUniqueValues(geojsonData: FeatureCollection): string[] {
  const allValues: string[] = [];

  geojsonData.features.forEach(feature => {
    const props = feature.properties as Properties;
    if (props.admin_level_1) allValues.push(props.admin_level_1);
    if (props.admin_level_2) allValues.push(props.admin_level_2);
    if (props.admin_level_3) allValues.push(props.admin_level_3);
  });

  return uniq(allValues).filter(Boolean).sort((a, b) => a.localeCompare(b));
}

interface Translation {
  original: string;
  translated: string;
}

function saveToCSV(values: string[]): void {
  const csvPath = 'translations.csv';
  let existingValues = new Set<string>();
  
  if (fs.existsSync(csvPath)) {
    const content = fs.readFileSync(csvPath, 'utf8');
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true
    }) as Translation[];
    
    for (const record of records) {
      if (record.original) {
        existingValues.add(record.original);
      }
    }
  }

  const newValues = values.filter(v => !existingValues.has(v));
  
  if (newValues.length === 0) {
    console.log('No new values to add to translations.csv');
    return;
  }

  const newRecords = newValues.map(value => ({ original: value, translated: '' }));
  
  if (!fs.existsSync(csvPath)) {
    // Create new file with records
    const csvContent = stringify(newRecords, {
      header: true,
      columns: ['original', 'translated'],
      quoted: true
    });
    fs.writeFileSync(csvPath, csvContent);
  } else {
    // Append new records to existing file
    const csvContent = stringify(newRecords, {
      header: false,
      columns: ['original', 'translated']
    });
    fs.appendFileSync(csvPath, csvContent);
  }
}

function main(): void {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.error("Usage: tsx extractForTranslations.ts <geojson-file>");
    console.error("Example: tsx extractForTranslations.ts input.geojson");
    process.exit(1);
  }

  const inputFile = args[0];

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: File "${inputFile}" does not exist`);
    process.exit(1);
  }

  try {
    console.log(`Reading GeoJSON file: ${inputFile}`);
    const geojsonContent = fs.readFileSync(inputFile, 'utf8');
    const geojsonData: FeatureCollection = JSON.parse(geojsonContent);

    console.log(`Processing ${geojsonData.features?.length || 0} features...`);
    
    const uniqueValues = extractUniqueValues(geojsonData);
    console.log(`Found ${uniqueValues.length} unique values`);

    saveToCSV(uniqueValues);
    console.log(`Saved translations template to translations.csv`);
    console.log('Please fill in the "translated" column in translations.csv');

  } catch (error) {
    console.error(`Error processing file: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
