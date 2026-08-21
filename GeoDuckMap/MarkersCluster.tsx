import { DivIcon, latLngBounds } from "leaflet";
import type { LatLngBounds, Map as LeafletMap } from "leaflet";
import React, { useCallback, useMemo, useState } from "react";
import { Marker, Tooltip, useMap, useMapEvents } from "react-leaflet";

import LocationMarker, { MarkerValue } from "./LocationMarker";

// Grid cell size in screen pixels: markers closer than this on screen are grouped.
const CELL_SIZE = 72;
// How far outside the viewport markers are still rendered (share of viewport size).
const VIEWPORT_PADDING = 0.25;
// Labels listed in a group tooltip before it collapses into "…and N more".
const TOOLTIP_LABELS_LIMIT = 5;

interface Cluster {
  key: string;
  lat: number;
  lng: number;
  items: MarkerValue[];
}

interface View {
  zoom: number;
  bounds: LatLngBounds;
}

const pluralize = (count: number): string => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return "позначка";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "позначки";

  return "позначок";
};

const getIconSize = (count: number): number => {
  if (count < 10) return 32;
  if (count < 100) return 40;
  if (count < 1000) return 48;

  return 56;
};

const iconCache = new Map<number, DivIcon>();

const getClusterIcon = (count: number): DivIcon => {
  const cached = iconCache.get(count);

  if (cached) return cached;

  const size = getIconSize(count);
  const label = count > 999 ? `${Math.floor(count / 1000)}k+` : `${count}`;
  const icon = new DivIcon({
    html: `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;border-radius:9999px;background-color:currentColor;box-shadow:0 1px 4px rgba(0,0,0,0.4);opacity:0.9"><span style="color:#fff;text-shadow:0 0 5px #000;font-size:${
      size / 3
    }px;font-weight:600;line-height:1">${label}</span></div>`,
    className: "geoduck-cluster-icon",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

  iconCache.set(count, icon);

  return icon;
};

/**
 * Groups markers into a screen-space grid at the current zoom level, so the number of
 * Leaflet layers stays proportional to the viewport instead of to `positions.length`.
 * Markers outside the (padded) viewport are skipped entirely.
 */
const buildClusters = (
  positions: MarkerValue[],
  map: LeafletMap,
  { zoom, bounds }: View
): Cluster[] => {
  const visibleBounds = bounds.pad(VIEWPORT_PADDING);
  const cells = new Map<string, Cluster & { sumX: number; sumY: number }>();

  for (const position of positions) {
    const [lat, lng] = position;

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
    if (!visibleBounds.contains([lat, lng])) continue;

    const { x, y } = map.project([lat, lng], zoom);
    const key = `${Math.floor(x / CELL_SIZE)}:${Math.floor(y / CELL_SIZE)}`;
    const cell = cells.get(key);

    if (cell) {
      cell.items.push(position);
      cell.sumX += x;
      cell.sumY += y;
    } else {
      cells.set(key, { key, lat, lng, items: [position], sumX: x, sumY: y });
    }
  }

  return Array.from(cells.values()).map((cell) => {
    if (cell.items.length === 1) return cell;

    const center = map.unproject(
      [cell.sumX / cell.items.length, cell.sumY / cell.items.length],
      zoom
    );

    return { ...cell, lat: center.lat, lng: center.lng };
  });
};

interface ClusterMarkerProps {
  cluster: Cluster;
  onExpand: (cluster: Cluster) => void;
}

const ClusterMarker: React.FC<ClusterMarkerProps> = ({ cluster, onExpand }) => {
  const { items, lat, lng } = cluster;
  const labels = items
    .map((item) => item[3])
    .filter((label): label is string => Boolean(label));

  return (
    <Marker
      eventHandlers={{ click: () => onExpand(cluster) }}
      icon={getClusterIcon(items.length)}
      position={[lat, lng]}
    >
      <Tooltip direction="top" offset={[0, -getIconSize(items.length) / 2]}>
        <span className="font-semibold">
          {items.length} {pluralize(items.length)}
        </span>
        {labels.slice(0, TOOLTIP_LABELS_LIMIT).map((label, idx) => (
          <div key={idx}>{label}</div>
        ))}
        {labels.length > TOOLTIP_LABELS_LIMIT && (
          <div>…і ще {labels.length - TOOLTIP_LABELS_LIMIT}</div>
        )}
      </Tooltip>
    </Marker>
  );
};

interface MarkersClusterProps {
  positions: MarkerValue[];
  onMarkerClick?: (position: MarkerValue) => void;
}

const MarkersCluster: React.FC<MarkersClusterProps> = ({
  positions,
  onMarkerClick,
}) => {
  const map = useMap();
  const [view, setView] = useState<View>(() => ({
    zoom: map.getZoom(),
    bounds: map.getBounds(),
  }));

  const syncView = useCallback(() => {
    setView({ zoom: map.getZoom(), bounds: map.getBounds() });
  }, [map]);

  useMapEvents({
    zoomend: syncView,
    moveend: syncView,
    resize: syncView,
  });

  const clusters = useMemo(
    () => buildClusters(positions, map, view),
    [positions, map, view]
  );

  // Zooming into a group is what reveals its individual markers.
  const handleExpand = useCallback(
    ({ items, lat, lng }: Cluster) => {
      const bounds = latLngBounds(
        items.map((item) => [item[0], item[1]] as [number, number])
      );
      const isSpread =
        bounds.isValid() && !bounds.getNorthEast().equals(bounds.getSouthWest());

      if (isSpread) {
        map.fitBounds(bounds, { padding: [48, 48] });
      } else {
        map.setView([lat, lng], Math.min(map.getZoom() + 2, map.getMaxZoom()));
      }
    },
    [map]
  );

  return (
    <>
      {clusters.map((cluster) =>
        cluster.items.length === 1 ? (
          <LocationMarker
            key={cluster.key}
            value={cluster.items[0]}
            onClick={onMarkerClick}
          />
        ) : (
          <ClusterMarker
            key={cluster.key}
            cluster={cluster}
            onExpand={handleExpand}
          />
        )
      )}
    </>
  );
};

export default MarkersCluster;
