import { Card, CardBody } from "@heroui/card";
import { forwardRef } from "react";

interface MapTooltipProps {
  level1?: string;
  level2?: string;
  level3?: string;
}

const MapTooltip: React.FC<MapTooltipProps> = ({ level1, level2, level3 }) => {
  return (
    <div className="absolute leaflet-bottom leaflet-left">
      <Card className="leaflet-control max-w-sm pointer-events-none rounded-xl">
        <CardBody className="py-2">
          <div className="flex flex-col gap-0">
            {level3 && <p className="text-large">{level3}</p>}
            {level2 && <p className="text-small text-default-500">{level2}</p>}
            {level1 && <p className="text-small text-default-500">{level1}</p>}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default MapTooltip;
