import useSWR from "swr";
import { useMemo, useState } from "react";

interface MapData {
  countries: GeoJSON.FeatureCollection | null;
  states: GeoJSON.FeatureCollection | null;
  updateYear: (year: number) => void;
  isLoading: boolean;
}

const COUNTRIES_BASE_URL =
  "https://raw.githubusercontent.com/duckarchive/map.duckarchive.com/refs/heads/main/public/assets/geojson/countries/";
const YEAR_TO_COUNTRIES_URL: Record<number, string> = {
  1897: `${COUNTRIES_BASE_URL}1897.geojson`,
  1914: `${COUNTRIES_BASE_URL}1914.geojson`,
  1937: `${COUNTRIES_BASE_URL}1937.geojson`,
  1945: `${COUNTRIES_BASE_URL}1945.geojson`,
  1991: `${COUNTRIES_BASE_URL}1991.geojson`,
};

const STATE_BASE_URL =
  "https://raw.githubusercontent.com/duckarchive/map.duckarchive.com/refs/heads/main/public/assets/geojson/";
const YEAR_TO_STATE_URL: Record<number, string> = {
  1897: `${STATE_BASE_URL}1897.geojson`,
  1914: `${STATE_BASE_URL}1914.geojson`,
  1937: `${STATE_BASE_URL}1937.geojson`,
  1945: `${STATE_BASE_URL}1945.geojson`,
  1991: `${STATE_BASE_URL}1991.geojson`,
};

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const useMapData = (defaultYear: number): MapData => {
  const [year, setYear] = useState(defaultYear);

  const countriesUrl = YEAR_TO_COUNTRIES_URL[year] || null;
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

  const countries = useMemo(() => countriesData || null, [countriesData]);

  const states = useMemo(() => statesData || null, [statesData]);

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