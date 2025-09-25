import React, { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import GeoDuckMap from "../../";

const Demo: React.FC = () => {
  const [position, setPosition] = useState<[number, number, number?]>([
    49.0139, 31.2858, 0,
  ]);
  const [year, setYear] = useState(1897);

  return (
    <div className="w-full h-[calc(100vh-3rem)] flex flex-col gap-4">
      <Card className="flex-1 h-[calc(100vh-3rem)]">
        <CardBody className="p-0 text-danger">
          <GeoDuckMap
            positions={[position]}
            onPositionChange={setPosition}
            year={year}
            onYearChange={setYear}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default Demo;
