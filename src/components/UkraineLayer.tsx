import { GeoJSON } from "react-leaflet";
import useSWR from "swr";

const UKRAINE_URL =
  "https://raw.githubusercontent.com/duckarchive/map.duckarchive.com/refs/heads/main/public/assets/geojson/ukraine.geojson";
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const UkraineLayer: React.FC = () => {
  const { data, isLoading, isValidating } = useSWR<GeoJSON.FeatureCollection>(
    UKRAINE_URL,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
    },
  );

  return (
    data && (
      <GeoJSON
        data={data}
        style={{
          color: "gray",
          weight: 4,
          fillColor: "transparent",
          opacity: 0.4,
          interactive: false,
        }}
      />
    )
  );
};

export default UkraineLayer;
