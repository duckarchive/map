# Package Setup Summary

This repository has been configured as an installable npm package for the GeoDuckMap component.

## What Was Configured

### 1. Package Structure
- ✅ Created `src/index.ts` as the main entry point
- ✅ Exported `GeoDuckMap` component and all sub-components
- ✅ Exported TypeScript types for proper type safety

### 2. Build Configuration
- ✅ Added Vite configuration for library building (`vite.config.ts`)
- ✅ Updated TypeScript configuration for library compilation
- ✅ Added proper ESM and CommonJS support
- ✅ Generated TypeScript declaration files

### 3. Package.json Optimization
- ✅ Reorganized dependencies into proper categories:
  - **Peer Dependencies**: React, React-DOM, Leaflet, React-Leaflet (required by consumers)
  - **Optional Peer Dependencies**: HeroUI components, Tailwind, SWR (marked as optional)
  - **Regular Dependencies**: Turf utilities, projection libraries (bundled with package)
  - **Dev Dependencies**: Build tools, TypeScript, testing utilities

### 4. Package Metadata
- ✅ Added proper package description, keywords, repository info
- ✅ Configured package exports for both ESM and CommonJS
- ✅ Added license (MIT)
- ✅ Included geojson data files in published package

### 5. Build Scripts
- ✅ `pnpm build:lib` - Builds the library for distribution
- ✅ `pnpm pack-test` - Tests the package locally
- ✅ `pnpm version:patch/minor/major` - Version management
- ✅ `pnpm release` - Complete build and pack for testing

### 6. Publishing Setup
- ✅ Created `.npmignore` to control published files
- ✅ Added `README.package.md` for package documentation
- ✅ GitHub Actions workflows for CI/CD
- ✅ Configured for GitHub Packages (not npm registry)
- ✅ Automated publishing on git tags

### 7. Documentation
- ✅ Package-specific README with installation and usage instructions
- ✅ TypeScript type exports for IDE support
- ✅ Proper peer dependency documentation

## How to Use This Package

### For Development
```bash
# Build the library
pnpm build:lib

# Test the package locally
pnpm pack-test

# Run Storybook
pnpm storybook
```

### For Publishing
```bash
# Version bump (creates git tag)
pnpm version:patch  # or minor/major

# Push to trigger GitHub Actions (publishes to GitHub Packages)
git push --follow-tags

# Or manual publish to GitHub Packages
pnpm publish:github
```

### For Consumers
```bash
# Configure npm for GitHub Packages
echo "@duckarchive:registry=https://npm.pkg.github.com" >> .npmrc

# Install the package (requires GitHub token with read:packages scope)
npm install @duckarchive/map react react-dom leaflet react-leaflet

# Import and use
import { GeoDuckMap } from '@duckarchive/map';
import 'leaflet/dist/leaflet.css';
```

## Key Features
- 🎯 Tree-shakeable exports
- 📦 Dual ESM/CommonJS support  
- 🔧 TypeScript support with full type definitions
- 📱 Peer dependency optimization
- 🗺️ Includes all geojson data files
- ⚡ Optimized bundle size
- 🚀 GitHub Actions CI/CD
- 📋 GitHub Packages publishing (not npm registry)

## Package Size
- **Unpacked**: ~10.1 MB (includes all geojson historical data)
- **Packed**: ~3.8 MB (compressed)
- **Bundle**: ~13.3 KB (ESM) / ~9.0 KB (CJS) - just the code

The package is now ready to be published to GitHub Packages and installed in other projects!
