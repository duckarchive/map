import fs from "fs";
import proj4 from "proj4";
import { Feature, FeatureCollection, Geometry } from "@turf/helpers";

// Define projection systems
const stereo70 = '+proj=sterea +lat_0=46 +lon_0=25 +k=0.99975 +x_0=500000 +y_0=500000 +ellps=krass +units=m +no_defs';
const wgs84 = '+proj=longlat +datum=WGS84 +no_defs';

type Coordinates = number[] | number[][] | number[][][] | number[][][][];

// Function to recursively process coordinates and convert from Stereo70 to WGS84
function processCoordinates(coordinates: Coordinates): Coordinates {
  if (Array.isArray(coordinates)) {
    // Check if this is a coordinate pair [x, y]
    if (coordinates.length === 2 && typeof coordinates[0] === 'number' && typeof coordinates[1] === 'number') {
      // Convert from Stereo70 to WGS84
      const [lon, lat] = proj4(stereo70, wgs84, coordinates);
      return [lon, lat];
    } else {
      // Recursive case for nested arrays (MultiPolygon, etc.)
      return coordinates.map(coord => processCoordinates(coord));
    }
  }
  return coordinates;
}

// Function to process a single geometry
function processGeometry(geometry: Geometry): Geometry {
  if (!geometry || !geometry.coordinates) {
    return geometry;
  }

  return {
    ...geometry,
    coordinates: processCoordinates(geometry.coordinates)
  };
}

// Function to process GeoJSON features
function processGeoJSON(geojsonData: FeatureCollection): FeatureCollection {
  if (!geojsonData.features || !Array.isArray(geojsonData.features)) {
    throw new Error("Invalid GeoJSON: missing or invalid features array");
  }

  const processedFeatures = geojsonData.features.map(feature => {
    if (!feature.geometry) {
      return feature;
    }

    return {
      ...feature,
      geometry: processGeometry(feature.geometry)
    };
  });

  return {
    ...geojsonData,
    features: processedFeatures
  };
}

// Main function to process CLI arguments
function main(): void {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error("Usage: ts-node fix.ts <geojson-file>");
    console.error("Example: ts-node fix.ts input.geojson");
    console.error("");
    console.error("This script will convert coordinates from Stereo70 (EPSG:3844) to WGS84 (EPSG:4326) and save the result to the same file.");
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
    console.log(`Converting coordinates from Stereo70 (EPSG:3844) to WGS84 (EPSG:4326)`);
    
    // Show sample coordinate before processing
    if (geojsonData.features && geojsonData.features.length > 0 && geojsonData.features[0].geometry && geojsonData.features[0].geometry.coordinates) {
      const sampleCoords = geojsonData.features[0].geometry.coordinates;
      const originalCoord = Array.isArray(sampleCoords[0]) ? 
        (Array.isArray(sampleCoords[0][0]) ? sampleCoords[0][0][0] : sampleCoords[0][0]) 
        : sampleCoords[0];
      console.log(`Sample original coordinate (Stereo70):`, originalCoord);
    }
    
    const processedGeoJSON = processGeoJSON(geojsonData);
    
    // Show sample coordinate after processing
    if (processedGeoJSON.features && processedGeoJSON.features.length > 0 && processedGeoJSON.features[0].geometry && processedGeoJSON.features[0].geometry.coordinates) {
      const sampleCoords = processedGeoJSON.features[0].geometry.coordinates;
      const convertedCoord = Array.isArray(sampleCoords[0]) ? 
        (Array.isArray(sampleCoords[0][0]) ? sampleCoords[0][0][0] : sampleCoords[0][0]) 
        : sampleCoords[0];
      console.log(`Sample converted coordinate (WGS84):`, convertedCoord);
    }

    fs.writeFileSync(inputFile, JSON.stringify(processedGeoJSON));
    console.log(`Processed GeoJSON saved to: ${inputFile}`);
    
  } catch (error) {
    console.error(`Error processing file: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
}

// Run main function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
