import { Layer } from "leaflet";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { GeoJSON, GeoJSONProps } from "react-leaflet";
import { Spinner } from "@heroui/spinner";

import useMapData from "./useMapData";
import MapTooltip from "./Tooltip";
import YearSelect from "./YearSelect";
import { Feature } from "geojson";

const colorPalette = [
  "green",
  "darkblue",
  "purple",
  "orange",
  "blue",
  "red",
  "yellow",
];

const getCountryFeatureColor = (feature: Feature) => {
  const id = (feature.properties?.admin_level_1_ID || feature.id || 0);
  if (id === 22) {
    // Special case for Ukraine
    return "gold";
  }
  const colorIndex = id % colorPalette.length;
  return colorPalette[colorIndex];
};

const getStyle = (feature: Feature | undefined, isHighlight: boolean, weight = 1) => {
  const countryColor = feature ? getCountryFeatureColor(feature) : "gray";
  return {
    color: countryColor,
    fillColor: countryColor,
    weight,
    opacity: isHighlight ? 1 : 0.5,
    fillOpacity: isHighlight ? 0.1 : 0,
    interactive: true,
  };
}

const CountriesLayer = memo(
  forwardRef<L.GeoJSON, GeoJSONProps>(({ data, onEachFeature }, ref) =>
    data ? (
      <GeoJSON
        ref={ref}
        data={data}
        style={(feature) => getStyle(feature, false, 0)}
        onEachFeature={onEachFeature}
      />
    ) : null
  )
);

CountriesLayer.displayName = "CountriesLayer";

const StatesLayer = memo(({ data, onEachFeature }: GeoJSONProps) =>
  data ? (
    <GeoJSON
      data={data}
      style={(feature) => getStyle(feature, false, 2)}
      onEachFeature={onEachFeature}
    />
  ) : null
);

StatesLayer.displayName = "StatesLayer";

interface HistoricalLayersProps {
  defaultYear: number;
}

const HistoricalLayers: React.FC<HistoricalLayersProps> = ({ defaultYear }) => {
  const [hoveredCountryFeature, setHoveredCountryFeature] = useState<any>(null);
  const [hoveredStateFeature, setHoveredStateFeature] = useState<any>(null);
  const [year, setYear] = useState(defaultYear);
  const { countries, states, updateYear, isLoading } = useMapData(year);

  useEffect(() => {
    updateYear(year);
    setHoveredCountryFeature(null);
    setHoveredStateFeature(null);
  }, [year]);

  const onEachCountryFeature = useCallback(
    (feature: GeoJSON.Feature, layer: Layer) => {
      layer.on({
        mouseover: (e) => {
          setHoveredCountryFeature(feature);
          e.target.setStyle(getStyle(feature, false, 1));
        },
        mouseout: (e) => {
          setHoveredCountryFeature(null);
          e.target.setStyle(getStyle(feature, false, 0));
        },
      });
    },
    []
  );

  const onEachStateFeature = useCallback(
    (feature: GeoJSON.Feature, layer: Layer) => {
      layer.on({
        mouseover: (e) => {
          setHoveredStateFeature(feature);
          const countryFeature = countries?.features.find(
            (f) => f.id?.toString() === feature.properties?.admin_level_1_ID.toString()
          );
          if (countryFeature) {
            setHoveredCountryFeature(countryFeature);
          }
          e.target.setStyle(getStyle(feature, true, 4));
        },
        mouseout: (e) => {
          setHoveredStateFeature(null);
          e.target.setStyle(getStyle(feature, false, 2));
        }
      });
    },
    [countries]
  );

  return (
    <>
      {isLoading ? (
        <div className="absolute z-[1001] top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm bg-white/50">
          <Spinner />
        </div>
      ) : (
        <>
          {countries && (
            <CountriesLayer
              data={countries}
              onEachFeature={onEachCountryFeature}
            />
          )}

          {states && (
            <StatesLayer data={states} onEachFeature={onEachStateFeature} />
          )}
        </>
      )}
      <YearSelect
        value={year}
        onChange={setYear}
      />
      {/* Fixed tooltip at bottom left corner */}
      {(hoveredCountryFeature || hoveredStateFeature) && (
        <MapTooltip
          level1={hoveredCountryFeature?.properties?.admin_level_1}
          level2={hoveredStateFeature?.properties?.admin_level_2}
          level3={hoveredStateFeature?.properties?.admin_level_3}
        />
      )}
    </>
  );
};

export default HistoricalLayers;
