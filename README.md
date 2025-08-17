# TypeScript Conversion

## Scripts

Run scripts using `pnpm run <script>`:

- `filter` - Filter GeoJSON features within Ukraine polygon
- `fix` - Convert coordinates from Stereo70 to WGS84
- `gisloader` - Download features from ArcGIS service
- `merge` - Merge translation data with GeoJSON
- `rename` - Rename GeoJSON properties
- `translator` - Convert GeoJSON to CSV/JSON without geometry
- `build` - Build TypeScript files to JavaScript
- `start` - Run all scripts in sequence

## Development

- Uses TypeScript with `ts-node` for development
- Output directory: `dist/`
- Source files in `src/`

### Dependencies

Core packages:
- `@turf/*` - GeoJSON manipulation utilities
- `proj4` - Coordinate system transformations
- `csv-parse` - CSV parsing
- `node-fetch` - HTTP requests

Development:
- `typescript`
- `ts-node`
- Type definitions (`@types/*`)
