import { jsx as o, jsxs as v, Fragment as O } from "react/jsx-runtime";
import "leaflet-defaulticon-compatibility";
import { useMapEvents as B, Marker as U, useMap as T, GeoJSON as I, MapContainer as A, TileLayer as H } from "react-leaflet";
import { useRef as G, useEffect as L, memo as $, useState as m, useCallback as w, useMemo as R, forwardRef as q } from "react";
import { OpenStreetMapProvider as J } from "leaflet-geosearch";
import { Autocomplete as K, AutocompleteItem as Z } from "@heroui/autocomplete";
import { DomEvent as Q } from "leaflet";
import { Spinner as X } from "@heroui/spinner";
import k from "swr";
import { Card as ee, CardBody as te } from "@heroui/card";
import { Button as oe } from "@heroui/button";
import { Input as ne } from "@heroui/input";
const re = ({ value: e, onChange: t }) => (B({
  click(r) {
    if (!r.latlng) return;
    const { lat: n, lng: l } = r.latlng;
    t([n, l]);
  }
}), e ? /* @__PURE__ */ o(U, { position: e }) : null), V = () => {
  const e = G(null);
  return L(() => {
    e.current && Q.disableClickPropagation(e.current);
  }, [e.current]), e;
}, ae = () => /* @__PURE__ */ o(
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
), se = () => /* @__PURE__ */ v(
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
), F = $(() => {
  const [e, t] = m(""), [r, n] = m([]), l = V(), c = T(), d = new J({
    params: {
      "accept-language": "ua",
      countrycodes: "ua,pl,by,ru,ro,md,tr",
      limit: 5,
      email: "admin@duckarchive.com"
    }
  }), i = w(
    async (a) => {
      if (!a.trim()) {
        n([]);
        return;
      }
      try {
        const f = await d.search({ query: a });
        n(f);
      } catch {
        n([]);
      }
    },
    [d]
  );
  L(() => {
    const a = setTimeout(() => {
      i(e);
    }, 300);
    return () => clearTimeout(a);
  }, [e]);
  const p = (a) => {
    t(a.label), c.setView([a.y, a.x], 15), c.fire("geosearch/showlocation", {
      location: a,
      marker: null
    });
  };
  return /* @__PURE__ */ o(
    "div",
    {
      ref: l,
      className: "absolute leaflet-top leaflet-left",
      children: /* @__PURE__ */ o(
        K,
        {
          "aria-label": "Пошук за сучасною назвою",
          className: "leaflet-control w-auto bg-white rounded-xl shadow",
          defaultItems: r,
          inputValue: e,
          listboxProps: {
            emptyContent: "Нічого не знайдено. Уточніть свій запит."
          },
          placeholder: "Пошук за сучасною назвою",
          startContent: /* @__PURE__ */ o(ae, {}),
          variant: "bordered",
          onClick: (a) => a.stopPropagation(),
          onInputChange: (a) => {
            t(a);
          },
          onMouseDown: (a) => a.stopPropagation(),
          onSelectionChange: (a) => {
            if (a) {
              const f = r[a];
              f && p(f);
            }
          },
          children: (a) => /* @__PURE__ */ o(
            Z,
            {
              startContent: /* @__PURE__ */ o(se, {}),
              textValue: a.label,
              children: a.label
            },
            r.indexOf(a)
          )
        }
      )
    }
  );
});
F.displayName = "MapLocationSearch";
const s = "https://raw.githubusercontent.com/duckarchive/map.duckarchive.com/refs/heads/main/geojson", le = [
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
], _ = (e, t, r = !1) => {
  if (r) {
    const l = t.find(({ year: c }) => c === e);
    return l ? l.url : null;
  }
  const n = t.filter(({ year: l }) => l > 0 && l <= e).sort((l, c) => c.year - l.year);
  return n.length > 0 ? n[0].url : null;
}, P = (e) => fetch(e).then((t) => t.json()), ie = (e) => {
  const [t, r] = m(e), n = _(t, le), {
    data: l,
    isLoading: c,
    isValidating: d
  } = k(n, P, {
    revalidateOnFocus: !1,
    revalidateOnReconnect: !1,
    refreshWhenHidden: !1,
    refreshWhenOffline: !1
  }), i = _(t, ce, !0), {
    data: p,
    isLoading: j,
    isValidating: b
  } = k(i, P, {
    revalidateOnFocus: !1,
    revalidateOnReconnect: !1,
    refreshWhenHidden: !1,
    refreshWhenOffline: !1
  }), a = R(
    () => l || null,
    [l]
  ), f = R(
    () => p || null,
    [p]
  );
  return {
    countries: a,
    states: f,
    updateYear: (h) => {
      r(h);
    },
    isLoading: c || j || d || b
  };
}, ue = ({ level1: e, level2: t, level3: r }) => /* @__PURE__ */ o("div", { className: "absolute leaflet-bottom leaflet-left", children: /* @__PURE__ */ o(ee, { className: "leaflet-control max-w-sm pointer-events-none rounded-xl", children: /* @__PURE__ */ o(te, { className: "py-2", children: /* @__PURE__ */ v("div", { className: "flex flex-col gap-0", children: [
  r && /* @__PURE__ */ o("p", { className: "text-large", children: r }),
  t && /* @__PURE__ */ o("p", { className: "text-small text-default-500", children: t }),
  e && /* @__PURE__ */ o("p", { className: "text-small text-default-500", children: e })
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
  const [r, n] = m(e.toString()), [l, c] = m(!1), [d, i] = m(!1), p = V(), j = (u) => {
    const h = u.replace(/\D/g, "").slice(0, 4);
    if (n(h), h.length === 4) {
      const S = pe(h);
      i(!S), S && t(parseInt(h, 10));
    } else
      i(!1);
  }, b = (u) => {
    n(u.toString()), t(u), c(!1), i(!1);
  };
  return /* @__PURE__ */ o("div", { ref: p, className: "absolute leaflet-top leaflet-right", children: /* @__PURE__ */ v("div", { className: "leaflet-control bg-white rounded-xl shadow", children: [
    /* @__PURE__ */ o(
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
        value: r,
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
    l && /* @__PURE__ */ o("div", { className: "flex flex-col gap-1 p-2", children: de.map((u) => /* @__PURE__ */ v(
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
}, E = [
  "green",
  "darkblue",
  "purple",
  "orange",
  "blue",
  "red",
  "yellow"
], he = (e) => {
  var n;
  const t = ((n = e.properties) == null ? void 0 : n.admin_level_1_ID) || e.id || 0;
  if (t === 22)
    return "gold";
  const r = t % E.length;
  return E[r];
}, C = (e, t, r = 1) => {
  const n = e ? he(e) : "gray";
  return {
    color: n,
    fillColor: n,
    weight: r,
    opacity: t ? 1 : 0.5,
    fillOpacity: t ? 0.1 : 0,
    interactive: !0
  };
}, D = $(
  q(
    ({ data: e, onEachFeature: t }, r) => e ? /* @__PURE__ */ o(
      I,
      {
        ref: r,
        data: e,
        style: (n) => C(n, !1, 0),
        onEachFeature: t
      }
    ) : null
  )
);
D.displayName = "CountriesLayer";
const Y = $(
  ({ data: e, onEachFeature: t }) => e ? /* @__PURE__ */ o(
    I,
    {
      data: e,
      style: (r) => C(r, !1, 2),
      onEachFeature: t
    }
  ) : null
);
Y.displayName = "StatesLayer";
const me = ({ year: e = 1897 }) => {
  var u, h, S;
  const [t, r] = m(null), [n, l] = m(null), [c, d] = m(e), { countries: i, states: p, updateYear: j, isLoading: b } = ie(c);
  L(() => {
    j(c), r(null), l(null);
  }, [c]);
  const a = w(
    (g, x) => {
      x.on({
        mouseover: (y) => {
          r(g), y.target.setStyle(C(g, !1, 1));
        },
        mouseout: (y) => {
          r(null), y.target.setStyle(C(g, !1, 0));
        }
      });
    },
    []
  ), f = w(
    (g, x) => {
      x.on({
        mouseover: (y) => {
          l(g);
          const N = i == null ? void 0 : i.features.find(
            (z) => {
              var M, W;
              return ((M = z.id) == null ? void 0 : M.toString()) === ((W = g.properties) == null ? void 0 : W.admin_level_1_ID.toString());
            }
          );
          N && r(N), y.target.setStyle(C(g, !0, 4));
        },
        mouseout: (y) => {
          l(null), y.target.setStyle(C(g, !1, 2));
        }
      });
    },
    [i]
  );
  return /* @__PURE__ */ v(O, { children: [
    b ? /* @__PURE__ */ o("div", { className: "absolute z-[1001] top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm bg-white/50", children: /* @__PURE__ */ o(X, {}) }) : /* @__PURE__ */ v(O, { children: [
      i && /* @__PURE__ */ o(
        D,
        {
          data: i,
          onEachFeature: a
        }
      ),
      p && /* @__PURE__ */ o(Y, { data: p, onEachFeature: f })
    ] }),
    /* @__PURE__ */ o(
      fe,
      {
        value: c,
        onChange: d
      }
    ),
    (t || n) && /* @__PURE__ */ o(
      ue,
      {
        level1: (u = t == null ? void 0 : t.properties) == null ? void 0 : u.admin_level_1,
        level2: (h = n == null ? void 0 : n.properties) == null ? void 0 : h.admin_level_2,
        level3: (S = n == null ? void 0 : n.properties) == null ? void 0 : S.admin_level_3
      }
    )
  ] });
}, ge = "https://raw.githubusercontent.com/duckarchive/map.duckarchive.com/refs/heads/main/geojson/ukraine.geojson", ye = (e) => fetch(e).then((t) => t.json()), ve = () => {
  const { data: e } = k(
    ge,
    ye,
    {
      revalidateOnFocus: !1,
      revalidateOnReconnect: !1,
      refreshWhenHidden: !1,
      refreshWhenOffline: !1
    }
  );
  return e && /* @__PURE__ */ o(
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
}, We = ({ position: e, onPositionChange: t }) => /* @__PURE__ */ v(
  A,
  {
    scrollWheelZoom: !0,
    worldCopyJump: !0,
    center: [49.0139, 31.2858],
    style: { height: "100%", width: "100%" },
    zoom: 6,
    zoomControl: !1,
    children: [
      /* @__PURE__ */ o(
        H,
        {
          className: "grayscale",
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        }
      ),
      /* @__PURE__ */ o(ve, {}),
      /* @__PURE__ */ o(F, {}),
      /* @__PURE__ */ o(me, {}),
      /* @__PURE__ */ o(re, { value: e, onChange: t })
    ]
  }
);
export {
  We as default
};
//# sourceMappingURL=index.js.map
