# AGENTS.md

Guidance for AI agents working in this repository.

## What this repo is

`@duckarchive/map` — a React + Leaflet component (`GeoDuckMap`) that renders an
interactive historical map of Ukrainian lands, plus the curated GeoJSON dataset it
consumes and the Node scripts used to build that dataset.

Two deliverables live side by side:

1. **The library** (`GeoDuckMap/` → `dist/`) — published from GitHub (not npm registry).
2. **The data** (`geojson/`) — served at runtime over HTTP from
   `raw.githubusercontent.com/duckarchive/map/refs/heads/main/geojson`, *not* bundled.

## Layout

| Path | Purpose |
| --- | --- |
| `GeoDuckMap/` | Library source. `index.tsx` is the package entry (`vite.config.ts` points its lib entry at the directory). |
| `demo/` | Standalone Vite app used as the dev playground and deployed to GitHub Pages. |
| `geojson/countries/<year>.geojson` | Country-level (admin level 1) borders per snapshot year. |
| `geojson/states/<year>.geojson` | State/uyezd-level (admin levels 2–3) borders per snapshot year. |
| `geojson/ukraine.geojson` | Modern Ukraine outline overlay. |
| `scripts/` | One-off `tsx` data-pipeline scripts (fetch, merge, filter, translate, minify). Not part of the published bundle. |
| `dist/` | **Committed build output.** See "Release flow". |
| `translations.csv` | Round-trip file for toponym translation (`extract-translations` → edit → `apply-translations`). |

## Commands

Package manager is **pnpm** (see `pnpm-workspace.yaml`, `.npmrc`; CI uses pnpm 10 / Node 20).

```bash
pnpm run build:lib   # build the library into dist/ + emit .d.ts (run this before dev!)
pnpm run dev         # demo dev server (demo/)
pnpm run build       # build the demo (what CI deploys)
pnpm run preview     # preview the built demo
```

There are no tests, no linter, and no typecheck script. `build:lib` runs `tsc
--emitDeclarationOnly`, so it is the de-facto typecheck for the library — run it after
changing `GeoDuckMap/`.

Data scripts run individually, e.g. `pnpm run fetch-ohm-borders`, `pnpm run merge`,
`pnpm run minify`. They read/write `geojson/` in place — inspect a script before running
it and check `git diff` afterwards.

### Gotcha: the demo consumes `dist/`, not source

`demo/src/Demo.tsx` imports `../../` (resolved through `package.json` → `dist/index.js`)
and `../../dist/LocationMarker` for types. **Editing `GeoDuckMap/*.tsx` has no effect on
`pnpm run dev` until you re-run `pnpm run build:lib`.** There is no dev alias.

## Architecture

`GeoDuckMap` (`GeoDuckMap/index.tsx`) is a thin `MapContainer` wrapper. Everything else is
a child component that talks to the map through react-leaflet hooks (`useMap`,
`useMapEvents`).

**Static vs. dynamic mode** is decided by the presence of `onPositionChange`:

- no callback → `STATIC` map options (dragging/zoom/scroll disabled) and *all* `positions`
  are rendered as read-only markers;
- callback present → `DEFAULT` options and only `positions[0]` is rendered, as a draggable
  "picker" marker (click sets position, Ctrl+scroll resizes its radius).

Consumers can override any of this via `...mapContainerProps`, which is spread last.

Component map:

- `LocationMarker.tsx` — splits into `StaticLocationMarker` / `DynamicLocationMarker`.
  `MarkerValue` is a positional tuple: `[lat, lng, radius?, label?, iconName?]`.
  A non-zero radius renders a `Circle`; `iconName` keys into `Markers.tsx`.
- `MarkersCluster.tsx` — used instead of one `LocationMarker` per position when a read-only
  map gets more than `clusterThreshold` (default 20) positions. Groups markers into a
  screen-space grid (`CELL_SIZE` px) at the current zoom and skips anything outside the
  padded viewport, so layer count tracks the viewport rather than the dataset. Zooming in
  splits groups; clicking one fits the map to its members. A clustered map is forced into
  `DEFAULT` (interactive) options because grouping is meaningless without zoom.
- `Markers.tsx` — `L.divIcon` registry (`pinIcon`, `christChurchIcon`, …) built from inline
  SVG using `fill="currentColor"`, so icon color inherits from the consumer's theme.
- `HistoricalLayers.tsx` — renders the countries + states GeoJSON layers, owns hover state,
  and derives feature colors from `admin_level_1_ID` (id `22` = Ukraine → gold).
- `useMapData.ts` — hardcoded lists of available snapshot years. Countries resolve to the
  *closest year ≤ requested*; states require an *exact* year match (`isStrict`). Fetched
  with SWR, all revalidation disabled.
- `MapLocationSearch.tsx` — OSM geosearch autocomplete, 300 ms debounce.
- `YearSelect.tsx` — year input + era presets, valid range 1500–1991.
- `Tooltip.tsx` — fixed bottom-left card showing hovered admin levels 1/2/3.
- `useStopPropagation.tsx` — attach to any overlay control so clicks don't reach the map.

Overlay controls are plain absolutely-positioned React nodes using Leaflet's
`leaflet-top/-left/-right/-bottom` + `leaflet-control` classes — not `L.Control` instances.

## Conventions

- **Ukrainian** for all user-facing strings; English for code, comments and commits.
- Styling is Tailwind + HeroUI. HeroUI packages are *optional* peer deps — keep imports
  granular (`@heroui/button`, not a barrel) and add anything new to the `external` list in
  `vite.config.ts`, otherwise it gets bundled into `dist/`.
- Function components with `React.FC`, default export per file, `memo`/`useCallback` around
  anything Leaflet re-renders. Set `displayName` on `memo`/`forwardRef` components.
- Keep new heavy runtime deps out: the only real `dependency` is `leaflet-geosearch`. Turf
  is dev-only, used by `scripts/`.
- Commit messages: `feat: `, `fix: `, `docs: `, `release: ` with a capitalized summary.

## Release flow

`preversion` runs `build:lib`, stages `dist/`, and commits it as
`release: Build lib for new version`. So:

- `dist/` **is committed on purpose** — don't gitignore it, and don't hand-edit it.
- Cutting a release is `npm version <patch|minor|major>`; the build/commit happens
  automatically.
- Pushing to `main` deploys the demo to GitHub Pages
  (`.github/workflows/deploy-demo.yml`).
- Because GeoJSON is fetched from `main` on `raw.githubusercontent.com`, **data edits only
  reach users after they are pushed to `main`** — a local `geojson/` change is invisible to
  the running app.
