import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import React, { forwardRef, useState } from "react";

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

const YearSelect = forwardRef<HTMLDivElement, YearSelectProps>(
  ({ value, onChange }, ref) => {
    const [yearInput, setYearInput] = useState(value.toString());
    const [showPresets, setShowPresets] = useState(false);
    const [isInvalid, setIsInvalid] = useState(false);

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
      <div ref={ref} className="absolute leaflet-bottom leaflet-right">
        <div className="leaflet-control bg-white rounded-xl shadow">
          {showPresets && (
            <div className="flex flex-col gap-1 p-2">
              {YEAR_PRESETS.map((preset) => (
                <Button
                  key={preset.value}
                  className="text-xs justify-start"
                  color="default"
                  size="sm"
                  variant={value === preset.value ? "flat" : "bordered"}
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
      </div>
    );
  }
);

export default YearSelect;
