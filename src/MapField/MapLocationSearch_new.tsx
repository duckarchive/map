import { useState, useCallback, useEffect } from "react";
import { useMap } from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";

interface SearchResult {
  x: number; // longitude
  y: number; // latitude
  label: string;
  bounds: [[number, number], [number, number]];
  raw: any;
}

const MapLocationSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

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
  }, [query, searchLocations]);

  const handleLocationSelect = (result: SearchResult) => {
    setQuery(result.label);

    // Pan map to selected location
    map.setView([result.y, result.x], 15);

    // Dispatch custom event for other components to listen to
    map.fire("geosearch/showlocation", {
      location: result,
      marker: null,
    });
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
  };

  return (
    <div className="relative z-[1000] w-64">
      <Autocomplete
        defaultItems={results}
        inputValue={query}
        placeholder="Пошук міста або адреси..."
        size="sm"
        startContent={
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
        }
        variant="bordered"
        onInputChange={handleInputChange}
        onSelectionChange={(key) => {
          if (key) {
            const result = results.find((_, index) => index.toString() === key);

            if (result) {
              handleLocationSelect(result);
            }
          }
        }}
      >
        {(result) => (
          <AutocompleteItem
            key={results.indexOf(result)}
            startContent={
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
                  d="M15 11a3 3 0 11-6 0 3 3 0 616 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            }
            textValue={result.label}
          >
            {result.label}
          </AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
};

export default MapLocationSearch;
