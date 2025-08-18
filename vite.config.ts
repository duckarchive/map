import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'GeoDuckMap',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'leaflet',
        'react-leaflet',
        'leaflet-defaulticon-compatibility',
        'leaflet-geosearch',
        '@heroui/autocomplete',
        '@heroui/button',
        '@heroui/card',
        '@heroui/input',
        '@heroui/spinner',
        '@heroui/system',
        '@turf/boolean-contains',
        '@turf/boolean-overlap',
        '@turf/boolean-point-in-polygon',
        '@turf/helpers',
        'swr',
        'tailwindcss'
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJSXRuntime',
          leaflet: 'L',
          'react-leaflet': 'ReactLeaflet',
          'leaflet-defaulticon-compatibility': 'LeafletDefaultIconCompatibility',
          'leaflet-geosearch': 'LeafletGeoSearch',
          swr: 'SWR'
        }
      }
    },
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
