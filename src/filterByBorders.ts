import bboxPolygon from "@turf/bbox-polygon";
import booleanIntersects from "@turf/boolean-intersects";
import buffer from "@turf/buffer";
import union from "@turf/union";
import fs from "fs";
import { BBox } from "geojson";
import path from "path";

const UKRAINE_BBOX: GeoJSON.BBox = [22.1372, 44.3865, 40.2276, 52.3791];

// Load and process Ukraine GeoJSON with 20% buffer
function loadUkrainePolygonWithBuffer(): GeoJSON.Feature {
  try {
    const ukraineGeoJSON: GeoJSON.FeatureCollection = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/ukraine.geojson'), 'utf8'));

    // Calculate buffer distance (20% expansion)
    // For rough estimation, use ~50km buffer which is approximately 20% expansion for Ukraine
    const bufferDistance = 50; // kilometers

    let bufferedUkraine: GeoJSON.Feature;
    
    if (ukraineGeoJSON.features.length === 1) {
      // Single feature
      const feature = ukraineGeoJSON.features[0];
      if (!feature) {
        throw new Error("Ukraine GeoJSON does not contain any features.");
      }
      bufferedUkraine = buffer(feature, bufferDistance, { units: 'kilometers' }) as GeoJSON.Feature;
    } else {
      // Multiple features - union them first, then buffer
      let combinedUkraine = ukraineGeoJSON.features[0];
      for (let i = 1; i < ukraineGeoJSON.features.length; i++) {
        combinedUkraine = union(combinedUkraine as any, ukraineGeoJSON.features[i]) as GeoJSON.Feature;
      }
      bufferedUkraine = buffer(combinedUkraine, bufferDistance, { units: 'kilometers' }) as GeoJSON.Feature;
    }
    
    return bufferedUkraine;
  } catch (error) {
    console.error(`Error loading ukraine.geojson: ${error instanceof Error ? error.message : error}`);
    console.error('Falling back to bounding box method...');
    
    // Fallback to original bbox method
    const expandedBbox = expandBbox(UKRAINE_BBOX, 0.2);
    return bboxPolygon(expandedBbox);
  }
}

// Expand bbox by 20%
function expandBbox(bbox: BBox, percent: number): BBox {
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

// Load the Ukraine polygon with buffer
const ukrainePoly = loadUkrainePolygonWithBuffer();

// Function to filter GeoJSON features within Ukraine polygon
function filterFeaturesInUkraine(geojsonData: GeoJSON.FeatureCollection): GeoJSON.FeatureCollection {
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
      console.warn(`Skipping feature due to geometry error:`, error instanceof Error ? error.message : error);
      return false;
    }
  });

  return {
    ...geojsonData,
    features: filteredFeatures
  };
}

// Main function to process CLI arguments
function main(): void {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error("Usage: ts-node filter.ts <geojson-file>");
    console.error("Example: ts-node filter.ts input.geojson");
    process.exit(1);
  }

  const inputFile = args[0];
  
  if (!fs.existsSync(inputFile)) {
    console.error(`Error: File "${inputFile}" does not exist`);
    process.exit(1);
  }

  try {
    const geojsonContent = fs.readFileSync(inputFile, 'utf8');
    const geojsonData = JSON.parse(geojsonContent);
    
    console.log(`Original features count: ${geojsonData.features?.length || 0}`);
    
    const filteredGeoJSON = filterFeaturesInUkraine(geojsonData);
    
    console.log(`Filtered features count: ${filteredGeoJSON.features.length}`);
    
    fs.writeFileSync(inputFile, JSON.stringify(filteredGeoJSON));
    console.log(`Filtered GeoJSON saved to: ${inputFile}`);
    
  } catch (error) {
    console.error(`Error processing file: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
