import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-geosearch/assets/css/leaflet.css";

import React from "react";
import {
  MapContainer,
  MapContainerProps,
  TileLayer,
  TileLayerProps,
} from "react-leaflet";

import LocationMarker from "./LocationMarker";
import MapLocationSearch from "./MapLocationSearch";

import HistoricalLayers from "./HistoricalLayers";
import UkraineLayer from "./UkraineLayer";

export interface GeoDuckMapProps extends MapContainerProps {
  position: [number, number];
  onPositionChange: (pos: [number, number]) => void;
  tileLayerProps?: TileLayerProps;
  year?: number;
  onYearChange?: (year: number) => void;
  radius?: number;
  onRadiusChange?: (radius: number) => void;
  hideLayers?: Partial<{
    yearInput: boolean;
    searchInput: boolean;
    locationMarker: boolean;
    historicalLayers: boolean;
    ukraineLayer: boolean;
  }>;
}

const GeoDuckMap: React.FC<GeoDuckMapProps> = ({
  position,
  onPositionChange,
  tileLayerProps,
  year = 1897,
  onYearChange,
  radius,
  onRadiusChange,
  hideLayers,
  ...mapContainerProps
}) => (
  <MapContainer
    scrollWheelZoom
    worldCopyJump
    center={[49.0139, 31.2858]}
    style={{ height: "100%", width: "100%" }}
    zoom={6}
    zoomControl={false}
    {...mapContainerProps}
  >
    <TileLayer
      className="grayscale"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url={"https://tile.openstreetmap.org/{z}/{x}/{y}.png"}
      {...tileLayerProps}
    />
    {!hideLayers?.ukraineLayer && <UkraineLayer />}
    {!hideLayers?.searchInput && <MapLocationSearch />}
    {!hideLayers?.historicalLayers && (
      <HistoricalLayers year={year} onYearChange={onYearChange} />
    )}
    {!hideLayers?.locationMarker && (
      <LocationMarker
        value={position}
        onChange={onPositionChange}
        radius={radius}
        onRadiusChange={onRadiusChange}
      />
    )}
  </MapContainer>
);

export default GeoDuckMap;
