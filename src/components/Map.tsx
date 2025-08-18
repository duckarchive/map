import "leaflet-defaulticon-compatibility";

import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import LocationMarker from "./LocationMarker";
import MapLocationSearch from "./MapLocationSearch";

import HistoricalLayers from "./HistoricalLayers";
import UkraineLayer from "./UkraineLayer";


interface MapProps {
  position: [number, number];
  onPositionChange: (pos: [number, number]) => void;
}

const Map: React.FC<MapProps> = ({ position, onPositionChange }) => (
  <MapContainer
    scrollWheelZoom
    worldCopyJump
    center={[48.21, 31.1]}
    style={{ height: "100%", width: "100%" }}
    zoom={6}
    zoomControl={false}
  >
    <MapLocationSearch />
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      // url="https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=YOUR_KEY&language=uk"
      url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      // url="https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png"
      // url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png"
    />
    <UkraineLayer />
    <HistoricalLayers />
    <LocationMarker value={position} onChange={onPositionChange} />
  </MapContainer>
);

export default Map;
