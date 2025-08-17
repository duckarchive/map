import "./global.css";

import React from 'react';
import ReactDOM from 'react-dom/client';
import Map from '../../src/components/Map';
import { HeroUIProvider } from '@heroui/system';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <div style={{ width: '100vw', height: '100vh' }}>
        <Map position={[48.21, 31.1]} onPositionChange={(pos) => console.log('Position changed:', pos)} />
      </div>
    </HeroUIProvider>
  </React.StrictMode>
);
