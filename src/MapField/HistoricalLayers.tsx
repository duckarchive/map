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
import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point as turfPoint } from "@turf/helpers";

import { useMapData } from "./useMapData";

import useStopPropagation from "@/components/MapField/useStopPropagation";

// Year presets
const YEAR_PRESETS = [
  { value: 1897, label: "Російська Імперія" },
  { value: 1914, label: "WWI" },
  { value: 1937, label: "Перед WWII" },
  { value: 1945, label: "Після WWII" },
  { value: 1991, label: "Незалежність" },
];

// Color palette for countries (OHM data)
const colorPalette = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "darkblue",
  "purple",
];

// Function to get color for a country feature
const getFeatureColor = (feature: any) => {
  const colorIndex = (feature.id || 0) % colorPalette.length;

  return colorPalette[colorIndex];
};

// Styles for countries (OHM data)
const countryDefaultStyle = (feature: any) => ({
  color: getFeatureColor(feature),
  weight: 2,
  fillColor: "transparent",
  opacity: 0.4,
  interactive: true,
});

const countryHighlightStyle = (feature: any) => ({
  ...countryDefaultStyle(feature),
  opacity: 0.8,
});

// Styles for states (historical data)
const stateDefaultStyle = {
  color: "gold",
  weight: 1,
  fillOpacity: 0,
  fillColor: "gold",
  interactive: true,
};

const stateHighlightStyle = {
  ...stateDefaultStyle,
  fillOpacity: 0.5,
};

const CountriesLayer = memo(
  forwardRef<L.GeoJSON, GeoJSONProps>(({ data, onEachFeature }, ref) =>
    data ? (
      <GeoJSON
        ref={ref}
        data={data}
        style={countryDefaultStyle}
        onEachFeature={onEachFeature}
      />
    ) : null,
  ),
);

CountriesLayer.displayName = "CountriesLayer";

const StatesLayer = memo(({ data, onEachFeature }: GeoJSONProps) =>
  data ? (
    <GeoJSON
      data={data}
      style={stateDefaultStyle}
      onEachFeature={onEachFeature}
    />
  ) : null,
);

StatesLayer.displayName = "StatesLayer";

interface HistoricalLayersProps {
  year?: number;
}

