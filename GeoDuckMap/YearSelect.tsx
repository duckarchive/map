import { Button, FieldError, Input, TextField } from "@heroui/react";
import React, { useState } from "react";
import useStopPropagation from "./useStopPropagation";

// Year presets
const YEAR_PRESETS = [
  { value: 1897, label: "Російська Імперія" },
  { value: 1914, label: "WWI" },
  { value: 1937, label: "Перед WWII" },
  { value: 1945, label: "Після WWII" },
  { value: 1991, label: "Незалежність" },
];

const validateYear = (yearStr: string): boolean => {
  const yearNum = parseInt(yearStr, 10);

  return /^\d{4}$/.test(yearStr) && yearNum >= 1500 && yearNum <= 1991;
};

interface YearSelectProps {
  value: number;
  onChange: (year: number) => void;
}

const YearSelect: React.FC<YearSelectProps> = (
  ({ value, onChange }) => {
    const [yearInput, setYearInput] = useState(value.toString());
    const [showPresets, setShowPresets] = useState(false);
    const [isInvalid, setIsInvalid] = useState(false);
    const yearSelectRef = useStopPropagation();

    const handleYearInputChange = (value: string) => {
      // Only allow digits and limit to 4 characters
      const numericValue = value.replace(/\D/g, "").slice(0, 4);

      setYearInput(numericValue);

      if (numericValue.length === 4) {
        const isValid = validateYear(numericValue);

        setIsInvalid(!isValid);

        if (isValid) {
          onChange(parseInt(numericValue, 10));
        }
      } else {
        setIsInvalid(false);
      }
    };

    const handlePresetSelect = (presetYear: number) => {
      setYearInput(presetYear.toString());
      onChange(presetYear);
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

    return (
      <div ref={yearSelectRef} className="absolute leaflet-top leaflet-right">
        <div className="leaflet-control bg-background rounded-xl shadow">
          <TextField
            aria-label="Рік"
            className="bg-background relative"
            isInvalid={isInvalid}
            type="text"
            value={yearInput}
            onChange={handleYearInputChange}
          >
            <Input
              className="text-sm text-foreground"
              placeholder="1897"
              onBlur={handleInputBlur}
              onFocus={handleInputFocus}
            />
            {isInvalid && <FieldError>Введіть рік від 1600 до 2025</FieldError>}
          </TextField>

          {showPresets && (
            <div className="flex flex-col gap-1 p-2">
              {YEAR_PRESETS.map((preset) => (
                <Button
                  key={preset.value}
                  className="text-xs justify-start"
                  size="sm"
                  variant={value === preset.value ? "tertiary" : "outline"}
                  onPress={() => handlePresetSelect(preset.value)}
                >
                  {preset.value} - {preset.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default YearSelect;
