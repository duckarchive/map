import React, { useState } from 'react';
import { Card, CardBody } from "@heroui/card";
import Map from "../../src/components/Map";

const Demo: React.FC = () => {
  const [position, setPosition] = useState<[number, number]>([48.21, 31.1]);
  return (
    <Card className="w-full h-[calc(100vh-3rem)]">
      <CardBody className="p-0">
        <Map
          position={position}
          onPositionChange={setPosition}
        />
      </CardBody>
    </Card>
  );
};

export default Demo;