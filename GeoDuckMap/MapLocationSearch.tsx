import { useState, useCallback, memo, useEffect } from "react";
import { useMap } from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { ComboBox, EmptyState, Input, ListBox } from "@heroui/react";

import useStopPropagation from "./useStopPropagation";

const SearchSVG = () => (
  <svg
    className="w-4 h-4 text-gray-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
  </svg>
);

const PinSVG = () => (
  <svg
    className="w-4 h-4 text-gray-400 flex-shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
    <path
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
  </svg>
);

interface SearchResult {
  x: number; // longitude
  y: number; // latitude
  label: string;
  bounds: [[number, number], [number, number]];
  raw: any;
}

interface MapLocationSearchProps {
  onSelect?: (coord: [number, number]) => void;
}

const MapLocationSearch = memo<MapLocationSearchProps>(({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const autocompleteRef = useStopPropagation();
  const map = useMap();

  const provider = new OpenStreetMapProvider({
    params: {
      "accept-language": "ua",
      countrycodes: "ua,pl,by,ru,ro,md,tr",
      limit: 5,
      email: "admin@duckarchive.com",
    },
  });

  const searchLocations = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);

        return;
      }

      try {
        const searchResults = await provider.search({ query: searchQuery });

        setResults(searchResults as SearchResult[]);
      } catch {
        setResults([]);
      }
    },
    [provider],
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchLocations(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleLocationSelect = (result: SearchResult) => {
    setQuery(result.label);

    // Pan map to selected location
    map.setView([result.y, result.x], 15);

    // Dispatch custom event for other components to listen to
    map.fire("geosearch/showlocation", {
      location: result,
      marker: null,
    });

    onSelect?.([result.y, result.x]);
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
  };

  const handleSelect = (key: number | string | null) => {
    if (key !== null) {
      const result = results[key as number];

      if (result) {
        handleLocationSelect(result);
      }
    }
  };

  return (
    <div
      ref={autocompleteRef} // Prevents click events from propagating to the map
      className="absolute leaflet-top leaflet-left"
    >
      <ComboBox
        aria-label="Пошук за сучасною назвою"
        className="leaflet-control w-auto bg-background rounded-xl shadow text-foreground"
        inputValue={query}
        variant="secondary"
        onClick={(e) => e.stopPropagation()}
        onInputChange={handleInputChange}
        onMouseDown={(e) => e.stopPropagation()}
        onSelectionChange={handleSelect}
      >
        <ComboBox.InputGroup className="flex items-center gap-2 px-2">
          <SearchSVG />
          <Input className="bg-transparent" placeholder="Пошук за сучасною назвою" />
        </ComboBox.InputGroup>
        <ComboBox.Popover>
          <ListBox
            renderEmptyState={() => (
              <EmptyState>Нічого не знайдено. Уточніть свій запит.</EmptyState>
            )}
          >
            {results.map((result, idx) => (
              <ListBox.Item key={idx} id={idx} textValue={result.label}>
                <PinSVG />
                {result.label}
              </ListBox.Item>
            ))}
          </ListBox>
        </ComboBox.Popover>
      </ComboBox>
    </div>
  );
});

MapLocationSearch.displayName = "MapLocationSearch";

export default MapLocationSearch;
