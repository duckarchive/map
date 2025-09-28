import { Marker, Circle, useMapEvents, useMap, Tooltip } from "react-leaflet";
import React, { useEffect } from "react";
import icons from "./Markers";

export type MarkerValue = [number, number, number?, string?, string?];

interface LocationMarkerProps {
  value: MarkerValue;
  onChange?: (position: MarkerValue) => void;
}

const StaticLocationMarker: React.FC<Pick<LocationMarkerProps, "value">> = ({
  value,
}) => {
  if (!value) return null;

  const markerIcon = icons[value[4] || "pinIcon"];
  const latLng: [number, number] = [value[0], value[1]];

  return (
    <>
      <Marker position={latLng} icon={markerIcon}>
        {value[3] && <Tooltip direction="top" offset={[0, -30]}>{value[3]}</Tooltip>}
      </Marker>
      {value[2] && value[2] > 0 && (
        <Circle
          center={latLng}
          radius={value[2]}
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

const DynamicLocationMarker: React.FC<
  Pick<LocationMarkerProps, "value" | "onChange">
> = ({ value, onChange }) => {
  const map = useMap();

  useMapEvents({
    click(e) {
      if (!e.latlng) return;
      const { lat, lng } = e.latlng;

      onChange?.([lat, lng, value[2] || 0]);
    },
  });

  useEffect(() => {
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

        let newRadius = value[2] || 0;
        if (delta < 0) {
          // Scroll up - increase radius
          newRadius = Math.min((value[2] || 0) + step, maxRadius);
        } else {
          // Scroll down - decrease radius
          newRadius = Math.max((value[2] || 0) - step, minRadius);
        }

        if (newRadius !== value[2] || 0) {
          onChange?.([value[0], value[1], newRadius]);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Control") {
        // Disable scroll zoom when Ctrl is pressed
        map.scrollWheelZoom.disable();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Control") {
        // Re-enable scroll zoom when Ctrl is released
        map.scrollWheelZoom.enable();
      }
    };

    const mapContainer = map.getContainer();

    // Add event listeners
    mapContainer.addEventListener("wheel", handleWheel, {
      passive: false,
      capture: true,
    });
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      mapContainer.removeEventListener("wheel", handleWheel, { capture: true });
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      // Ensure scroll zoom is re-enabled on cleanup
      map.scrollWheelZoom.enable();
    };
  }, [map, value, onChange]);

  if (!value) return null;

  const latLng: [number, number] = [value[0], value[1]];

  return (
    <>
      <Marker position={latLng} icon={icons["pinIcon"]} />
      {value[2] && value[2] > 0 && (
        <Circle
          center={latLng}
          radius={value[2]}
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

const LocationMarker: React.FC<LocationMarkerProps> = ({ value, onChange }) => {
  const isStatic = !onChange;

  return isStatic ? (
    <StaticLocationMarker value={value} />
  ) : (
    <DynamicLocationMarker value={value} onChange={onChange} />
  );
};

export default LocationMarker;
