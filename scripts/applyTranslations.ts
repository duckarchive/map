import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { Feature, FeatureCollection } from 'geojson';

interface Translation {
  original: string;
  translated: string;
}

interface Properties {
  admin_level_1?: string;
  admin_level_2?: string;
  admin_level_3?: string;
  [key: string]: any;
}

function loadTranslations(csvPath: string): Map<string, string> {
  const fileContent = fs.readFileSync(csvPath, 'utf8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  }) as Translation[];

  const translationMap = new Map<string, string>();
  for (const record of records) {
    if (record.original && record.translated) {
      translationMap.set(record.original, record.translated);
    }
  }

  return translationMap;
}

function applyTranslationsToFeature(feature: Feature, translations: Map<string, string>): Feature {
  const props = feature.properties as Properties;
  const newProps: Properties = { ...props };

  ['admin_level_1', 'admin_level_2', 'admin_level_3'].forEach(level => {
    const value = props[level];
    if (value && translations.has(value)) {
      newProps[level] = translations.get(value);
    }
  });

  return {
    ...feature,
    properties: newProps
  };
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error("Usage: tsx applyTranslations.ts <input-geojson>");
    console.error("Example: tsx applyTranslations.ts input.geojson");
    process.exit(1);
  }

  const [inputFile] = args;
  const translationsFile = 'translations.csv';

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file "${inputFile}" does not exist`);
    process.exit(1);
  }

  if (!fs.existsSync(translationsFile)) {
    console.error(`Error: Translations file "translations.csv" does not exist`);
    process.exit(1);
  }

  try {
    console.log('Loading translations...');
    const translations = loadTranslations(translationsFile);
    console.log(`Loaded ${translations.size} translations`);

    console.log(`Reading GeoJSON file: ${inputFile}`);
    const geojsonContent = fs.readFileSync(inputFile, 'utf8');
    const geojsonData: FeatureCollection = JSON.parse(geojsonContent);

    console.log(`Processing ${geojsonData.features?.length || 0} features...`);
    const translatedFeatures = geojsonData.features.map(feature => 
      applyTranslationsToFeature(feature, translations)
    );

    const outputData: FeatureCollection = {
      ...geojsonData,
      features: translatedFeatures
    };

    fs.writeFileSync(inputFile, JSON.stringify(outputData, null, 2));
    console.log(`Saved translated GeoJSON to ${inputFile}`);

  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
