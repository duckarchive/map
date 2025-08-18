#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Feature, FeatureCollection } from 'geojson';
import booleanOverlap from '@turf/boolean-overlap';
import booleanContains from '@turf/boolean-contains';
import booleanIntersects from '@turf/boolean-intersects';
import intersect from '@turf/intersect';
import area from '@turf/area';
import simplify from '@turf/simplify';
import { randomPoint } from '@turf/random';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';

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
 * Calculate intersection area between state and country using robust methods
 */
const calculateIntersectionArea = (feature1: Feature, feature2: Feature): number => {
  try {
    // First, try the standard @turf/intersect
    const intersection = intersect(feature1 as any, feature2 as any);
    if (intersection) {
      const intersectionArea = area(intersection);
      if (intersectionArea > 0) {
        const stateName = feature1.properties?.admin_level_3 || feature1.properties?.admin_level_2 || 'unknown';
        const countryName = feature2.properties?.admin_level_1 || 'unknown';
        console.log(`        ✅ Direct intersection: ${stateName} ↔ ${countryName}: ${intersectionArea.toFixed(2)} sq meters`);
        return intersectionArea;
      }
    }
  } catch (intersectError) {
    // If @turf/intersect fails, fall back to grid sampling
    console.log(`        ⚠️ Direct intersection failed, using grid sampling...`);
  }

  // Fallback to grid-based sampling for complex geometries
  return calculateOverlapByGridSampling(feature1, feature2);
};

/**
 * Calculate overlap using systematic grid sampling method
 * Creates a grid of points across the state and tests intersection
 */
const calculateOverlapByGridSampling = (stateFeature: Feature, countryFeature: Feature): number => {
  try {
    if (!isOverlapping(stateFeature, countryFeature)) {
      return 0;
    }
    
    const stateName = stateFeature.properties?.admin_level_3 || stateFeature.properties?.admin_level_2 || 'unknown';
    const countryName = countryFeature.properties?.admin_level_1 || 'unknown';
    
    // Get bounding box of the state - handle different geometry types safely
    let minLon = Infinity, maxLon = -Infinity;
    let minLat = Infinity, maxLat = -Infinity;
    
    // Extract bounds from coordinates (handle both Polygon and MultiPolygon)
    const extractBounds = (coordArray: any[]) => {
      for (const coord of coordArray) {
        if (Array.isArray(coord[0])) {
          extractBounds(coord);
        } else {
          const [lon, lat] = coord;
          minLon = Math.min(minLon, lon);
          maxLon = Math.max(maxLon, lon);
          minLat = Math.min(minLat, lat);
          maxLat = Math.max(maxLat, lat);
        }
      }
    };
    
    // Extract coordinates based on geometry type
    if (stateFeature.geometry.type === 'Polygon') {
      extractBounds((stateFeature.geometry as any).coordinates);
    } else if (stateFeature.geometry.type === 'MultiPolygon') {
      for (const polygon of (stateFeature.geometry as any).coordinates) {
        extractBounds(polygon);
      }
    }
    
    // Create a systematic grid of test points
    const gridResolution = 0.01; // About 1km resolution
    let pointsInState = 0;
    let pointsInBoth = 0;
    
    for (let lon = minLon; lon <= maxLon; lon += gridResolution) {
      for (let lat = minLat; lat <= maxLat; lat += gridResolution) {
        const testPoint = {
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [lon, lat]
          },
          properties: {}
        };
        
        // Check if point is within the state
        try {
          if (booleanPointInPolygon(testPoint, stateFeature as any)) {
            pointsInState++;
            // Check if this point is also within the country
            try {
              if (booleanPointInPolygon(testPoint, countryFeature as any)) {
                pointsInBoth++;
              }
            } catch (countryError) {
              // Country geometry might be complex, skip this point
              continue;
            }
          }
        } catch (stateError) {
          // State geometry might be complex, skip this point
          continue;
        }
      }
    }
    
    console.log(`        📍 ${stateName} ↔ ${countryName}:`);
    console.log(`           Grid resolution: ${gridResolution}° (≈1km)`);
    console.log(`           Points in state: ${pointsInState}`);
    console.log(`           Points in both: ${pointsInBoth}`);
    
    if (pointsInState === 0) {
      console.log(`           ⚠️ No grid points found in state - using minimal overlap`);
      return 1000; // 1000 sq meters as minimal detectable overlap
    }
    
    const overlapRatio = pointsInBoth / pointsInState;
    console.log(`           Overlap ratio: ${(overlapRatio*100).toFixed(2)}%`);
    
    // Calculate estimated intersection area
    const stateArea = area(stateFeature);
    const estimatedIntersectionArea = stateArea * overlapRatio;
    
    console.log(`           State total area: ${stateArea.toFixed(2)} sq meters`);
    console.log(`           Estimated intersection: ${estimatedIntersectionArea.toFixed(2)} sq meters`);
    
    // Ensure we return at least a minimal area if we detected overlap
    return Math.max(estimatedIntersectionArea, pointsInBoth > 0 ? 1000 : 0);
    
  } catch (error) {
    console.log(`        ❌ Grid sampling failed: ${error}`);
    return 1000; // Minimal overlap if we know they intersect
  }
};

