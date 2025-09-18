import React from "react";
interface LocationMarkerProps {
    value: [number, number];
    onChange: (position: [number, number]) => void;
    radius?: number;
    onRadiusChange?: (radius: number) => void;
}
declare const LocationMarker: React.FC<LocationMarkerProps>;
export default LocationMarker;
//# sourceMappingURL=LocationMarker.d.ts.map