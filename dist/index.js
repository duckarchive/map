import { jsx as n, jsxs as v, Fragment as _ } from "react/jsx-runtime";
import "leaflet-defaulticon-compatibility";
import { useMapEvents as B, Marker as U, useMap as T, GeoJSON as I, MapContainer as A, TileLayer as H } from "react-leaflet";
import { useRef as G, useEffect as $, memo as N, useState as g, useCallback as w, useMemo as O, forwardRef as q } from "react";
import { OpenStreetMapProvider as J } from "leaflet-geosearch";
import { Autocomplete as K, AutocompleteItem as Z } from "@heroui/autocomplete";
import { DomEvent as Q } from "leaflet";
import { Spinner as X } from "@heroui/spinner";
import k from "swr";
import { Card as ee, CardBody as te } from "@heroui/card";
import { Button as oe } from "@heroui/button";
import { Input as ne } from "@heroui/input";
const re = ({ value: e, onChange: t }) => (B({
  click(a) {
    if (!a.latlng) return;
    const { lat: r, lng: o } = a.latlng;
    t([r, o]);
  }
}), e ? /* @__PURE__ */ n(U, { position: e }) : null), F = () => {
  const e = G(null);
  return $(() => {
    e.current && Q.disableClickPropagation(e.current);
  }, [e.current]), e;
}, ae = () => /* @__PURE__ */ n(
  "svg",
  {
    className: "w-4 h-4 text-gray-400",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
    children: /* @__PURE__ */ n(
      "path",
      {
        d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2
      }
    )
  }
), le = () => /* @__PURE__ */ v(
  "svg",
  {
    className: "w-4 h-4 text-gray-400 flex-shrink-0",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
    children: [
      /* @__PURE__ */ n(
        "path",
        {
          d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 2
        }
      ),
      /* @__PURE__ */ n(
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
), L = N(() => {
  const [e, t] = g(""), [a, r] = g([]), o = F(), c = T(), d = new J({
    params: {
      "accept-language": "ua",
      countrycodes: "ua,pl,by,ru,ro,md,tr",
      limit: 5,
      email: "admin@duckarchive.com"
    }
  }), i = w(
    async (l) => {
      if (!l.trim()) {
        r([]);
        return;
      }
      try {
        const f = await d.search({ query: l });
        r(f);
      } catch {
        r([]);
      }
    },
    [d]
  );
  $(() => {
    const l = setTimeout(() => {
      i(e);
    }, 300);
    return () => clearTimeout(l);
  }, [e]);
  const p = (l) => {
    t(l.label), c.setView([l.y, l.x], 15), c.fire("geosearch/showlocation", {
      location: l,
      marker: null
    });
  };
  return /* @__PURE__ */ n(
    "div",
    {
      ref: o,
      className: "absolute leaflet-top leaflet-left",
      children: /* @__PURE__ */ n(
        K,
        {
          "aria-label": "Пошук за сучасною назвою",
          className: "leaflet-control w-auto bg-white rounded-xl shadow",
          defaultItems: a,
          inputValue: e,
          listboxProps: {
            emptyContent: "Нічого не знайдено. Уточніть свій запит."
          },
          placeholder: "Пошук за сучасною назвою",
          startContent: /* @__PURE__ */ n(ae, {}),
          variant: "bordered",
          onClick: (l) => l.stopPropagation(),
          onInputChange: (l) => {
            t(l);
          },
          onMouseDown: (l) => l.stopPropagation(),
          onSelectionChange: (l) => {
            if (l) {
              const f = a[l];
              f && p(f);
            }
          },
          children: (l) => /* @__PURE__ */ n(
            Z,
            {
              startContent: /* @__PURE__ */ n(le, {}),
              textValue: l.label,
              children: l.label
            },
            a.indexOf(l)
          )
        }
      )
    }
  );
});
L.displayName = "MapLocationSearch";
const s = "https://raw.githubusercontent.com/duckarchive/map/refs/heads/main/geojson", se = [
  { year: 1500, url: `${s}/countries/1500.geojson` },
  { year: 1530, url: `${s}/countries/1530.geojson` },
  { year: 1600, url: `${s}/countries/1600.geojson` },
  { year: 1650, url: `${s}/countries/1650.geojson` },
  { year: 1700, url: `${s}/countries/1700.geojson` },
  { year: 1715, url: `${s}/countries/1715.geojson` },
  { year: 1783, url: `${s}/countries/1783.geojson` },
  { year: 1800, url: `${s}/countries/1800.geojson` },
  { year: 1815, url: `${s}/countries/1815.geojson` },
  { year: 1880, url: `${s}/countries/1880.geojson` },
  { year: 1900, url: `${s}/countries/1900.geojson` },
  { year: 1914, url: `${s}/countries/1914.geojson` },
  { year: 1920, url: `${s}/countries/1920.geojson` },
  { year: 1930, url: `${s}/countries/1930.geojson` },
  { year: 1938, url: `${s}/countries/1938.geojson` },
  { year: 1945, url: `${s}/countries/1945.geojson` },
  { year: 1960, url: `${s}/countries/1960.geojson` },
  { year: 1991, url: `${s}/countries/1991.geojson` }
], ce = [
  { year: 1897, url: `${s}/states/1897.geojson` },
  { year: 1914, url: `${s}/states/1914.geojson` },
  { year: 1937, url: `${s}/states/1937.geojson` },
  { year: 1945, url: `${s}/states/1945.geojson` },
  { year: 1991, url: `${s}/states/1991.geojson` }
], P = (e, t, a = !1) => {
  if (a) {
    const o = t.find(({ year: c }) => c === e);
    return o ? o.url : null;
  }
  const r = t.filter(({ year: o }) => o > 0 && o <= e).sort((o, c) => c.year - o.year);
  return r.length > 0 ? r[0].url : null;
}, E = (e) => fetch(e).then((t) => t.json()), ie = (e) => {
  const [t, a] = g(e), r = P(t, se), {
    data: o,
    isLoading: c,
    isValidating: d
  } = k(r, E, {
    revalidateOnFocus: !1,
    revalidateOnReconnect: !1,
    refreshWhenHidden: !1,
    refreshWhenOffline: !1
  }), i = P(t, ce, !0), {
    data: p,
    isLoading: j,
    isValidating: b
  } = k(i, E, {
    revalidateOnFocus: !1,
    revalidateOnReconnect: !1,
    refreshWhenHidden: !1,
    refreshWhenOffline: !1
  }), l = O(
    () => o || null,
    [o]
  ), f = O(
    () => p || null,
    [p]
  );
  return {
    countries: l,
    states: f,
    updateYear: (m) => {
      a(m);
    },
    isLoading: c || j || d || b
  };
}, ue = ({ level1: e, level2: t, level3: a }) => /* @__PURE__ */ n("div", { className: "absolute leaflet-bottom leaflet-left", children: /* @__PURE__ */ n(ee, { className: "leaflet-control max-w-sm pointer-events-none rounded-xl", children: /* @__PURE__ */ n(te, { className: "py-2", children: /* @__PURE__ */ v("div", { className: "flex flex-col gap-0", children: [
  a && /* @__PURE__ */ n("p", { className: "text-large", children: a }),
  t && /* @__PURE__ */ n("p", { className: "text-small text-default-500", children: t }),
  e && /* @__PURE__ */ n("p", { className: "text-small text-default-500", children: e })
] }) }) }) }), de = [
  { value: 1897, label: "Російська Імперія" },
  { value: 1914, label: "WWI" },
  { value: 1937, label: "Перед WWII" },
  { value: 1945, label: "Після WWII" },
  { value: 1991, label: "Незалежність" }
], pe = (e) => {
  const t = parseInt(e, 10);
  return /^\d{4}$/.test(e) && t >= 1500 && t <= 1991;
}, fe = ({ value: e, onChange: t }) => {
  const [a, r] = g(e.toString()), [o, c] = g(!1), [d, i] = g(!1), p = F(), j = (u) => {
    const m = u.replace(/\D/g, "").slice(0, 4);
    if (r(m), m.length === 4) {
      const S = pe(m);
      i(!S), S && t(parseInt(m, 10));
    } else
      i(!1);
  }, b = (u) => {
    r(u.toString()), t(u), c(!1), i(!1);
  };
  return /* @__PURE__ */ n("div", { ref: p, className: "absolute leaflet-top leaflet-right", children: /* @__PURE__ */ v("div", { className: "leaflet-control bg-white rounded-xl shadow", children: [
    /* @__PURE__ */ n(
      ne,
      {
        classNames: {
          inputWrapper: "bg-default-100 relative",
          input: "text-sm"
        },
        errorMessage: d ? "Введіть рік від 1600 до 2025" : "",
        isInvalid: d,
        placeholder: "1897",
        type: "text",
        value: a,
        variant: "bordered",
        onBlur: () => {
          setTimeout(() => c(!1), 150);
        },
        onFocus: () => {
          c(!0);
        },
        onValueChange: j
      }
    ),
    o && /* @__PURE__ */ n("div", { className: "flex flex-col gap-1 p-2", children: de.map((u) => /* @__PURE__ */ v(
      oe,
      {
        className: "text-xs justify-start",
        color: "default",
        size: "sm",
        variant: e === u.value ? "flat" : "bordered",
        onPress: () => b(u.value),
        children: [
          u.value,
          " - ",
          u.label
        ]
      },
      u.value
    )) })
  ] }) });
}, V = [
  "green",
  "darkblue",
  "purple",
  "orange",
  "blue",
  "red",
  "yellow"
], me = (e) => {
  var r;
  const t = ((r = e.properties) == null ? void 0 : r.admin_level_1_ID) || e.id || 0;
  if (t === 22)
    return "gold";
  const a = t % V.length;
  return V[a];
}, C = (e, t, a = 1) => {
  const r = e ? me(e) : "gray";
  return {
    color: r,
    fillColor: r,
    weight: a,
    opacity: t ? 1 : 0.5,
    fillOpacity: t ? 0.1 : 0,
    interactive: !0
  };
}, D = N(
  q(
    ({ data: e, onEachFeature: t }, a) => e ? /* @__PURE__ */ n(
      I,
      {
        ref: a,
        data: e,
        style: (r) => C(r, !1, 0),
        onEachFeature: t
      }
    ) : null
  )
);
D.displayName = "CountriesLayer";
const Y = N(
  ({ data: e, onEachFeature: t }) => e ? /* @__PURE__ */ n(
    I,
    {
      data: e,
      style: (a) => C(a, !1, 2),
      onEachFeature: t
    }
  ) : null
);
Y.displayName = "StatesLayer";
const ge = ({ defaultYear: e }) => {
  var u, m, S;
  const [t, a] = g(null), [r, o] = g(null), [c, d] = g(e), { countries: i, states: p, updateYear: j, isLoading: b } = ie(c);
  $(() => {
    j(c), a(null), o(null);
  }, [c]);
  const l = w(
    (h, x) => {
      x.on({
        mouseover: (y) => {
          a(h), y.target.setStyle(C(h, !1, 1));
        },
        mouseout: (y) => {
          a(null), y.target.setStyle(C(h, !1, 0));
        }
      });
    },
    []
  ), f = w(
    (h, x) => {
      x.on({
        mouseover: (y) => {
          o(h);
          const M = i == null ? void 0 : i.features.find(
            (z) => {
              var W, R;
              return ((W = z.id) == null ? void 0 : W.toString()) === ((R = h.properties) == null ? void 0 : R.admin_level_1_ID.toString());
            }
          );
          M && a(M), y.target.setStyle(C(h, !0, 4));
        },
        mouseout: (y) => {
          o(null), y.target.setStyle(C(h, !1, 2));
        }
      });
    },
    [i]
  );
  return /* @__PURE__ */ v(_, { children: [
    b ? /* @__PURE__ */ n("div", { className: "absolute z-[1001] top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm bg-white/50", children: /* @__PURE__ */ n(X, {}) }) : /* @__PURE__ */ v(_, { children: [
      i && /* @__PURE__ */ n(
        D,
        {
          data: i,
          onEachFeature: l
        }
      ),
      p && /* @__PURE__ */ n(Y, { data: p, onEachFeature: f })
    ] }),
    /* @__PURE__ */ n(
      fe,
      {
        value: c,
        onChange: d
      }
    ),
    (t || r) && /* @__PURE__ */ n(
      ue,
      {
        level1: (u = t == null ? void 0 : t.properties) == null ? void 0 : u.admin_level_1,
        level2: (m = r == null ? void 0 : r.properties) == null ? void 0 : m.admin_level_2,
        level3: (S = r == null ? void 0 : r.properties) == null ? void 0 : S.admin_level_3
      }
    )
  ] });
}, he = "https://raw.githubusercontent.com/duckarchive/map/refs/heads/main/geojson/ukraine.geojson", ye = (e) => fetch(e).then((t) => t.json()), ve = () => {
  const { data: e } = k(
    he,
    ye,
    {
      revalidateOnFocus: !1,
      revalidateOnReconnect: !1,
      refreshWhenHidden: !1,
      refreshWhenOffline: !1
    }
  );
  return e && /* @__PURE__ */ n(
    I,
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
}, Re = ({
  position: e,
  onPositionChange: t,
  tileLayerProps: a,
  defaultYear: r = 1897,
  hideLayers: o,
  ...c
}) => /* @__PURE__ */ v(
  A,
  {
    scrollWheelZoom: !0,
    worldCopyJump: !0,
    center: [49.0139, 31.2858],
    style: { height: "100%", width: "100%" },
    zoom: 6,
    zoomControl: !1,
    ...c,
    children: [
      /* @__PURE__ */ n(
        H,
        {
          className: "grayscale",
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          ...a
        }
      ),
      !(o != null && o.ukraineLayer) && /* @__PURE__ */ n(ve, {}),
      !(o != null && o.searchInput) && /* @__PURE__ */ n(L, {}),
      !(o != null && o.historicalLayers) && /* @__PURE__ */ n(ge, { defaultYear: r }),
      !(o != null && o.locationMarker) && /* @__PURE__ */ n(re, { value: e, onChange: t })
    ]
  }
);
export {
  Re as default
};
//# sourceMappingURL=index.js.map
