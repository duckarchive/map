import dynamic from "next/dynamic";

const MapField = dynamic(() => import("./Input").then((mod) => mod.default), {
  ssr: false,
});

export const HistoricalMap = dynamic(
  () => import("./HistoricalMap").then((mod) => mod.default),
  { ssr: false },
);

export default MapField;
