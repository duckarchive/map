import React from 'react';
import ReactDOM from 'react-dom/client';
import Map from '../../src/components/Map';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="demo-container">
      <h1>Duck Archive Map Demo</h1>
      <Map text="Hello from Duck Archive Map!" />
    </div>
  </React.StrictMode>
);
