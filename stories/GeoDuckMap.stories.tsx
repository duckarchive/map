import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { Card } from "@heroui/react";

import GeoDuckMap from "../GeoDuckMap";
import type { MarkerValue } from "../GeoDuckMap/LocationMarker";

const InteractiveMap: React.FC = () => {
  const [position, setPosition] = useState<MarkerValue>([
    49.0139, 31.2858, 0, "Центр України",
  ]);
  const [year, setYear] = useState(1897);

  return (
    <div className="w-full h-screen flex flex-col gap-4 p-6">
      <Card className="flex-1">
        <Card.Content className="p-0 text-primary">
          <GeoDuckMap
            positions={[position]}
            onPositionChange={setPosition}
            year={year}
            onYearChange={setYear}
          />
        </Card.Content>
      </Card>
    </div>
  );
};

const meta: Meta<typeof GeoDuckMap> = {
  title: "GeoDuckMap",
  component: GeoDuckMap,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof GeoDuckMap>;

export const Default: Story = {
  render: () => <InteractiveMap />,
};
