interface Collection {
    year: number;
    label?: string;
    url: string;
}
export declare const countryCollections: Collection[];
export declare const stateCollections: Collection[];
interface MapData {
    countries: GeoJSON.FeatureCollection | null;
    states: GeoJSON.FeatureCollection | null;
    updateYear: (year: number) => void;
    isLoading: boolean;
}
declare const useMapData: (defaultYear: number) => MapData;
export default useMapData;
//# sourceMappingURL=useMapData.d.ts.map