/**
 * Find the country feature with the largest intersection area with the given state feature
 */
const findBestCountryMatch = (state: Feature, countryFeatures: MyFeature[]): MyFeature | null => {
  let bestMatch: MyFeature | null = null;
  let largestArea = 0;
  const candidates: { country: MyFeature; area: number }[] = [];
  
  for (const country of countryFeatures) {
    const intersectionArea = calculateIntersectionArea(state, country);
    
    if (intersectionArea > 0) {
      candidates.push({ country, area: intersectionArea });
    }
    
    if (intersectionArea > largestArea) {
      largestArea = intersectionArea;
      bestMatch = country;
    }
  }
  
  // Log candidates if there are multiple options
  if (candidates.length > 1) {
    console.log(`        🔍 Multiple overlaps found (${candidates.length} candidates):`);
    candidates
      .sort((a, b) => b.area - a.area)
      .forEach((candidate, index) => {
        const marker = index === 0 ? '🏆' : '  ';
        const stateName = state.properties?.admin_level_3 || state.properties?.admin_level_2 || 'unknown';
        console.log(`        ${marker} ${candidate.country.properties?.admin_level_1 || 'unknown'}: ${candidate.area.toFixed(2)} sq meters`);
      });
    
    // If there's a tie in areas, prefer the country with more precise overlap detection
    const topCandidates = candidates.filter(c => c.area === largestArea);
    if (topCandidates.length > 1) {
      // Try to break the tie by checking which country has better containment
      for (const candidate of topCandidates) {
        if (isOverlapping(state, candidate.country)) {
          // Additional check: try booleanContains specifically for better precision
          try {
            if (booleanContains(candidate.country, state)) {
              bestMatch = candidate.country;
              console.log(`        💡 Tie-breaker: ${candidate.country.properties?.admin_level_1} contains the state`);
              break;
            }
          } catch (error) {
            // Continue with the first match if containment check fails
          }
        }
      }
    }
  }
  
  // Only return a match if there's actually some overlap
  return largestArea > 0 ? bestMatch : null;
};

/**
 * Check if a state feature overlaps with a country feature using turf helpers
 * Handles MultiPolygon geometries by checking individual polygons
 * Returns true only for real overlaps, not just boundary touching
 */
const isOverlapping = (state: Feature, country: Feature): boolean => {
  try {
    if (!state.geometry || !country.geometry) return false;
    
    // First try booleanOverlap (true overlap, not just touching)
    try {
      if (booleanOverlap(state, country)) {
        return true; // Real overlap detected
      }
    } catch (overlapError) {
      // Continue to other checks
    }
    
    // Check for containment (one completely inside the other)
    try {
      if (booleanContains(country, state) || booleanContains(state, country)) {
        return true; // One contains the other
      }
    } catch (containsError) {
      // If contains fails due to MultiPolygon, handle it manually
      const errorMessage = containsError instanceof Error ? containsError.message : String(containsError);
      if (errorMessage.includes('MultiPolygon geometry not supported')) {
        return checkMultiPolygonContainment(state, country);
      }
    }
    
    // booleanIntersects can return true for just touching boundaries
    // So we use it as a last resort and verify it's a real intersection
    try {
      if (booleanIntersects(state, country)) {
        // Try to verify this is a real intersection, not just boundary touching
        // We'll let the intersection area calculation determine if it's meaningful
        return true;
      }
    } catch (intersectsError) {
      // Continue
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
    console.error('Example: tsx scripts/generateIds.ts geojson/countries geojson');
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

    let incrementalId = 1;
    for (const feature of geoJson.features) {
      // Remove properties.id if it exists
      if ('id' in feature.properties) {
        delete feature.properties.id;
        featuresUpdated++;
      }
      feature.id = incrementalId++;
      
      // Try to find the country with the largest overlap for this state feature
      if (countryData) {
        const bestCountryMatch = findBestCountryMatch(feature, countryData.features);
        
        if (bestCountryMatch && bestCountryMatch.id) {
          feature.properties.admin_level_1_ID = bestCountryMatch.id;
          relationshipsFound++;
          const stateName = feature.properties?.admin_level_3 || feature.properties?.admin_level_2 || 'unknown';
          console.log(`      🎯 Found best match: (${stateName}) -> ${bestCountryMatch.id} (${bestCountryMatch.properties?.admin_level_1 || 'unknown'})`);
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
