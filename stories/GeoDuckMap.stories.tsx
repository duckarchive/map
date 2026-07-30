import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@heroui/react";

import GeoDuckMap from "../GeoDuckMap";
import { iconNames } from "../GeoDuckMap/Markers";
import type { MarkerValue } from "../GeoDuckMap/LocationMarker";

/** Shared frame: the map inherits its marker color from this wrapper. */
const MapFrame: React.FC<{ color: string; children: React.ReactNode }> = ({
  color,
  children,
}) => (
  <div className="w-full h-screen flex flex-col gap-4 p-6">
    <Card className="flex-1">
      {/* The markers inherit their color from here — nothing is passed as a prop. */}
      <Card.Content className="p-0" style={{ color }}>
        {children}
      </Card.Content>
    </Card>
  </div>
);

const colorControl = {
  control: "color" as const,
  description:
    'Marker color. Not a prop — the SVG icons use `fill="currentColor"` and the radius circle uses `color: "currentColor"`, so both inherit the CSS `color` of whatever wraps the map.',
  table: { category: "Marker" },
};

const meta: Meta = {
  title: "GeoDuckMap",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

/* ------------------------------------------------------------------ */
/* Default — single editable marker                                    */
/* ------------------------------------------------------------------ */

interface PlaygroundProps {
  markerColor: string;
  markerIcon: string;
  markerRadius: number;
}

const Playground: React.FC<PlaygroundProps> = ({
  markerColor,
  markerIcon,
  markerRadius,
}) => {
  const [position, setPosition] = useState<MarkerValue>([
    49.0139, 31.2858, 0, "Центр України",
  ]);
  const [year, setYear] = useState(1897);

  // Push control changes into the marker rather than deriving the marker from
  // them, so the map stays free to write radius back on Ctrl+scroll.
  useEffect(() => {
    setPosition((p) => [p[0], p[1], markerRadius, p[3], markerIcon]);
  }, [markerRadius, markerIcon]);

  return (
    <MapFrame color={markerColor}>
      <GeoDuckMap
        positions={[position]}
        onPositionChange={setPosition}
        year={year}
        onYearChange={setYear}
      />
    </MapFrame>
  );
};

export const Default: StoryObj<typeof Playground> = {
  render: (args) => <Playground {...args} />,
  argTypes: {
    markerColor: colorControl,
    markerIcon: {
      control: "select",
      options: iconNames,
      description:
        "Icon key from `Markers.tsx`, supplied as the 5th slot of `MarkerValue` — `[lat, lng, radius?, label?, iconName?]`.",
      table: { category: "Marker" },
    },
    markerRadius: {
      control: { type: "range", min: 0, max: 100000, step: 1000 },
      description:
        "Radius in metres (`MarkerValue[2]`). `0` hides the circle; the circle shares the marker color at 20% opacity. Ctrl+scroll over the map also resizes it.",
      table: { category: "Marker" },
    },
  },
  args: {
    markerColor: "#c026d3",
    markerIcon: "pinIcon",
    markerRadius: 0,
  },
};

/* ------------------------------------------------------------------ */
/* Clustered — many read-only markers, grouped by zoom                 */
/* ------------------------------------------------------------------ */

const CITIES: [name: string, lat: number, lng: number][] = [
  ["Київ", 50.4501, 30.5234],
  ["Львів", 49.8397, 24.0297],
  ["Харків", 49.9935, 36.2304],
  ["Одеса", 46.4825, 30.7233],
  ["Дніпро", 48.4647, 35.0462],
  ["Вінниця", 49.2331, 28.4682],
  ["Чернівці", 48.2917, 25.9354],
  ["Полтава", 49.5883, 34.5514],
];

// Seeded so the story renders the same dataset on every reload.
const mulberry32 = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);

  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const generatePositions = (count: number): MarkerValue[] => {
  const rand = mulberry32(20250730);

  return Array.from({ length: count }, (_, idx): MarkerValue => {
    const [city, lat, lng] = CITIES[idx % CITIES.length];
    // Tight spread around each city so groups actually form at low zoom and
    // break apart as you zoom in.
    const spread = 0.1 + rand() * 0.5;

    return [
      lat + (rand() - 0.5) * spread,
      lng + (rand() - 0.5) * spread * 1.6,
      0,
      `${city} — об'єкт №${idx + 1}`,
      iconNames[idx % iconNames.length],
    ];
  });
};

interface ClusterPlaygroundProps {
  markerColor: string;
  count: number;
  clusterThreshold: number;
}

const ClusterPlayground: React.FC<ClusterPlaygroundProps> = ({
  markerColor,
  count,
  clusterThreshold,
}) => {
  const [year, setYear] = useState(1897);
  const positions = useMemo(() => generatePositions(count), [count]);

  return (
    <MapFrame color={markerColor}>
      {/* No `onPositionChange` — grouping only kicks in on a read-only map. */}
      <GeoDuckMap
        positions={positions}
        clusterThreshold={clusterThreshold}
        year={year}
        onYearChange={setYear}
      />
    </MapFrame>
  );
};

export const Clustered: StoryObj<typeof ClusterPlayground> = {
  render: (args) => <ClusterPlayground {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "A read-only map with more markers than `clusterThreshold`. Markers within 72 screen pixels of each other at the current zoom collapse into one counted group; hover a group for its labels, click it to fit the map to its members. Anything outside the padded viewport is not rendered at all, so the Leaflet layer count tracks the viewport rather than `positions.length`.",
      },
    },
  },
  argTypes: {
    markerColor: colorControl,
    count: {
      control: { type: "range", min: 1, max: 2000, step: 1 },
      description:
        "How many markers to scatter around 8 Ukrainian cities. The dataset is seeded, so it is identical on every reload.",
      table: { category: "Grouping" },
    },
    clusterThreshold: {
      control: { type: "range", min: 0, max: 200, step: 1 },
      description:
        "Grouping starts above this many markers (`GeoDuckMap` prop, default 20). Raise it past `count` to render every marker individually — note the map also goes fully static in that case, since a non-clustered read-only map disables dragging and zoom.",
      table: { category: "Grouping" },
    },
  },
  args: {
    markerColor: "#c026d3",
    count: 400,
    clusterThreshold: 20,
  },
};
