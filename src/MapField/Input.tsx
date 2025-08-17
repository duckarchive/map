"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";

import Map from "./Map";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-geosearch/assets/css/leaflet.css";
import "leaflet-defaulticon-compatibility";

interface MapInputProps {
  lat?: number;
  lng?: number;
  onLatChange: (lat: number) => void;
  onLngChange: (lng: number) => void;
  label?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
}

// LocationMarker and MapLocationSearch are now imported from their own files.

const MapInput: React.FC<MapInputProps> = ({
  lat = 49.8397,
  lng = 24.0297,
  onLatChange,
  onLngChange,
  label = "Координати",
  isRequired = false,
  isInvalid = false,
  errorMessage,
}) => {
  const [position, setPosition] = useState<[number, number]>([lat, lng]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (lat && lng) {
      setPosition([lat, lng]);
    }
  }, [lat, lng]);

  const handlePositionChange = (newPosition: [number, number]) => {
    console.log("handlePositionChange");
    setPosition(newPosition);
    onLatChange(newPosition[0]);
    onLngChange(newPosition[1]);
  };

  const handleLatInputChange = (value: string) => {
    console.log("handleLatInputChange");
    const intValue = parseFloat(value);

    if (!isNaN(intValue)) {
      const newPosition: [number, number] = [intValue, lng];

      setPosition(newPosition);
      onLatChange(intValue);
    }
  };

  const handleLngInputChange = (value: string) => {
    console.log("handleLngInputChange");
    const intValue = parseFloat(value);

    if (!isNaN(intValue)) {
      const newPosition: [number, number] = [lat, intValue];

      setPosition(newPosition);
      onLngChange(intValue);
    }
  };

  if (!mounted) {
    return (
      <div className="w-full">
        <div className="flex gap-2 mb-2">
          <Input
            isInvalid={isInvalid}
            isRequired={isRequired}
            label="Широта"
            step="any"
            type="number"
            value={lat ? lat.toString() : ""}
          />
          <Input
            isInvalid={isInvalid}
            isRequired={isRequired}
            label="Довгота"
            step="any"
            type="number"
            value={lng ? lng.toString() : ""}
          />
        </div>
        <Card>
          <CardBody>
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
              <p className="text-gray-500">Завантаження карти...</p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2">
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}

        <p className="text-gray-500 text-xs mt-1">
          Клацніть на карті, щоб вибрати координати
        </p>
      </label>

      <div className="flex gap-2 mb-2">
        <Input
          isInvalid={isInvalid}
          isRequired={isRequired}
          label="Широта"
          placeholder="49.8397"
          step="any"
          type="number"
          value={position?.[0]?.toString() || ""}
          onValueChange={handleLatInputChange}
        />
        <Input
          isInvalid={isInvalid}
          isRequired={isRequired}
          label="Довгота"
          placeholder="24.0297"
          step="any"
          type="number"
          value={position?.[1]?.toString() || ""}
          onValueChange={handleLngInputChange}
        />
      </div>

      <Card>
        <CardBody className="p-0">
          <div className="h-[500px] w-full">
            <Map position={position} onPositionChange={handlePositionChange} />
          </div>
        </CardBody>
      </Card>

      {isInvalid && errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default MapInput;
