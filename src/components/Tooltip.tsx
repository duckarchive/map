import { Card, CardBody } from "@heroui/card";
import { forwardRef } from "react";

interface MapTooltipProps {
  level1?: string;
  level2?: string;
  level3?: string;
}

const MapTooltip = forwardRef<HTMLDivElement, MapTooltipProps>(
  ({ level1, level2, level3 }, ref) => {
    return (
      <Card
        ref={ref}
        className="max-w-sm absolute z-[500] bottom-1 left-1 pointer-events-none"
      >
        <CardBody>
          <div className="flex flex-col gap-0">
            {level3 && <p className="text-large">{level3}</p>}
            {level2 && <p className="text-small text-default-500">{level2}</p>}
            {level1 && <p className="text-small text-default-500">{level1}</p>}
          </div>
        </CardBody>
      </Card>
    );
  }
);

export default MapTooltip;
