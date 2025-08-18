#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Feature, FeatureCollection } from 'geojson';
import booleanOverlap from '@turf/boolean-overlap';
import booleanContains from '@turf/boolean-contains';
import booleanIntersects from '@turf/boolean-intersects';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface MyProperties {
  id?: string | number;
  admin_level_1?: string;
  admin_level_1_ID?: string | number;
  admin_level_2?: string;
  admin_level_3?: string;
  [key: string]: any;
}

interface MyFeature extends Feature<any, MyProperties> {}

interface MyFeatureCollection extends FeatureCollection<any, MyProperties> {}

/**
 * Check if a state feature overlaps with a country feature using turf helpers
 * Handles MultiPolygon geometries by checking individual polygons
 */
const isOverlapping = (state: Feature, country: Feature): boolean => {
  try {
    if (!state.geometry || !country.geometry) return false;
    
    // First try booleanOverlap and booleanIntersects which support MultiPolygons
    try {
      if (booleanOverlap(state, country) || booleanIntersects(state, country)) {
        return true;
      }
    } catch (overlapError) {
      // If overlap/intersects fail, continue to containment checks
    }
    
    // Handle booleanContains which doesn't support MultiPolygons
    try {
      // Try simple containment first
      if (booleanContains(country, state) || booleanContains(state, country)) {
        return true;
      }
    } catch (containsError) {
      // If contains fails due to MultiPolygon, handle it manually
      const errorMessage = containsError instanceof Error ? containsError.message : String(containsError);
      if (errorMessage.includes('MultiPolygon geometry not supported')) {
        return checkMultiPolygonContainment(state, country);
      }
    }
    
    return false;
  } catch (error) {
    console.warn(`Error checking overlap: ${error}`);
    return false;
  }
};

/**
 * Handle MultiPolygon containment by checking individual polygons
 * Mimics the fix from https://github.com/Turfjs/turf/pull/2357/files
 */
const checkMultiPolygonContainment = (state: Feature, country: Feature): boolean => {
  try {
    // If country is MultiPolygon and state is Polygon
    if (country.geometry?.type === 'MultiPolygon' && state.geometry?.type === 'Polygon') {
      // Check if any polygon in the MultiPolygon contains the state
      const multiPolygonCoords = country.geometry.coordinates;
      for (const polygonCoords of multiPolygonCoords) {
        const singlePolygon: Feature = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: polygonCoords
          }
        };
        if (booleanContains(singlePolygon, state)) {
          return true;
        }
      }
    }
    
    // If state is MultiPolygon and country is Polygon
    if (state.geometry?.type === 'MultiPolygon' && country.geometry?.type === 'Polygon') {
      // Check if the country contains all polygons of the MultiPolygon
      const multiPolygonCoords = state.geometry.coordinates;
      return multiPolygonCoords.every(polygonCoords => {
        const singlePolygon: Feature = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: polygonCoords
          }
        };
        return booleanContains(country, singlePolygon);
      });
    }
    
    // If both are MultiPolygons
    if (state.geometry?.type === 'MultiPolygon' && country.geometry?.type === 'MultiPolygon') {
      const stateCoords = state.geometry.coordinates;
      const countryCoords = country.geometry.coordinates;
      
      // Check if any country polygon contains any state polygon
      for (const statePolygonCoords of stateCoords) {
        const statePolygon: Feature = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: statePolygonCoords
          }
        };
        
        for (const countryPolygonCoords of countryCoords) {
          const countryPolygon: Feature = {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: countryPolygonCoords
            }
          };
          
          if (booleanContains(countryPolygon, statePolygon)) {
            return true;
          }
        }
      }
    }
    
    return false;
  } catch (error) {
    console.warn(`Error in MultiPolygon containment check: ${error}`);
    return false;
  }
};

/**
 * Extract year from filename (e.g., "1897.geojson" -> 1897)
 */
const extractYearFromFilename = (filename: string): number => {
  const match = filename.match(/(\d{4})/);
  return match ? parseInt(match[1], 10) : 0;
};

/**
 * Find the appropriate country file for a given state file year
 * Returns the highest country year that is <= state year
 */
const findCountryFileForStateYear = (stateYear: number, countryFiles: string[]): string | null => {
  const countryYears = countryFiles
    .map(file => ({ file, year: extractYearFromFilename(file) }))
    .filter(({ year }) => year > 0 && year <= stateYear)
    .sort((a, b) => b.year - a.year); // Sort descending to get highest year first
  
  return countryYears.length > 0 ? countryYears[0].file : null;
};

/**
 * Generate IDs script that processes GeoJSON files in countries and states folders
 * 
 * Usage: tsx scripts/generateIds.ts <countries-folder> <states-folder>
 * 
 * This script:
 * 1. Creates a map of incremental IDs for countries based on properties.admin_level_1 across all files
 * 2. Removes properties.id and adds/overrides id field at the same level as properties in each feature
 * 3. For state files:
 *    - Detects related country file by year (finds highest country year <= state year)
 *    - Checks geographic overlap between state features and country features
 *    - Adds properties.admin_level_1_ID = COUNTRY.id for matching overlaps
 */

