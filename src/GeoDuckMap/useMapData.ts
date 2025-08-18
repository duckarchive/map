import useSWR from "swr";
import { useMemo, useState } from "react";

const BASE_URL =
  "https://raw.githubusercontent.com/duckarchive/map.duckarchive.com/refs/heads/main/geojson";
interface Collection {
  year: number;
  label?: string;
  url: string;
}
export const countryCollections: Collection[] = [
  { year: 1500, url: `${BASE_URL}/countries/1500.geojson` },
  { year: 1530, url: `${BASE_URL}/countries/1530.geojson` },
  { year: 1600, url: `${BASE_URL}/countries/1600.geojson` },
  { year: 1650, url: `${BASE_URL}/countries/1650.geojson` },
  { year: 1700, url: `${BASE_URL}/countries/1700.geojson` },
  { year: 1715, url: `${BASE_URL}/countries/1715.geojson` },
  { year: 1783, url: `${BASE_URL}/countries/1783.geojson` },
  { year: 1800, url: `${BASE_URL}/countries/1800.geojson` },
  { year: 1815, url: `${BASE_URL}/countries/1815.geojson` },
  { year: 1880, url: `${BASE_URL}/countries/1880.geojson` },
  { year: 1900, url: `${BASE_URL}/countries/1900.geojson` },
  { year: 1914, url: `${BASE_URL}/countries/1914.geojson` },
  { year: 1920, url: `${BASE_URL}/countries/1920.geojson` },
  { year: 1930, url: `${BASE_URL}/countries/1930.geojson` },
  { year: 1938, url: `${BASE_URL}/countries/1938.geojson` },
  { year: 1945, url: `${BASE_URL}/countries/1945.geojson` },
  { year: 1960, url: `${BASE_URL}/countries/1960.geojson` },
  { year: 1991, url: `${BASE_URL}/countries/1991.geojson` },
];

export const stateCollections: Collection[] = [
  { year: 1897, url: `${BASE_URL}/states/1897.geojson` },
  { year: 1914, url: `${BASE_URL}/states/1914.geojson` },
  { year: 1937, url: `${BASE_URL}/states/1937.geojson` },
  { year: 1945, url: `${BASE_URL}/states/1945.geojson` },
  { year: 1991, url: `${BASE_URL}/states/1991.geojson` },
];

const getClosestCollectionUrl = (
  targetYear: number,
  collections: Collection[],
  isStrict: boolean = false
): string | null => {
  if (isStrict) {
    const exactMatch = collections.find(({ year }) => year === targetYear);
    return exactMatch ? exactMatch.url : null;
  }
  const countryYears = collections
    .filter(({ year }) => year > 0 && year <= targetYear)
    .sort((a, b) => b.year - a.year);

  return countryYears.length > 0 ? countryYears[0].url : null;
};

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface MapData {
  countries: GeoJSON.FeatureCollection | null;
  states: GeoJSON.FeatureCollection | null;
  updateYear: (year: number) => void;
  isLoading: boolean;
}

const useMapData = (defaultYear: number): MapData => {
  const [year, setYear] = useState(defaultYear);

  const countriesUrl = getClosestCollectionUrl(year, countryCollections);
  const {
    data: countriesData,
    isLoading: isLoadingCountries,
    isValidating: isValidatingCountries,
  } = useSWR<GeoJSON.FeatureCollection>(countriesUrl, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
  });

  const statesUrl = getClosestCollectionUrl(year, stateCollections, true);
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
    () => (countriesData || null),
    [countriesData]
  );

  const states = useMemo(
    () => (statesData || null),
    [statesData]
  );

  const updateYear = (year: number) => {
    setYear(year);
  };

  return {
    countries,
    states,
    updateYear,
    isLoading:
      isLoadingCountries ||
      isLoadingStates ||
      isValidatingCountries ||
      isValidatingStates,
  };
};

export default useMapData;
