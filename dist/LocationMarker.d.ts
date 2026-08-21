import React from "react";
export type MarkerValue = [number, number, number?, string?, string?, string?];
interface LocationMarkerProps {
    value: MarkerValue;
    onChange?: (position: MarkerValue) => void;
    onClick?: (position: MarkerValue) => void;
}
declare const LocationMarker: React.FC<LocationMarkerProps>;
export default LocationMarker;
//# sourceMappingURL=LocationMarker.d.ts.map