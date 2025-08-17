import bboxPolygon from "@turf/bbox-polygon";
import booleanIntersects from "@turf/boolean-intersects";
import fs from "fs";
import path from "path";

const UKRAINE_BBOX = [22.1372, 44.3865, 40.2276, 52.3791]; // [minLon, minLat, maxLon, maxLat]

// Expand bbox by 20%
function expandBbox(bbox, percent) {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  const lonDelta = ((maxLon - minLon) * percent) / 2;
  const latDelta = ((maxLat - minLat) * percent) / 2;

  return [
    minLon - lonDelta,
    minLat - latDelta,
    maxLon + lonDelta,
    maxLat + latDelta,
  ];
}

const expandedBbox = expandBbox(UKRAINE_BBOX, 0.2);
const ukrainePoly = bboxPolygon(expandedBbox);

// Function to filter GeoJSON features within Ukraine polygon
function filterFeaturesInUkraine(geojsonData) {
  if (!geojsonData.features || !Array.isArray(geojsonData.features)) {
    throw new Error("Invalid GeoJSON: missing or invalid features array");
  }

  const filteredFeatures = geojsonData.features.filter(feature => {
    if (!feature.geometry) {
      return false;
    }
    
    try {
      return booleanIntersects(feature, ukrainePoly);
    } catch (error) {
      console.warn(`Skipping feature due to geometry error:`, error.message);
      return false;
    }
  });

  return {
    ...geojsonData,
    features: filteredFeatures
  };
}

// Main function to process CLI arguments
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error("Usage: node filter.mjs <geojson-file>");
    console.error("Example: node filter.mjs input.geojson");
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
    const geojsonData = JSON.parse(geojsonContent);
    
    console.log(`Original features count: ${geojsonData.features?.length || 0}`);
    
    const filteredGeoJSON = filterFeaturesInUkraine(geojsonData);
    
    console.log(`Filtered features count: ${filteredGeoJSON.features.length}`);
    
    // Generate output filename
    const inputPath = path.parse(inputFile);
    const outputFile = path.join(inputPath.dir, `${inputPath.name}_ukraine_filtered${inputPath.ext}`);
    
    // Write filtered GeoJSON to output file
    fs.writeFileSync(outputFile, JSON.stringify(filteredGeoJSON));
    
    console.log(`Filtered GeoJSON saved to: ${outputFile}`);
    
  } catch (error) {
    console.error(`Error processing file: ${error.message}`);
    process.exit(1);
  }
}

// Run main function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

