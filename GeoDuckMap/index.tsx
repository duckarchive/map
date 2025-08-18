import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-geosearch/assets/css/leaflet.css";

import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import LocationMarker from "./LocationMarker";
import MapLocationSearch from "./MapLocationSearch";

import HistoricalLayers from "./HistoricalLayers";
import UkraineLayer from "./UkraineLayer";


export interface GeoDuckMapProps {
  position: [number, number];
  onPositionChange: (pos: [number, number]) => void;
}

const GeoDuckMap: React.FC<GeoDuckMapProps> = ({ position, onPositionChange }) => (
  <MapContainer
    scrollWheelZoom
    worldCopyJump
    center={[49.0139, 31.2858]}
    style={{ height: "100%", width: "50%" }}
    zoom={6}
    zoomControl={false}
  >
    <TileLayer
      className="grayscale"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <UkraineLayer />
    <MapLocationSearch />
    <HistoricalLayers />
    <LocationMarker value={position} onChange={onPositionChange} />
  </MapContainer>
);

export default GeoDuckMap;