const HistoricalLayers: React.FC<HistoricalLayersProps> = ({ year = 1897 }) => {
  const [hoveredCountryFeature, setHoveredCountryFeature] = useState<any>(null);
  const [hoveredStateFeature, setHoveredStateFeature] = useState<any>(null);
  const [yearOverride, setYearOverride] = useState(year);
  const [yearInput, setYearInput] = useState(year.toString());
  const [showPresets, setShowPresets] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const { countries, states, updateYear, isLoading } = useMapData(yearOverride);
  const countriesRef = useRef<L.GeoJSON>(null);
  const tooltipRef = useStopPropagation();
  const yearSelectRef = useStopPropagation();
  const map = useMap();

  useEffect(() => {
    if (!map || !countriesRef.current) return;

    const handleMouseMove = (e: LeafletMouseEvent) => {
      const point = turfPoint([e.latlng.lng, e.latlng.lat]);

      countriesRef.current?.eachLayer((l: any) => {
        const feature: GeoJSON.Feature = l.feature;

        if (!feature || !feature.geometry) return;
        try {
          if (feature.geometry.type.endsWith("Polygon")) {
            if (booleanPointInPolygon(point, feature as any)) {
              setHoveredCountryFeature(feature);
              l.setStyle(countryHighlightStyle(feature));
            } else {
              l.setStyle(countryDefaultStyle(feature));
            }
          }
        } catch {
          // Skip invalid geometry features
          console.warn("Invalid geometry for feature", feature);
        }
      });
    };

    map.on("mousemove", handleMouseMove);

    return () => {
      map.off("mousemove", handleMouseMove);
    };
  }, [map, countriesRef, countries, states]);

  useEffect(() => {
    updateYear(yearOverride);
    setHoveredCountryFeature(null);
    setHoveredStateFeature(null);
  }, [yearOverride]);

  const validateYear = (yearStr: string): boolean => {
    const yearNum = parseInt(yearStr, 10);

    return /^\d{4}$/.test(yearStr) && yearNum >= 1600 && yearNum <= 2025;
  };

  const handleYearInputChange = (value: string) => {
    // Only allow digits and limit to 4 characters
    const numericValue = value.replace(/\D/g, "").slice(0, 4);

    setYearInput(numericValue);

    if (numericValue.length === 4) {
      const isValid = validateYear(numericValue);

      setIsInvalid(!isValid);

      if (isValid) {
        setYearOverride(parseInt(numericValue, 10));
      }
    } else {
      setIsInvalid(false);
    }
  };

  const handlePresetSelect = (presetYear: number) => {
    setYearInput(presetYear.toString());
    setYearOverride(presetYear);
    setShowPresets(false);
    setIsInvalid(false);
  };

  const handleInputFocus = () => {
    setShowPresets(true);
  };

  const handleInputBlur = () => {
    // Delay hiding presets to allow clicking on them
    setTimeout(() => setShowPresets(false), 150);
  };

  const onEachStateFeature = useCallback(
    (feature: GeoJSON.Feature, layer: Layer) => {
      layer.on({
        mouseover: (e) => {
          setHoveredStateFeature(feature);
          e.target.setStyle(stateHighlightStyle);
        },
        mouseout: (e) => {
          setHoveredStateFeature(null);
          e.target.setStyle(stateDefaultStyle);
        },
      });
    },
    [],
  );

  return (
    <>
      {isLoading ? (
        <div className="absolute z-[1001] top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm bg-white/50">
          <Spinner />
        </div>
      ) : (
        <>
          {countries && <CountriesLayer ref={countriesRef} data={countries} />}

          {states && (
            <StatesLayer data={states} onEachFeature={onEachStateFeature} />
          )}
        </>
      )}

      {/* Fixed tooltip at bottom left corner */}
      {(hoveredCountryFeature || hoveredStateFeature) && (
        <Card
          ref={tooltipRef}
          className="max-w-sm absolute z-[500] bottom-1 left-1 pointer-events-none"
        >
          <CardBody>
            <div className="flex flex-col gap-1">
              {hoveredStateFeature?.properties?.admin_level_2 && (
                <h4 className="font-semibold text-large">
                  {hoveredStateFeature.properties.admin_level_2}
                </h4>
              )}
              {hoveredStateFeature?.properties?.admin_level_1 && (
                <p className="text-small text-default-500">
                  {hoveredStateFeature.properties.admin_level_1}
                </p>
              )}
              <p className="text-small text-default-500">
                {hoveredCountryFeature?.properties?.name}
              </p>
            </div>
          </CardBody>
        </Card>
      )}
      <div
        ref={yearSelectRef}
        className="absolute z-[1000] bottom-1 right-1 bg-white rounded-xl shadow"
      >
        {showPresets && (
          <div className="flex flex-col gap-1 p-2">
            {YEAR_PRESETS.map((preset) => (
              <Button
                key={preset.value}
                className="text-xs justify-start"
                color="default"
                size="sm"
                variant={yearOverride === preset.value ? "flat" : "bordered"}
                onPress={() => handlePresetSelect(preset.value)}
              >
                {preset.value} - {preset.label}
              </Button>
            ))}
          </div>
        )}
        <Input
          classNames={{
            inputWrapper: "bg-default-100 relative",
            input: "text-sm",
          }}
          errorMessage={isInvalid ? "Введіть рік від 1600 до 2025" : ""}
          isInvalid={isInvalid}
          label="Рік"
          placeholder="1897"
          size="sm"
          type="text"
          value={yearInput}
          variant="bordered"
          onBlur={handleInputBlur}
          onFocus={handleInputFocus}
          onValueChange={handleYearInputChange}
        />
      </div>
    </>
  );
};

export default HistoricalLayers;
