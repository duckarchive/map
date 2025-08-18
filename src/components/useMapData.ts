import useSWR from "swr";
import { useMemo, useState } from "react";
import { Feature, FeatureCollection } from "geojson";

const colorPalette = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "darkblue",
  "purple",
];

const getCountryFeatureColor = (feature: Feature) => {
  const colorIndex = (feature.properties?.admin_level_1?.length || 0) % colorPalette.length;
  return colorPalette[colorIndex];
};

const addColors = (featureCollection: FeatureCollection) => {
  return {
    ...featureCollection,
    features: featureCollection.features.map((feature) => {
      if (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon") {
        return {
          ...feature,
          properties: {
            ...feature.properties,
            color: getCountryFeatureColor(feature),
          },
        };
      }
      return feature;
    }
  )};
};

interface MapData {
  countries: GeoJSON.FeatureCollection | null;
  states: GeoJSON.FeatureCollection | null;
  updateYear: (year: number) => void;
  isLoading: boolean;
}

const BASE_URL = "https://raw.githubusercontent.com/duckarchive/map.duckarchive.com/refs/heads/main/public/assets/geojson";
const COUNTRIES_BASE_URL =
  `${BASE_URL}/countries`;
const YEAR_TO_COUNTRIES_URL: Record<number, string> = {
  1897: `${COUNTRIES_BASE_URL}/1900.geojson`,
  1914: `${COUNTRIES_BASE_URL}/1914.geojson`,
  1937: `${COUNTRIES_BASE_URL}/1937.geojson`,
  1945: `${COUNTRIES_BASE_URL}/1945.geojson`,
  1991: `${COUNTRIES_BASE_URL}/1991.geojson`,
};

const STATE_BASE_URL =
  `${BASE_URL}/states`;
const YEAR_TO_STATE_URL: Record<number, string> = {
  1897: `${STATE_BASE_URL}/1897.geojson`,
  1914: `${STATE_BASE_URL}/1914.geojson`,
  1937: `${STATE_BASE_URL}/1937.geojson`,
  1945: `${STATE_BASE_URL}/1945.geojson`,
  1991: `${STATE_BASE_URL}/1991.geojson`,
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

  const countries = useMemo(() => countriesData ? addColors(countriesData) : null, [countriesData]);

  const states = useMemo(() => statesData ? addColors(statesData) : null, [statesData]);

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