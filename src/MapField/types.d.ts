interface OverpassResponse {
  elements: Array<{
    type: string;
    id: number;
    lat?: number;
    lon?: number;
    members?: Array<{
      type: string;
      ref: number;
      role: string;
    }>;
    tags?: Record<string, string>;
  }>;
  generator?: string;
  osm3s?: {
    timestamp_osm_base: string;
    copyright: string;
  };
  version?: string;
}
