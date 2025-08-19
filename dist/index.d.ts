import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-geosearch/assets/css/leaflet.css";
import React from "react";
import { MapContainerProps, TileLayerProps } from "react-leaflet";
export interface GeoDuckMapProps extends MapContainerProps {
    position: [number, number];
    onPositionChange: (pos: [number, number]) => void;
    tileLayerProps?: TileLayerProps;
}
declare const GeoDuckMap: React.FC<GeoDuckMapProps>;
export default GeoDuckMap;
//# sourceMappingURL=index.d.ts.map