function main() {
  const args = process.argv.slice(2);
  
  if (args.length !== 2) {
    console.error('Usage: tsx scripts/generateIds.ts <countries-folder> <states-folder>');
    console.error('Example: tsx scripts/generateIds.ts public/assets/geojson/countries public/assets/geojson');
    process.exit(1);
  }

  const [countriesFolder, statesFolder] = args;
  
  // Resolve paths relative to project root
  const projectRoot = path.resolve(__dirname, '..');
  const countriesFolderPath = path.resolve(projectRoot, countriesFolder);
  const statesFolderPath = path.resolve(projectRoot, statesFolder);

  console.log('Countries folder:', countriesFolderPath);
  console.log('States folder:', statesFolderPath);

  // Validate that folders exist
  if (!fs.existsSync(countriesFolderPath)) {
    console.error(`Countries folder does not exist: ${countriesFolderPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(statesFolderPath)) {
    console.error(`States folder does not exist: ${statesFolderPath}`);
    process.exit(1);
  }

  try {
    processGeoJSONFiles(countriesFolderPath, statesFolderPath);
    console.log('✅ Successfully processed all GeoJSON files');
  } catch (error) {
    console.error('❌ Error processing files:', error);
    process.exit(1);
  }
}

function processGeoJSONFiles(countriesFolder: string, statesFolder: string) {
  // Step 1: Collect all admin_level_1 values from countries files
  console.log('🔍 Scanning countries files for admin_level_1 values...');
  const adminLevel1Values = new Set<string>();
  
  const countryFiles = fs.readdirSync(countriesFolder)
    .filter(file => file.endsWith('.geojson'))
    .sort();

  for (const file of countryFiles) {
    const filePath = path.join(countriesFolder, file);
    console.log(`  📄 Processing ${file}...`);
    
    const content = fs.readFileSync(filePath, 'utf8');
    const geoJson: MyFeatureCollection = JSON.parse(content);
    
    for (const feature of geoJson.features) {
      if (feature.properties.admin_level_1) {
        adminLevel1Values.add(feature.properties.admin_level_1);
      }
    }
  }

  // Step 2: Create incremental ID mapping for admin_level_1 values
  console.log(`🗺️  Found ${adminLevel1Values.size} unique admin_level_1 values`);
  const adminLevel1ToId = new Map<string, number>();
  
  let currentId = 1;
  Array.from(adminLevel1Values).sort().forEach(value => {
    adminLevel1ToId.set(value, currentId++);
    console.log(`  ${value} -> ID: ${adminLevel1ToId.get(value)}`);
  });

  // Step 3: Process countries files - assign IDs and clean up
  console.log('🏗️  Processing countries files...');
  let processedCountries = 0;
  
  for (const file of countryFiles) {
    const filePath = path.join(countriesFolder, file);
    console.log(`  📝 Updating ${file}...`);
    
    const content = fs.readFileSync(filePath, 'utf8');
    const geoJson: MyFeatureCollection = JSON.parse(content);
    
    let featuresUpdated = 0;
    for (const feature of geoJson.features) {
      // Remove properties.id if it exists
      if ('id' in feature.properties) {
        delete feature.properties.id;
      }
      
      // Assign new ID based on admin_level_1
      if (feature.properties.admin_level_1) {
        const newId = adminLevel1ToId.get(feature.properties.admin_level_1);
        if (newId !== undefined) {
          feature.id = newId;
          featuresUpdated++;
        }
      }
    }
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(geoJson, null, 2));
    console.log(`    ✅ Updated ${featuresUpdated} features`);
    processedCountries++;
  }

  // Step 4: Process states files - detect country relationships and clean up properties.id
  console.log('🗺️  Processing states files...');
  const statesFiles = fs.readdirSync(statesFolder)
    .filter(file => file.endsWith('.geojson'))
    .sort();

  let processedStates = 0;
  
  for (const file of statesFiles) {
    const filePath = path.join(statesFolder, file);
    console.log(`  📝 Updating ${file}...`);
    
    // Extract year from state file and find corresponding country file
    const stateYear = extractYearFromFilename(file);
    const countryFile = findCountryFileForStateYear(stateYear, countryFiles);
    
    if (!countryFile) {
      console.log(`    ⚠️  No suitable country file found for state year ${stateYear}`);
    } else {
      console.log(`    🔗 Using country file: ${countryFile} (year ${extractYearFromFilename(countryFile)}) for state year ${stateYear}`);
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const geoJson: MyFeatureCollection = JSON.parse(content);
    
    // Load corresponding country data if available
    let countryData: MyFeatureCollection | null = null;
    if (countryFile) {
      const countryFilePath = path.join(countriesFolder, countryFile);
      const countryContent = fs.readFileSync(countryFilePath, 'utf8');
      countryData = JSON.parse(countryContent);
    }
    
    let featuresUpdated = 0;
    let relationshipsFound = 0;
    
    for (const feature of geoJson.features) {
      // Remove properties.id if it exists
      if ('id' in feature.properties) {
        delete feature.properties.id;
        featuresUpdated++;
      }
      
      // Try to find overlapping country for this state feature
      if (countryData) {
        const overlappingCountry = countryData.features.find(countryFeature => 
          isOverlapping(feature, countryFeature)
        );
        
        if (overlappingCountry && overlappingCountry.id) {
          feature.properties.admin_level_1_ID = overlappingCountry.id;
          relationshipsFound++;
          console.log(`      🎯 Found relationship: state -> country ID ${overlappingCountry.id} (${overlappingCountry.properties?.admin_level_1 || 'unknown'})`);
        }
      }
    }
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(geoJson, null, 2));
    console.log(`    ✅ Cleaned up ${featuresUpdated} features, found ${relationshipsFound} country relationships`);
    processedStates++;
  }

  console.log(`\n📊 Summary:`);
  console.log(`  • Countries files processed: ${processedCountries}`);
  console.log(`  • States files processed: ${processedStates}`);
  console.log(`  • Unique admin_level_1 values: ${adminLevel1Values.size}`);
  console.log(`  • Country ID range assigned: 1-${adminLevel1ToId.size}`);
  console.log(`  • State-country relationships established using geographic overlap detection`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
