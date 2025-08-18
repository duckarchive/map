# @duckarchive/map

Interactive historical map component for visualizing geographical data over time, built with React and Leaflet.

## Installation

This package is published to GitHub Packages. You'll need to configure npm to use GitHub's registry for @duckarchive packages.

### 1. Configure npm registry

Create or update `.npmrc` in your project root:

```
@duckarchive:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### 2. Set up authentication

You'll need a GitHub Personal Access Token with `read:packages` permission:

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with `read:packages` scope
3. Add it to your environment:

```bash
export GITHUB_TOKEN=your_personal_access_token
```

Or create a local `.npmrc` file:
```
//npm.pkg.github.com/:_authToken=your_personal_access_token
```

You can also copy the included `.npmrc.example` file and rename it to `.npmrc`, then add your token.

### 3. Install the package

```bash
npm install @duckarchive/map
# or
yarn add @duckarchive/map
# or
pnpm add @duckarchive/map
```

**Note**: This package is hosted on GitHub Packages, not npm registry. Make sure to configure your npm client correctly as shown above.

## Peer Dependencies

This package requires the following peer dependencies to be installed in your project:

```bash
npm install react react-dom leaflet react-leaflet
```

Optional dependencies for enhanced UI components:
```bash
npm install @heroui/autocomplete @heroui/button @heroui/card @heroui/input @heroui/spinner @heroui/system tailwindcss swr
```

## Usage

```tsx
import React, { useState } from 'react';
import { GeoDuckMap } from '@duckarchive/map';
import 'leaflet/dist/leaflet.css';

function App() {
  const [position, setPosition] = useState<[number, number]>([49.0139, 31.2858]);

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <GeoDuckMap 
        position={position} 
        onPositionChange={setPosition} 
      />
    </div>
  );
}

export default App;
```

## Components

### GeoDuckMap

The main map component that displays historical geographical data.

#### Props

- `position: [number, number]` - Current map center position [lat, lng]
- `onPositionChange: (pos: [number, number]) => void` - Callback when position changes

### Additional Components

The package also exports individual components that can be used separately:

- `HistoricalLayers` - Historical geographical layers
- `LocationMarker` - Interactive location marker
- `MapLocationSearch` - Location search functionality
- `Tooltip` - Map tooltip component
- `UkraineLayer` - Ukraine geographical layer
- `YearSelect` - Year selection component

### Hooks

- `useMapData` - Hook for managing map data
- `useStopPropagation` - Hook for stopping event propagation

## Styling

Make sure to import Leaflet CSS in your application:

```tsx
import 'leaflet/dist/leaflet.css';
```

If you're using Tailwind CSS and HeroUI components, make sure they are properly configured in your project.

## Development

To build the package locally:

```bash
npm run build:lib
```

To run the demo:

```bash
npm run dev
```

## License

MIT

## Contributing

Issues and pull requests are welcome on [GitHub](https://github.com/duckarchive/map.duckarchive.com).
