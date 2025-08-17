import React from 'react';

export interface MapProps {
  text?: string;
}

const Map: React.FC<MapProps> = ({ text = 'Hello World' }) => {
  return (
    <div className="duck-archive-map">
      {text}
    </div>
  );
};

export default Map;