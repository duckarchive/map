import { jsxs as k, Fragment as j, jsx as n } from "react/jsx-runtime";
import { useMap as _, useMapEvents as U, Marker as Y, Circle as A, GeoJSON as N, MapContainer as T, TileLayer as G } from "react-leaflet";
import H, { useEffect as x, useRef as K, memo as $, useState as v, useCallback as S, useMemo as R, forwardRef as Z } from "react";
import q, { DomEvent as J } from "leaflet";
import { OpenStreetMapProvider as Q } from "leaflet-geosearch";
import { Autocomplete as X, AutocompleteItem as ee } from "@heroui/autocomplete";
import { Spinner as te } from "@heroui/spinner";
import I from "swr";
import { Card as oe, CardBody as ne } from "@heroui/card";
import { Button as re } from "@heroui/button";
import { Input as le } from "@heroui/input";
const ae = '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="0" viewBox="0 0 512 512"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 48c-79.5 0-144 61.39-144 137 0 87 96 224.87 131.25 272.49a15.77 15.77 0 0 0 25.5 0C304 409.89 400 272.07 400 185c0-75.61-64.5-137-144-137z"/><circle cx="256" cy="192" r="48" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>', se = ({
  value: e,
  onChange: t,
  radius: o,
  onRadiusChange: r
}) => {
  const l = _();
  U({
    click(i) {
      if (!i.latlng) return;
      const { lat: s, lng: f } = i.latlng;
      t == null || t([s, f]);
    }
  }), x(() => {
    if (!r || o === void 0) return;
    const i = (d) => {
      if (d.ctrlKey) {
        d.preventDefault(), d.stopPropagation(), d.stopImmediatePropagation();
        const a = d.deltaY, h = 100, p = 100, g = 1e4;
        let m = o;
        a < 0 ? m = Math.min(o + h, g) : m = Math.max(o - h, p), m !== o && r(m);
      }
    }, s = (d) => {
      d.key === "Control" && l.scrollWheelZoom.disable();
    }, f = (d) => {
      d.key === "Control" && l.scrollWheelZoom.enable();
    }, y = l.getContainer();
    return y.addEventListener("wheel", i, { passive: !1, capture: !0 }), document.addEventListener("keydown", s), document.addEventListener("keyup", f), () => {
      y.removeEventListener("wheel", i, { capture: !0 }), document.removeEventListener("keydown", s), document.removeEventListener("keyup", f), l.scrollWheelZoom.enable();
    };
  }, [l, o, r]);
  const u = H.useMemo(() => q.divIcon({
    html: ae,
    className: "io5-icon",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  }), []);
  return e ? /* @__PURE__ */ k(j, { children: [
    /* @__PURE__ */ n(Y, { position: e, icon: u }),
    o && o > 0 && /* @__PURE__ */ n(
      A,
      {
        center: e,
        radius: o,
        pathOptions: {
          color: "currentColor",
          fillColor: "currentColor",
          fillOpacity: 0.2,
          weight: 0
        }
      }
    )
  ] }) : null;
}, V = () => {
  const e = K(null);
  return x(() => {
    e.current && J.disableClickPropagation(e.current);
  }, [e.current]), e;
}, ce = () => /* @__PURE__ */ n(
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
), ie = () => /* @__PURE__ */ k(
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
), D = $(() => {
  const [e, t] = v(""), [o, r] = v([]), l = V(), u = _(), i = new Q({
    params: {
      "accept-language": "ua",
      countrycodes: "ua,pl,by,ru,ro,md,tr",
      limit: 5,
      email: "admin@duckarchive.com"
    }
  }), s = S(
    async (a) => {
      if (!a.trim()) {
        r([]);
        return;
      }
      try {
        const h = await i.search({ query: a });
        r(h);
      } catch {
        r([]);
      }
    },
    [i]
  );
  x(() => {
    const a = setTimeout(() => {
      s(e);
    }, 300);
    return () => clearTimeout(a);
  }, [e]);
  const f = (a) => {
    t(a.label), u.setView([a.y, a.x], 15), u.fire("geosearch/showlocation", {
      location: a,
      marker: null
    });
  };
  return /* @__PURE__ */ n(
    "div",
    {
      ref: l,
      className: "absolute leaflet-top leaflet-left",
      children: /* @__PURE__ */ n(
        X,
        {
          "aria-label": "Пошук за сучасною назвою",
          className: "leaflet-control w-auto bg-background rounded-xl shadow text-foreground",
          defaultItems: o,
          inputValue: e,
          listboxProps: {
            emptyContent: "Нічого не знайдено. Уточніть свій запит."
          },
          placeholder: "Пошук за сучасною назвою",
          startContent: /* @__PURE__ */ n(ce, {}),
          variant: "bordered",
          onClick: (a) => a.stopPropagation(),
          onInputChange: (a) => {
            t(a);
          },
          onMouseDown: (a) => a.stopPropagation(),
          onSelectionChange: (a) => {
            if (a) {
              const h = o[a];
              h && f(h);
            }
          },
          children: (a) => /* @__PURE__ */ n(
            ee,
            {
              startContent: /* @__PURE__ */ n(ie, {}),
              textValue: a.label,
              children: a.label
            },
            o.indexOf(a)
          )
        }
      )
    }
  );
});
D.displayName = "MapLocationSearch";
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
], L = (e, t, o = !1) => {
  if (o) {
    const l = t.find(({ year: u }) => u === e);
    return l ? l.url : null;
  }
  const r = t.filter(({ year: l }) => l > 0 && l <= e).sort((l, u) => u.year - l.year);
  return r.length > 0 ? r[0].url : null;
}, O = (e) => fetch(e).then((t) => t.json()), pe = (e) => {
  const [t, o] = v(e), r = L(t, ue), {
    data: l,
    isLoading: u,
    isValidating: i
  } = I(r, O, {
    revalidateOnFocus: !1,
    revalidateOnReconnect: !1,
    refreshWhenHidden: !1,
    refreshWhenOffline: !1
  }), s = L(t, de, !0), {
    data: f,
    isLoading: y,
    isValidating: d
  } = I(s, O, {
    revalidateOnFocus: !1,
    revalidateOnReconnect: !1,
    refreshWhenHidden: !1,
    refreshWhenOffline: !1
  }), a = R(
    () => l || null,
    [l]
  ), h = R(
    () => f || null,
    [f]
  );
  return {
    countries: a,
    states: h,
    updateYear: (g) => {
      o(g);
    },
    isLoading: u || y || i || d
  };
}, me = ({ level1: e, level2: t, level3: o }) => /* @__PURE__ */ n("div", { className: "absolute leaflet-bottom leaflet-left", children: /* @__PURE__ */ n(oe, { className: "leaflet-control max-w-sm pointer-events-none rounded-xl", children: /* @__PURE__ */ n(ne, { className: "py-2", children: /* @__PURE__ */ k("div", { className: "flex flex-col gap-0", children: [
  o && /* @__PURE__ */ n("p", { className: "text-large", children: o }),
  t && /* @__PURE__ */ n("p", { className: "text-small text-default-500", children: t }),
  e && /* @__PURE__ */ n("p", { className: "text-small text-default-500", children: e })
] }) }) }) }), fe = [
  { value: 1897, label: "Російська Імперія" },
  { value: 1914, label: "WWI" },
  { value: 1937, label: "Перед WWII" },
  { value: 1945, label: "Після WWII" },
  { value: 1991, label: "Незалежність" }
], he = (e) => {
  const t = parseInt(e, 10);
  return /^\d{4}$/.test(e) && t >= 1500 && t <= 1991;
}, ge = ({ value: e, onChange: t }) => {
  const [o, r] = v(e.toString()), [l, u] = v(!1), [i, s] = v(!1), f = V(), y = (p) => {
    const g = p.replace(/\D/g, "").slice(0, 4);
    if (r(g), g.length === 4) {
      const m = he(g);
      s(!m), m && t(parseInt(g, 10));
    } else
      s(!1);
  }, d = (p) => {
    r(p.toString()), t(p), u(!1), s(!1);
  };
  return /* @__PURE__ */ n("div", { ref: f, className: "absolute leaflet-top leaflet-right", children: /* @__PURE__ */ k("div", { className: "leaflet-control bg-background rounded-xl shadow", children: [
    /* @__PURE__ */ n(
      le,
      {
        classNames: {
          inputWrapper: "bg-background relative",
          input: "text-sm text-foreground"
        },
        errorMessage: i ? "Введіть рік від 1600 до 2025" : "",
        isInvalid: i,
        placeholder: "1897",
        type: "text",
        value: o,
        variant: "bordered",
        onBlur: () => {
          setTimeout(() => u(!1), 150);
        },
        onFocus: () => {
          u(!0);
        },
        onValueChange: y
      }
    ),
    l && /* @__PURE__ */ n("div", { className: "flex flex-col gap-1 p-2", children: fe.map((p) => /* @__PURE__ */ k(
      re,
      {
        className: "text-xs justify-start",
        color: "default",
        size: "sm",
        variant: e === p.value ? "flat" : "bordered",
        onPress: () => d(p.value),
        children: [
          p.value,
          " - ",
          p.label
        ]
      },
      p.value
    )) })
  ] }) });
}, P = [
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
  const o = t % P.length;
  return P[o];
}, b = (e, t, o = 1) => {
  const r = e ? ye(e) : "gray";
  return {
    color: r,
    fillColor: r,
    weight: o,
    opacity: t ? 1 : 0.5,
    fillOpacity: t ? 0.1 : 0,
    interactive: !0
  };
}, F = $(
  Z(
    ({ data: e, onEachFeature: t }, o) => e ? /* @__PURE__ */ n(
      N,
      {
        ref: o,
        data: e,
        style: (r) => b(r, !1, 0),
        onEachFeature: t
      }
    ) : null
  )
);
F.displayName = "CountriesLayer";
const z = $(
  ({ data: e, onEachFeature: t }) => e ? /* @__PURE__ */ n(
    N,
    {
      data: e,
      style: (o) => b(o, !1, 2),
      onEachFeature: t
    }
  ) : null
);
z.displayName = "StatesLayer";
const ve = ({ year: e, onYearChange: t }) => {
  var h, p, g;
  const [o, r] = v(null), [l, u] = v(null), { countries: i, states: s, updateYear: f, isLoading: y } = pe(e);
  x(() => {
    f(e), r(null), u(null);
  }, [e]);
  const d = S(
    (m, C) => {
      C.on({
        mouseover: (w) => {
          r(m), w.target.setStyle(b(m, !1, 1));
        },
        mouseout: (w) => {
          r(null), w.target.setStyle(b(m, !1, 0));
        }
      });
    },
    []
  ), a = S(
    (m, C) => {
      C.on({
        mouseover: (w) => {
          u(m);
          const M = i == null ? void 0 : i.features.find(
            (B) => {
              var W, E;
              return ((W = B.id) == null ? void 0 : W.toString()) === ((E = m.properties) == null ? void 0 : E.admin_level_1_ID.toString());
            }
          );
          M && r(M), w.target.setStyle(b(m, !0, 4));
        },
        mouseout: (w) => {
          u(null), w.target.setStyle(b(m, !1, 2));
        }
      });
    },
    [i]
  );
  return /* @__PURE__ */ k(j, { children: [
    y ? /* @__PURE__ */ n("div", { className: "absolute z-[1001] top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm bg-white/50", children: /* @__PURE__ */ n(te, {}) }) : /* @__PURE__ */ k(j, { children: [
      i && /* @__PURE__ */ n(
        F,
        {
          data: i,
          onEachFeature: d
        }
      ),
      s && /* @__PURE__ */ n(z, { data: s, onEachFeature: a })
    ] }),
    t && /* @__PURE__ */ n(
      ge,
      {
        value: e,
        onChange: t
      }
    ),
    (o || l) && /* @__PURE__ */ n(
      me,
      {
        level1: (h = o == null ? void 0 : o.properties) == null ? void 0 : h.admin_level_1,
        level2: (p = l == null ? void 0 : l.properties) == null ? void 0 : p.admin_level_2,
        level3: (g = l == null ? void 0 : l.properties) == null ? void 0 : g.admin_level_3
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
  return e && /* @__PURE__ */ n(
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
}, Le = ({
  position: e,
  onPositionChange: t,
  tileLayerProps: o,
  year: r = 1897,
  onYearChange: l,
  radius: u,
  onRadiusChange: i,
  hideLayers: s,
  ...f
}) => /* @__PURE__ */ k(
  T,
  {
    scrollWheelZoom: !0,
    worldCopyJump: !0,
    center: [49.0139, 31.2858],
    style: { height: "100%", width: "100%" },
    zoom: 6,
    zoomControl: !1,
    ...f,
    children: [
      /* @__PURE__ */ n(
        G,
        {
          className: "grayscale",
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          ...o
        }
      ),
      !(s != null && s.ukraineLayer) && /* @__PURE__ */ n(be, {}),
      !(s != null && s.searchInput) && /* @__PURE__ */ n(D, {}),
      !(s != null && s.historicalLayers) && /* @__PURE__ */ n(ve, { year: r, onYearChange: l }),
      !(s != null && s.locationMarker) && /* @__PURE__ */ n(
        se,
        {
          value: e,
          onChange: t,
          radius: u,
          onRadiusChange: i
        }
      )
    ]
  }
);
export {
  Le as default
};
//# sourceMappingURL=index.js.map
