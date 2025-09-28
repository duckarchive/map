import "leaflet-geosearch/assets/css/leaflet.css";

import React from "react";
import {
  MapContainer,
  MapContainerProps,
  TileLayer,
  TileLayerProps,
} from "react-leaflet";
import type { Map } from "leaflet";

import LocationMarker, { MarkerValue } from "./LocationMarker";
import MapLocationSearch from "./MapLocationSearch";

import HistoricalLayers from "./HistoricalLayers";
import UkraineLayer from "./UkraineLayer";

const STATIC = {
  zoomControl: false,
  doubleClickZoom: false,
  closePopupOnClick: false,
  dragging: false,
  zoomSnap: 0,
  zoomDelta: 1,
  trackResize: false,
  touchZoom: false,
  scrollWheelZoom: false,
};

const DEFAULT = {
  zoomControl: false,
  scrollWheelZoom: true,
};

export interface GeoDuckMapProps
  extends MapContainerProps,
    React.RefAttributes<Map> {
  positions: MarkerValue[];
  onPositionChange?: (pos: MarkerValue) => void;
  tileLayerProps?: TileLayerProps;
  year?: number;
  onYearChange?: (year: number) => void;
  hideLayers?: Partial<{
    yearInput: boolean;
    searchInput: boolean;
    locationMarker: boolean;
    historicalLayers: boolean;
    ukraineLayer: boolean;
  }>;
}

const GeoDuckMap: React.FC<GeoDuckMapProps> = ({
  positions,
  onPositionChange,
  tileLayerProps,
  year = 1897,
  onYearChange,
  hideLayers,
  ...mapContainerProps
}) => (
  <MapContainer
    worldCopyJump
    center={[49.0139, 31.2858]}
    style={{ height: "100%", width: "100%" }}
    zoom={6}
    {...(onPositionChange ? DEFAULT : STATIC)}
    {...mapContainerProps}
  >
    <TileLayer
      className="grayscale"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url={"https://tile.openstreetmap.org/{z}/{x}/{y}.png"}
      {...tileLayerProps}
    />
    {!hideLayers?.ukraineLayer && <UkraineLayer />}
    {!hideLayers?.searchInput && (
      <MapLocationSearch onSelect={onPositionChange} />
    )}
    {!hideLayers?.historicalLayers && (
      <HistoricalLayers year={year} onYearChange={onYearChange} />
    )}
    {!hideLayers?.locationMarker &&
      (onPositionChange ? (
        <LocationMarker value={positions[0]} onChange={onPositionChange} />
      ) : (
        positions.map((pos, idx) => (
          <LocationMarker key={idx} value={pos} />
        ))
      ))}
  </MapContainer>
);

export default GeoDuckMap;
