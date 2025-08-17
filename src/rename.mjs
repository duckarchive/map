import fs from "fs";
import path from "path";

// Function to process GeoJSON features and rename properties
function processGeoJSONProperties(geojsonData, idProp, stateProp, districtProp) {
  if (!geojsonData.features || !Array.isArray(geojsonData.features)) {
    throw new Error("Invalid GeoJSON: missing or invalid features array");
  }

  const processedFeatures = geojsonData.features.map(feature => {
    const newProperties = {};
    
    // Only keep and rename the specified properties
    if (idProp && feature.properties && feature.properties[idProp] !== undefined) {
      newProperties.id = feature.properties[idProp];
    }
    
    if (stateProp && feature.properties && feature.properties[stateProp] !== undefined) {
      newProperties.admin_level_1 = feature.properties[stateProp];
    }
    
    if (districtProp && feature.properties && feature.properties[districtProp] !== undefined) {
      newProperties.admin_level_2 = feature.properties[districtProp];
    }

    return {
      ...feature,
      properties: newProperties
    };
  });

  return {
    ...geojsonData,
    features: processedFeatures
  };
}

// Main function to process CLI arguments
function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error("Usage: node rename.mjs <geojson-file> <id-property> [state-property] [district-property]");
    console.error("Example: node rename.mjs input.geojson NAME_EN ADM1_EN ADM2_EN");
    console.error("");
    console.error("Arguments:");
    console.error("  geojson-file     - Input GeoJSON file path");
    console.error("  id-property      - Property to rename to 'id'");
    console.error("  state-property   - Property to rename to 'admin_level_1' (optional)");
    console.error("  district-property - Property to rename to 'admin_level_2' (optional)");
    process.exit(1);
  }

  const inputFile = args[0];
  const idProp = args[1];
  const stateProp = args[2] || null;
  const districtProp = args[3] || null;
  
  if (!fs.existsSync(inputFile)) {
    console.error(`Error: File "${inputFile}" does not exist`);
    process.exit(1);
  }

  try {
    console.log(`Reading GeoJSON file: ${inputFile}`);
    const geojsonContent = fs.readFileSync(inputFile, 'utf8');
    const geojsonData = JSON.parse(geojsonContent);
    
    console.log(`Original features count: ${geojsonData.features?.length || 0}`);
    console.log(`Processing properties:`);
    console.log(`  ${idProp} -> id`);
    if (stateProp) console.log(`  ${stateProp} -> state`);
    if (districtProp) console.log(`  ${districtProp} -> district`);
    
    const processedGeoJSON = processGeoJSONProperties(geojsonData, idProp, stateProp, districtProp);
    
    // Generate output filename
    const outputFile = inputFile;
    
    // Write processed GeoJSON to output file
    fs.writeFileSync(outputFile, JSON.stringify(processedGeoJSON));
    
    console.log(`Processed GeoJSON saved to: ${outputFile}`);
    
    // Show sample of processed properties
    if (processedGeoJSON.features.length > 0) {
      console.log(`Sample feature properties:`, processedGeoJSON.features[0].properties);
    }
    
  } catch (error) {
    console.error(`Error processing file: ${error.message}`);
    process.exit(1);
  }
}

// Run main function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
