import useSWR from "swr";
import { useMemo, useState } from "react";

import { overpass2geojson } from "./helpers";

interface MapData {
  countries: GeoJSON.FeatureCollection | null;
  states: GeoJSON.FeatureCollection | null;
  updateYear: (year: number) => void;
  isLoading: boolean;
}

const YEAR_TO_STATE_URL: Record<number, string> = {
  1897: "https://raw.githubusercontent.com/duckarchive/map.duckarchive.com/refs/heads/main/public/assets/geojson/1897.geojson",
  1914: "https://raw.githubusercontent.com/duckarchive/map.duckarchive.com/refs/heads/main/public/assets/geojson/1914.geojson",
  1937: "https://raw.githubusercontent.com/duckarchive/map.duckarchive.com/refs/heads/main/public/assets/geojson/1937.geojson",
  1945: "https://raw.githubusercontent.com/duckarchive/map.duckarchive.com/refs/heads/main/public/assets/geojson/1945.geojson",
  1991: "https://raw.githubusercontent.com/duckarchive/map.duckarchive.com/refs/heads/main/public/assets/geojson/1991.geojson",
};

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useMapData = (defaultYear: number): MapData => {
  const [year, setYear] = useState(defaultYear);
  // Fetch OHM countries data
  const date = `${year}-12-31`;
  const bbox = "44,22,52,40"; // Ukraine bbox
  const ohmUrl = `/api/ohm/borders?date=${encodeURIComponent(date)}&bbox=${encodeURIComponent(bbox)}`;

  const {
    data: ohmData,
    isLoading: isLoadingOhm,
    isValidating: isValidatingOhm,
  } = useSWR<OverpassResponse>(ohmUrl, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
  });

  const statesUrl = YEAR_TO_STATE_URL[year] || null;
  const {
    data: statesData,
    isLoading: isLoadingStates,
    isValidating: isValidatingStates,
  } = useSWR<GeoJSON.FeatureCollection>(statesUrl, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
  });

  const countries = useMemo(
    () => (ohmData ? overpass2geojson(ohmData) : null),
    [ohmData],
  );

  const states = useMemo(() => statesData || null, [statesData]);

  const updateYear = (year: number) => {
    setYear(year);
  };

  return {
    countries,
    states,
    updateYear,
    isLoading:
      isLoadingOhm || isLoadingStates || isValidatingOhm || isValidatingStates,
  };
};
