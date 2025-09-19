import { Marker, Circle, useMapEvents, useMap } from "react-leaflet";
import React, { useEffect } from "react";
import L from "leaflet";

const markerSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="0" viewBox="0 0 512 512"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 48c-79.5 0-144 61.39-144 137 0 87 96 224.87 131.25 272.49a15.77 15.77 0 0 0 25.5 0C304 409.89 400 272.07 400 185c0-75.61-64.5-137-144-137z"/><circle cx="256" cy="192" r="48" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>`;

interface LocationMarkerProps {
  value: [number, number];
  onChange?: (position: [number, number]) => void;
  radius?: number;
  onRadiusChange?: (radius: number) => void;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({
  value,
  onChange,
  radius,
  onRadiusChange,
}) => {
  const map = useMap();
  
  useMapEvents({
    click(e) {
      if (!e.latlng) return;
      const { lat, lng } = e.latlng;

      onChange?.([lat, lng]);
    },
  });

  useEffect(() => {
    if (!onRadiusChange || radius === undefined) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        // Prevent default behavior and stop propagation
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        const delta = e.deltaY;
        const step = 100; // 100m step
        const minRadius = 100;
        const maxRadius = 10000;
        
        let newRadius = radius;
        if (delta < 0) {
          // Scroll up - increase radius
          newRadius = Math.min(radius + step, maxRadius);
        } else {
          // Scroll down - decrease radius
          newRadius = Math.max(radius - step, minRadius);
        }
        
        if (newRadius !== radius) {
          onRadiusChange(newRadius);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        // Disable scroll zoom when Ctrl is pressed
        map.scrollWheelZoom.disable();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        // Re-enable scroll zoom when Ctrl is released
        map.scrollWheelZoom.enable();
      }
    };

    const mapContainer = map.getContainer();
    
    // Add event listeners
    mapContainer.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      mapContainer.removeEventListener('wheel', handleWheel, { capture: true });
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      // Ensure scroll zoom is re-enabled on cleanup
      map.scrollWheelZoom.enable();
    };
  }, [map, radius, onRadiusChange]);

  const markerIcon = React.useMemo(() => {
    return L.divIcon({
      html: markerSVG,
      className: "io5-icon",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
  }, []);

  if (!value) return null;

  return (
    <>
      <Marker position={value} icon={markerIcon} />
      {radius && radius > 0 && (
        <Circle
          center={value}
          radius={radius}
          pathOptions={{
            color: "currentColor",
            fillColor: "currentColor",
            fillOpacity: 0.2,
            weight: 0,
          }}
        />
      )}
    </>
  );
};

export default LocationMarker;
