import { jsxs as k, Fragment as S, jsx as o } from "react/jsx-runtime";
import { useMap as D, useMapEvents as T, Marker as U, Circle as Y, GeoJSON as N, MapContainer as Z, TileLayer as G } from "react-leaflet";
import H, { useEffect as x, useRef as K, memo as $, useState as v, useCallback as C, useMemo as E, forwardRef as q } from "react";
import J, { DomEvent as Q } from "leaflet";
import { OpenStreetMapProvider as X } from "leaflet-geosearch";
import { Autocomplete as ee, AutocompleteItem as te } from "@heroui/autocomplete";
import { Spinner as oe } from "@heroui/spinner";
import I from "swr";
import { Card as ne, CardBody as re } from "@heroui/card";
import { Button as le } from "@heroui/button";
import { Input as se } from "@heroui/input";
const ae = '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="0" viewBox="0 0 512 512"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 48c-79.5 0-144 61.39-144 137 0 87 96 224.87 131.25 272.49a15.77 15.77 0 0 0 25.5 0C304 409.89 400 272.07 400 185c0-75.61-64.5-137-144-137z"/><circle cx="256" cy="192" r="48" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>', L = ({
  value: e,
  onChange: t
}) => {
  const s = !t, r = D();
  T({
    click(n) {
      if (!n.latlng || s) return;
      const { lat: i, lng: d } = n.latlng;
      t == null || t([i, d, e[2] || 0]);
    }
  }), x(() => {
    if (s) return;
    const n = (p) => {
      if (p.ctrlKey) {
        p.preventDefault(), p.stopPropagation(), p.stopImmediatePropagation();
        const h = p.deltaY, y = 100, l = 100, u = 1e4;
        let m = e[2] || 0;
        h < 0 ? m = Math.min((e[2] || 0) + y, u) : m = Math.max((e[2] || 0) - y, l), m !== e[2] && (t == null || t([e[0], e[1], m]));
      }
    }, i = (p) => {
      p.key === "Control" && r.scrollWheelZoom.disable();
    }, d = (p) => {
      p.key === "Control" && r.scrollWheelZoom.enable();
    }, f = r.getContainer();
    return f.addEventListener("wheel", n, { passive: !1, capture: !0 }), document.addEventListener("keydown", i), document.addEventListener("keyup", d), () => {
      f.removeEventListener("wheel", n, { capture: !0 }), document.removeEventListener("keydown", i), document.removeEventListener("keyup", d), r.scrollWheelZoom.enable();
    };
  }, [s, r, e, t]);
  const a = H.useMemo(() => J.divIcon({
    html: ae,
    className: "io5-icon",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  }), []);
  return e ? /* @__PURE__ */ k(S, { children: [
    /* @__PURE__ */ o(U, { position: e, icon: a }),
    e[2] && e[2] > 0 && /* @__PURE__ */ o(
      Y,
      {
        center: e,
        radius: e[2],
        pathOptions: {
          color: "currentColor",
          fillColor: "currentColor",
          fillOpacity: 0.2,
          weight: 0
        }
      }
    )
  ] }) : null;
}, P = () => {
  const e = K(null);
  return x(() => {
    e.current && Q.disableClickPropagation(e.current);
  }, [e.current]), e;
}, ce = () => /* @__PURE__ */ o(
  "svg",
  {
    className: "w-4 h-4 text-gray-400",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
    children: /* @__PURE__ */ o(
      "path",
      {
        d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2
      }
    )
  }
), ie = () => /* @__PURE__ */ k(
  "svg",
  {
    className: "w-4 h-4 text-gray-400 flex-shrink-0",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
    children: [
      /* @__PURE__ */ o(
        "path",
        {
          d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 2
        }
      ),
      /* @__PURE__ */ o(
        "path",
        {
          d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 2
        }
      )
    ]
  }
), V = $(({ onSelect: e }) => {
  const [t, s] = v(""), [r, a] = v([]), n = P(), i = D(), d = new X({
    params: {
      "accept-language": "ua",
      countrycodes: "ua,pl,by,ru,ro,md,tr",
      limit: 5,
      email: "admin@duckarchive.com"
    }
  }), f = C(
    async (l) => {
      if (!l.trim()) {
        a([]);
        return;
      }
      try {
        const u = await d.search({ query: l });
        a(u);
      } catch {
        a([]);
      }
    },
    [d]
  );
  x(() => {
    const l = setTimeout(() => {
      f(t);
    }, 300);
    return () => clearTimeout(l);
  }, [t]);
  const p = (l) => {
    s(l.label), i.setView([l.y, l.x], 15), i.fire("geosearch/showlocation", {
      location: l,
      marker: null
    }), e == null || e([l.y, l.x]);
  };
  return /* @__PURE__ */ o(
    "div",
    {
      ref: n,
      className: "absolute leaflet-top leaflet-left",
      children: /* @__PURE__ */ o(
        ee,
        {
          "aria-label": "Пошук за сучасною назвою",
          className: "leaflet-control w-auto bg-background rounded-xl shadow text-foreground",
          defaultItems: r,
          inputValue: t,
          listboxProps: {
            emptyContent: "Нічого не знайдено. Уточніть свій запит."
          },
          placeholder: "Пошук за сучасною назвою",
          startContent: /* @__PURE__ */ o(ce, {}),
          variant: "bordered",
          onClick: (l) => l.stopPropagation(),
          onInputChange: (l) => {
            s(l);
          },
          onMouseDown: (l) => l.stopPropagation(),
          onSelectionChange: (l) => {
            if (l) {
              const u = r[l];
              u && p(u);
            }
          },
          children: (l) => /* @__PURE__ */ o(
            te,
            {
              startContent: /* @__PURE__ */ o(ie, {}),
              textValue: l.label,
              children: l.label
            },
            r.indexOf(l)
          )
        }
      )
    }
  );
});
V.displayName = "MapLocationSearch";
const c = "https://raw.githubusercontent.com/duckarchive/map/refs/heads/main/geojson", ue = [
  { year: 1500, url: `${c}/countries/1500.geojson` },
  { year: 1530, url: `${c}/countries/1530.geojson` },
  { year: 1600, url: `${c}/countries/1600.geojson` },
  { year: 1650, url: `${c}/countries/1650.geojson` },
  { year: 1700, url: `${c}/countries/1700.geojson` },
  { year: 1715, url: `${c}/countries/1715.geojson` },
  { year: 1783, url: `${c}/countries/1783.geojson` },
  { year: 1800, url: `${c}/countries/1800.geojson` },
  { year: 1815, url: `${c}/countries/1815.geojson` },
  { year: 1880, url: `${c}/countries/1880.geojson` },
  { year: 1900, url: `${c}/countries/1900.geojson` },
  { year: 1914, url: `${c}/countries/1914.geojson` },
  { year: 1920, url: `${c}/countries/1920.geojson` },
  { year: 1930, url: `${c}/countries/1930.geojson` },
  { year: 1938, url: `${c}/countries/1938.geojson` },
  { year: 1945, url: `${c}/countries/1945.geojson` },
  { year: 1960, url: `${c}/countries/1960.geojson` },
  { year: 1991, url: `${c}/countries/1991.geojson` }
], de = [
  { year: 1897, url: `${c}/states/1897.geojson` },
  { year: 1914, url: `${c}/states/1914.geojson` },
  { year: 1937, url: `${c}/states/1937.geojson` },
  { year: 1945, url: `${c}/states/1945.geojson` },
  { year: 1991, url: `${c}/states/1991.geojson` }
], O = (e, t, s = !1) => {
  if (s) {
    const a = t.find(({ year: n }) => n === e);
    return a ? a.url : null;
  }
  const r = t.filter(({ year: a }) => a > 0 && a <= e).sort((a, n) => n.year - a.year);
  return r.length > 0 ? r[0].url : null;
}, _ = (e) => fetch(e).then((t) => t.json()), pe = (e) => {
  const [t, s] = v(e), r = O(t, ue), {
    data: a,
    isLoading: n,
    isValidating: i
  } = I(r, _, {
    revalidateOnFocus: !1,
    revalidateOnReconnect: !1,
    refreshWhenHidden: !1,
    refreshWhenOffline: !1
  }), d = O(t, de, !0), {
    data: f,
    isLoading: p,
    isValidating: h
  } = I(d, _, {
    revalidateOnFocus: !1,
    revalidateOnReconnect: !1,
    refreshWhenHidden: !1,
    refreshWhenOffline: !1
  }), y = E(
    () => a || null,
    [a]
  ), l = E(
    () => f || null,
    [f]
  );
  return {
    countries: y,
    states: l,
    updateYear: (m) => {
      s(m);
    },
    isLoading: n || p || i || h
  };
}, me = ({ level1: e, level2: t, level3: s }) => /* @__PURE__ */ o("div", { className: "absolute leaflet-bottom leaflet-left", children: /* @__PURE__ */ o(ne, { className: "leaflet-control max-w-sm pointer-events-none rounded-xl", children: /* @__PURE__ */ o(re, { className: "py-2", children: /* @__PURE__ */ k("div", { className: "flex flex-col gap-0", children: [
  s && /* @__PURE__ */ o("p", { className: "text-large", children: s }),
  t && /* @__PURE__ */ o("p", { className: "text-small text-default-500", children: t }),
  e && /* @__PURE__ */ o("p", { className: "text-small text-default-500", children: e })
] }) }) }) }), fe = [
  { value: 1897, label: "Російська Імперія" },
  { value: 1914, label: "WWI" },
  { value: 1937, label: "Перед WWII" },
  { value: 1945, label: "Після WWII" },
  { value: 1991, label: "Незалежність" }
], ge = (e) => {
  const t = parseInt(e, 10);
  return /^\d{4}$/.test(e) && t >= 1500 && t <= 1991;
}, he = ({ value: e, onChange: t }) => {
  const [s, r] = v(e.toString()), [a, n] = v(!1), [i, d] = v(!1), f = P(), p = (u) => {
    const m = u.replace(/\D/g, "").slice(0, 4);
    if (r(m), m.length === 4) {
      const g = ge(m);
      d(!g), g && t(parseInt(m, 10));
    } else
      d(!1);
  }, h = (u) => {
    r(u.toString()), t(u), n(!1), d(!1);
  };
  return /* @__PURE__ */ o("div", { ref: f, className: "absolute leaflet-top leaflet-right", children: /* @__PURE__ */ k("div", { className: "leaflet-control bg-background rounded-xl shadow", children: [
    /* @__PURE__ */ o(
      se,
      {
        classNames: {
          inputWrapper: "bg-background relative",
          input: "text-sm text-foreground"
        },
        errorMessage: i ? "Введіть рік від 1600 до 2025" : "",
        isInvalid: i,
        placeholder: "1897",
        type: "text",
        value: s,
        variant: "bordered",
        onBlur: () => {
          setTimeout(() => n(!1), 150);
        },
        onFocus: () => {
          n(!0);
        },
        onValueChange: p
      }
    ),
    a && /* @__PURE__ */ o("div", { className: "flex flex-col gap-1 p-2", children: fe.map((u) => /* @__PURE__ */ k(
      le,
      {
        className: "text-xs justify-start",
        color: "default",
        size: "sm",
        variant: e === u.value ? "flat" : "bordered",
        onPress: () => h(u.value),
        children: [
          u.value,
          " - ",
          u.label
        ]
      },
      u.value
    )) })
  ] }) });
}, z = [
  "green",
  "darkblue",
  "purple",
  "orange",
  "blue",
  "red",
  "yellow"
], ye = (e) => {
  var r;
  const t = ((r = e.properties) == null ? void 0 : r.admin_level_1_ID) || e.id || 0;
  if (t === 22)
    return "gold";
  const s = t % z.length;
  return z[s];
}, b = (e, t, s = 1) => {
  const r = e ? ye(e) : "gray";
  return {
    color: r,
    fillColor: r,
    weight: s,
    opacity: t ? 1 : 0.5,
    fillOpacity: t ? 0.1 : 0,
    interactive: !0
  };
}, F = $(
  q(
    ({ data: e, onEachFeature: t }, s) => e ? /* @__PURE__ */ o(
      N,
      {
        ref: s,
        data: e,
        style: (r) => b(r, !1, 0),
        onEachFeature: t
      }
    ) : null
  )
);
F.displayName = "CountriesLayer";
const A = $(
  ({ data: e, onEachFeature: t }) => e ? /* @__PURE__ */ o(
    N,
    {
      data: e,
      style: (s) => b(s, !1, 2),
      onEachFeature: t
    }
  ) : null
);
A.displayName = "StatesLayer";
const ve = ({ year: e, onYearChange: t }) => {
  var l, u, m;
  const [s, r] = v(null), [a, n] = v(null), { countries: i, states: d, updateYear: f, isLoading: p } = pe(e);
  x(() => {
    f(e), r(null), n(null);
  }, [e]);
  const h = C(
    (g, j) => {
      j.on({
        mouseover: (w) => {
          r(g), w.target.setStyle(b(g, !1, 1));
        },
        mouseout: (w) => {
          r(null), w.target.setStyle(b(g, !1, 0));
        }
      });
    },
    []
  ), y = C(
    (g, j) => {
      j.on({
        mouseover: (w) => {
          n(g);
          const M = i == null ? void 0 : i.features.find(
            (B) => {
              var W, R;
              return ((W = B.id) == null ? void 0 : W.toString()) === ((R = g.properties) == null ? void 0 : R.admin_level_1_ID.toString());
            }
          );
          M && r(M), w.target.setStyle(b(g, !0, 4));
        },
        mouseout: (w) => {
          n(null), w.target.setStyle(b(g, !1, 2));
        }
      });
    },
    [i]
  );
  return /* @__PURE__ */ k(S, { children: [
    p ? /* @__PURE__ */ o("div", { className: "absolute z-[1001] top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm bg-white/50", children: /* @__PURE__ */ o(oe, {}) }) : /* @__PURE__ */ k(S, { children: [
      i && /* @__PURE__ */ o(
        F,
        {
          data: i,
          onEachFeature: h
        }
      ),
      d && /* @__PURE__ */ o(A, { data: d, onEachFeature: y })
    ] }),
    t && /* @__PURE__ */ o(
      he,
      {
        value: e,
        onChange: t
      }
    ),
    (s || a) && /* @__PURE__ */ o(
      me,
      {
        level1: (l = s == null ? void 0 : s.properties) == null ? void 0 : l.admin_level_1,
        level2: (u = a == null ? void 0 : a.properties) == null ? void 0 : u.admin_level_2,
        level3: (m = a == null ? void 0 : a.properties) == null ? void 0 : m.admin_level_3
      }
    )
  ] });
}, ke = "https://raw.githubusercontent.com/duckarchive/map/refs/heads/main/geojson/ukraine.geojson", we = (e) => fetch(e).then((t) => t.json()), be = () => {
  const { data: e } = I(
    ke,
    we,
    {
      revalidateOnFocus: !1,
      revalidateOnReconnect: !1,
      refreshWhenHidden: !1,
      refreshWhenOffline: !1
    }
  );
  return e && /* @__PURE__ */ o(
    N,
    {
      data: e,
      style: {
        color: "gray",
        weight: 4,
        fillColor: "transparent",
        opacity: 0.4,
        interactive: !1
      }
    }
  );
}, xe = {
  zoomControl: !1,
  doubleClickZoom: !1,
  closePopupOnClick: !1,
  dragging: !1,
  zoomSnap: 0,
  zoomDelta: 1,
  trackResize: !1,
  touchZoom: !1,
  scrollWheelZoom: !1
}, je = {
  zoomControl: !1,
  scrollWheelZoom: !0
}, _e = ({
  positions: e,
  onPositionChange: t,
  tileLayerProps: s,
  year: r = 1897,
  onYearChange: a,
  hideLayers: n,
  ...i
}) => /* @__PURE__ */ k(
  Z,
  {
    worldCopyJump: !0,
    center: [49.0139, 31.2858],
    style: { height: "100%", width: "100%" },
    zoom: 6,
    ...i,
    ...t ? je : xe,
    children: [
      /* @__PURE__ */ o(
        G,
        {
          className: "grayscale",
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          ...s
        }
      ),
      !(n != null && n.ukraineLayer) && /* @__PURE__ */ o(be, {}),
      !(n != null && n.searchInput) && /* @__PURE__ */ o(V, { onSelect: t }),
      !(n != null && n.historicalLayers) && /* @__PURE__ */ o(ve, { year: r, onYearChange: a }),
      !(n != null && n.locationMarker) && (t ? /* @__PURE__ */ o(L, { value: e[0], onChange: t }) : e.map((d, f) => /* @__PURE__ */ o(L, { value: d }, f)))
    ]
  }
);
export {
  _e as default
};
//# sourceMappingURL=index.js.map
