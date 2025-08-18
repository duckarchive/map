import React, { useState } from 'react';
import { Card, CardBody } from "@heroui/card";
// @ts-ignore
import GeoDuckMap from "../../";

const Demo: React.FC = () => {
  const [position, setPosition] = useState<[number, number]>([49.0139, 31.2858]);
  return (
    <Card className="w-full h-[calc(100vh-3rem)]">
      <CardBody className="p-0">
        <GeoDuckMap
          position={position}
          onPositionChange={setPosition}
        />
      </CardBody>
    </Card>
  );
};

export default Demo;