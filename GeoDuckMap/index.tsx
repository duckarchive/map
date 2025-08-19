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
  tileLayerProps: TileLayerProps;
}

const GeoDuckMap: React.FC<GeoDuckMapProps> = ({
  position,
  onPositionChange,
  tileLayerProps,
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
      {...tileLayerProps}
      url={
        tileLayerProps.url || "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      }
    />
    <UkraineLayer />
    <MapLocationSearch />
    <HistoricalLayers />
    <LocationMarker value={position} onChange={onPositionChange} />
  </MapContainer>
);

export default GeoDuckMap;
