import fetch from 'node-fetch';
import fs from 'fs';

// Configuration
const SERVICE_URL = "https://services8.arcgis.com/UN2BoTelitQIJWcd/ArcGIS/rest/services/Austro_Hungarian_Empire_1910_v_1_0/FeatureServer/53";
const OUTPUT_FILE = "austro_hungarian_empire_1910_filtered.geojson";

// Define Ukraine's bounding box (minX, minY, maxX, maxY)
const UKRAINE_BBOX = [22.085, 44.361, 40.081, 52.335];

// Calculate extended bbox (+20%)
const extendBbox = (bbox, percentage) => {
  const [minX, minY, maxX, maxY] = bbox;
  const width = maxX - minX;
  const height = maxY - minY;
  const extendX = width * percentage;
  const extendY = height * percentage;
  
  return [
    minX - extendX,
    minY - extendY,
    maxX + extendX,
    maxY + extendY
  ];
};

const getMetadata = async () => {
  const response = await fetch(`${SERVICE_URL}?f=json`);
  return response.json();
};

const getFeatureCount = async (geometry) => {
  const params = new URLSearchParams({
    where: "1=1",
    returnCountOnly: "true",
    // geometry: JSON.stringify({ xmin: geometry[0], ymin: geometry[1], xmax: geometry[2], ymax: geometry[3] }),
    geometryType: "esriGeometryEnvelope",
    spatialRel: "esriSpatialRelIntersects",
    f: "json"
  });

  const response = await fetch(`${SERVICE_URL}/query?${params}`);
  const data = await response.json();
  return data.count;
};

const downloadFeatures = async (geometry) => {
  const features = [];
  let offset = 0;
  const [xmin, ymin, xmax, ymax] = geometry;

  const metadata = await getMetadata();
  const maxRecords = metadata.maxRecordCount || 2000;
  const totalCount = await getFeatureCount(geometry);

  console.log(`Downloading ${totalCount} features...`);

  while (offset < totalCount) {
    const params = new URLSearchParams({
      where: "1=1",
      outFields: "*",
      returnGeometry: "true",
      geometry: JSON.stringify({ xmin, ymin, xmax, ymax }),
      geometryType: "esriGeometryEnvelope",
      spatialRel: "esriSpatialRelIntersects",
      f: "geojson",
      resultOffset: offset,
      resultRecordCount: maxRecords
    });

    const response = await fetch(`${SERVICE_URL}/query?${params}`);
    const geojson = await response.json();
    features.push(...geojson.features);
    offset += maxRecords;
    console.log(`Downloaded ${features.length}/${totalCount} features`);
  }

  return {
    type: "FeatureCollection",
    features
  };
};

(async () => {
  try {
    const extendedBbox = extendBbox(UKRAINE_BBOX, 0.2);
    const geojson = await downloadFeatures(extendedBbox);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(geojson, null, 2));
    console.log(`GeoJSON saved to ${OUTPUT_FILE}`);
    console.log(`Total features: ${geojson.features.length}`);
    console.log(`Bounding box used: ${extendedBbox.map(v => v.toFixed(3)).join(', ')}`);
  } catch (error) {
    console.error("Error:", error);
  }
})();