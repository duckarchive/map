import React from 'react';
import ReactDOM from 'react-dom/client';
import Map from '../../src/components/Map';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="demo-container">
      <h1>Duck Archive Map Demo</h1>
      <Map
        position={[48.21, 31.1]}
        onPositionChange={(pos) => console.log('Position changed:', pos)}
      />
    </div>
  </React.StrictMode>
);
