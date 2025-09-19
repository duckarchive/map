import "leaflet-geosearch/assets/css/leaflet.css";
import React from "react";
import { MapContainerProps, TileLayerProps } from "react-leaflet";
import type { Map } from "leaflet";
export interface GeoDuckMapProps extends MapContainerProps, React.RefAttributes<Map> {
    position: [number, number];
    onPositionChange?: (pos: [number, number]) => void;
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
declare const GeoDuckMap: React.FC<GeoDuckMapProps>;
export default GeoDuckMap;
//# sourceMappingURL=index.d.ts.map