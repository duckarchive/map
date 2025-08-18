import { Layer, LeafletMouseEvent } from "leaflet";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { GeoJSON, GeoJSONProps, useMap } from "react-leaflet";
import { Spinner } from "@heroui/spinner";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point as turfPoint } from "@turf/helpers";

import useMapData from "./useMapData";
import useStopPropagation from "./useStopPropagation";
import MapTooltip from "./Tooltip";
import YearSelect from "./YearSelect";
import { Feature } from "geojson";

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
  const colorIndex =
    (feature.id || feature.properties?.admin_level_1_ID || 0) % colorPalette.length;
  return colorPalette[colorIndex];
};

const getStyle = (feature: Feature | undefined, isHighlight: boolean, weight = 1) => {
  const countryColor = feature ? getCountryFeatureColor(feature) : "gray";
  return {
    color: countryColor,
    fillColor: countryColor,
    weight,
    fillOpacity: isHighlight ? 0.5 : 0,
    interactive: true,
  };
}

const CountriesLayer = memo(
  forwardRef<L.GeoJSON, GeoJSONProps>(({ data, onEachFeature }, ref) =>
    data ? (
      <GeoJSON
        ref={ref}
        data={data}
        style={(feature) => getStyle(feature, false, 2)}
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
      style={(feature) => getStyle(feature, false, 1)}
      onEachFeature={onEachFeature}
    />
  ) : null
);

StatesLayer.displayName = "StatesLayer";

interface HistoricalLayersProps {
  year?: number;
}

const HistoricalLayers: React.FC<HistoricalLayersProps> = ({ year = 1897 }) => {
  const [hoveredCountryFeature, setHoveredCountryFeature] = useState<any>(null);
  const [hoveredStateFeature, setHoveredStateFeature] = useState<any>(null);
  const [yearOverride, setYearOverride] = useState(year);
  const { countries, states, updateYear, isLoading } = useMapData(yearOverride);
  // const countriesRef = useRef<L.GeoJSON>(null);
  const yearSelectRef = useStopPropagation();
  const map = useMap();

  // useEffect(() => {
  //   if (!map || !countriesRef.current) return;

  //   const handleMouseMove = (e: LeafletMouseEvent) => {
  //     const point = turfPoint([e.latlng.lng, e.latlng.lat]);

  //     countriesRef.current?.eachLayer((l: any) => {
  //       const feature: GeoJSON.Feature = l.feature;

  //       if (!feature || !feature.geometry) return;
  //       try {
  //         if (feature.geometry.type.endsWith("Polygon")) {
  //           if (booleanPointInPolygon(point, feature as any)) {
  //             setHoveredCountryFeature(feature);
  //             l.setStyle(countryHighlightStyle(feature));
  //           } else {
  //             l.setStyle(countryDefaultStyle(feature));
  //           }
  //         }
  //       } catch {
  //         // Skip invalid geometry features
  //         console.warn("Invalid geometry for feature", feature);
  //       }
  //     });
  //   };

  //   map.on("mousemove", handleMouseMove);

  //   return () => {
  //     map.off("mousemove", handleMouseMove);
  //   };
  // }, [map, countriesRef, countries, states]);

  useEffect(() => {
    updateYear(yearOverride);
    setHoveredCountryFeature(null);
    setHoveredStateFeature(null);
  }, [yearOverride]);

  const onEachCountryFeature = useCallback(
    (feature: GeoJSON.Feature, layer: Layer) => {
      layer.on({
        mouseover: (e) => {
          setHoveredCountryFeature(feature);
          e.target.setStyle(getStyle(feature, true, 2));
        },
        mouseout: (e) => {
          setHoveredCountryFeature(null);
          e.target.setStyle(getStyle(feature, false, 2));
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
          e.target.setStyle(getStyle(feature, true, 1));
        },
        mouseout: (e) => {
          setHoveredStateFeature(null);
          e.target.setStyle(getStyle(feature, false, 1));
        }
      });
    },
    []
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
        ref={yearSelectRef}
        value={yearOverride}
        onChange={setYearOverride}
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
