import { jsx as o, jsxs as v, Fragment as I } from "react/jsx-runtime";
import { Marker as _, Tooltip as Z, Circle as B, useMap as D, useMapEvents as G, GeoJSON as M, MapContainer as K, TileLayer as q } from "react-leaflet";
import { useEffect as S, useRef as J, memo as N, useState as w, useCallback as j, useMemo as V, forwardRef as Q } from "react";
import C, { DomEvent as X } from "leaflet";
import { OpenStreetMapProvider as ee } from "leaflet-geosearch";
import { Autocomplete as te, AutocompleteItem as oe } from "@heroui/autocomplete";
import { Spinner as ne } from "@heroui/spinner";
import z from "swr";
import { Card as re, CardBody as se } from "@heroui/card";
import { Button as le } from "@heroui/button";
import { Input as ce } from "@heroui/input";
const ae = C.divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="0" viewBox="0 0 384 512"><path stroke="none" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/></svg>',
  className: "io5-icon",
  iconSize: [20, 20],
  iconAnchor: [10, 30]
}), ie = C.divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="0" viewBox="0 0 384 512"><path stroke="none" d="M352 128h-96V32c0-17.67-14.33-32-32-32h-64c-17.67 0-32 14.33-32 32v96H32c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h96v224c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32V256h96c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32z"/></svg>',
  className: "io5-icon",
  iconSize: [20, 20],
  iconAnchor: [10, 30]
}), ue = C.divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="0" viewBox="0 0 24 24"><path stroke="none" d="M8.433 6H3l-.114.006a1 1 0 0 0-.743 1.508L4.833 12l-2.69 4.486-.054.1A1 1 0 0 0 3 18h5.434l2.709 4.514.074.108a1 1 0 0 0 1.64-.108L15.565 18H21l.114-.006a1 1 0 0 0 .743-1.508L19.166 12l2.691-4.486.054-.1A1 1 0 0 0 21 6h-5.434l-2.709-4.514a1 1 0 0 0-1.714 0L8.433 6z"/></svg>',
  className: "io5-icon",
  iconSize: [20, 20],
  iconAnchor: [10, 30]
}), de = C.divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="0" viewBox="0 0 24 24"><path fill="none" stroke="none" d="M0 0h24v24H0z"/><path stroke="none" d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm2.5 11.59.9 3.88-3.4-2.05-3.4 2.05.9-3.87-3-2.59 3.96-.34L12 6.02l1.54 3.64 3.96.34-3 2.59z"/></svg>',
  className: "io5-icon",
  iconSize: [20, 20],
  iconAnchor: [10, 30]
}), he = C.divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="0" viewBox="0 0 512 512"><path stroke="none" d="m243.4 2.6-224 96c-14 6-21.8 21-18.7 35.8S16.8 160 32 160v8c0 13.3 10.7 24 24 24h400c13.3 0 24-10.7 24-24v-8c15.2 0 28.3-10.7 31.3-25.6s-4.8-29.9-18.7-35.8l-224-96c-8-3.4-17.2-3.4-25.2 0zM128 224H64v196.3c-.6.3-1.2.7-1.8 1.1l-48 32c-11.7 7.8-17 22.4-12.9 35.9S17.9 512 32 512h448c14.1 0 26.5-9.2 30.6-22.7s-1.1-28.1-12.9-35.9l-48-32c-.6-.4-1.2-.7-1.8-1.1L448 224h-64v192h-40V224h-64v192h-48V224h-64v192h-40V224zM256 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>',
  className: "io5-icon",
  iconSize: [20, 20],
  iconAnchor: [10, 30]
}), pe = C.divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="0" viewBox="0 0 448 512"><path stroke="none" d="M436 480h-20V24c0-13.255-10.745-24-24-24H56C42.745 0 32 10.745 32 24v456H12c-6.627 0-12 5.373-12 12v20h448v-20c0-6.627-5.373-12-12-12zM128 76c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12V76zm0 96c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12v-40zm52 148h-40c-6.627 0-12-5.373-12-12v-40c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40c0 6.627-5.373 12-12 12zm76 160h-64v-84c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v84zm64-172c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12v-40c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40zm0-96c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12v-40c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40zm0-96c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12V76c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40z"/></svg>',
  className: "io5-icon",
  iconSize: [20, 20],
  iconAnchor: [10, 30]
}), P = {
  pinIcon: ae,
  christChurchIcon: ie,
  jewChurchIcon: ue,
  crimeIcon: de,
  govIcon: he,
  gov2Icon: pe
}, me = ({
  value: e
}) => {
  if (!e) return null;
  const t = P[e[4] || "pinIcon"], n = [e[0], e[1]];
  return /* @__PURE__ */ v(I, { children: [
    /* @__PURE__ */ o(_, { position: n, icon: t, children: e[3] && /* @__PURE__ */ o(Z, { direction: "top", offset: [0, -30], children: e[3] }) }),
    e[2] && e[2] > 0 && /* @__PURE__ */ o(
      B,
      {
        center: n,
        radius: e[2],
        pathOptions: {
          color: "currentColor",
          fillColor: "currentColor",
          fillOpacity: 0.2,
          weight: 0
        }
      }
    )
  ] });
}, fe = ({ value: e, onChange: t }) => {
  const n = D();
  if (G({
    click(s) {
      if (!s.latlng) return;
      const { lat: r, lng: u } = s.latlng;
      t == null || t([r, u, e[2] || 0]);
    }
  }), S(() => {
    const s = (d) => {
      if (d.ctrlKey) {
        d.preventDefault(), d.stopPropagation(), d.stopImmediatePropagation();
        const m = d.deltaY, f = 100, y = 100, l = 1e4;
        let a = e[2] || 0;
        m < 0 ? a = Math.min((e[2] || 0) + f, l) : a = Math.max((e[2] || 0) - f, y), a !== e[2] && (t == null || t([e[0], e[1], a]));
      }
    }, r = (d) => {
      d.key === "Control" && n.scrollWheelZoom.disable();
    }, u = (d) => {
      d.key === "Control" && n.scrollWheelZoom.enable();
    }, h = n.getContainer();
    return h.addEventListener("wheel", s, {
      passive: !1,
      capture: !0
    }), document.addEventListener("keydown", r), document.addEventListener("keyup", u), () => {
      h.removeEventListener("wheel", s, { capture: !0 }), document.removeEventListener("keydown", r), document.removeEventListener("keyup", u), n.scrollWheelZoom.enable();
    };
  }, [n, e, t]), !e) return null;
  const c = [e[0], e[1]];
  return /* @__PURE__ */ v(I, { children: [
    /* @__PURE__ */ o(_, { position: c, icon: P.pinIcon }),
    e[2] && e[2] > 0 && /* @__PURE__ */ o(
      B,
      {
        center: c,
        radius: e[2],
        pathOptions: {
          color: "currentColor",
          fillColor: "currentColor",
          fillOpacity: 0.2,
          weight: 0
        }
      }
    )
  ] });
}, R = ({ value: e, onChange: t }) => !t ? /* @__PURE__ */ o(me, { value: e }) : /* @__PURE__ */ o(fe, { value: e, onChange: t }), F = () => {
  const e = J(null);
  return S(() => {
    e.current && X.disableClickPropagation(e.current);
  }, [e.current]), e;
}, ge = () => /* @__PURE__ */ o(
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
), ve = () => /* @__PURE__ */ v(
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
), H = N(({ onSelect: e }) => {
  const [t, n] = w(""), [c, s] = w([]), r = F(), u = D(), h = new ee({
    params: {
      "accept-language": "ua",
      countrycodes: "ua,pl,by,ru,ro,md,tr",
      limit: 5,
      email: "admin@duckarchive.com"
    }
  }), d = j(
    async (l) => {
      if (!l.trim()) {
        s([]);
        return;
      }
      try {
        const a = await h.search({ query: l });
        s(a);
      } catch {
        s([]);
      }
    },
    [h]
  );
  S(() => {
    const l = setTimeout(() => {
      d(t);
    }, 300);
    return () => clearTimeout(l);
  }, [t]);
  const m = (l) => {
    n(l.label), u.setView([l.y, l.x], 15), u.fire("geosearch/showlocation", {
      location: l,
      marker: null
    }), e == null || e([l.y, l.x]);
  };
  return /* @__PURE__ */ o(
    "div",
    {
      ref: r,
      className: "absolute leaflet-top leaflet-left",
      children: /* @__PURE__ */ o(
        te,
        {
          "aria-label": "Пошук за сучасною назвою",
          className: "leaflet-control w-auto bg-background rounded-xl shadow text-foreground",
          defaultItems: c,
          inputValue: t,
          listboxProps: {
            emptyContent: "Нічого не знайдено. Уточніть свій запит."
          },
          placeholder: "Пошук за сучасною назвою",
          startContent: /* @__PURE__ */ o(ge, {}),
          variant: "bordered",
          onClick: (l) => l.stopPropagation(),
          onInputChange: (l) => {
            n(l);
          },
          onMouseDown: (l) => l.stopPropagation(),
          onSelectionChange: (l) => {
            if (l) {
              const a = c[l];
              a && m(a);
            }
          },
          children: (l) => /* @__PURE__ */ o(
            oe,
            {
              startContent: /* @__PURE__ */ o(ve, {}),
              textValue: l.label,
              children: l.label
            },
            c.indexOf(l)
          )
        }
      )
    }
  );
});
H.displayName = "MapLocationSearch";
const i = "https://raw.githubusercontent.com/duckarchive/map/refs/heads/main/geojson", we = [
  { year: 1500, url: `${i}/countries/1500.geojson` },
  { year: 1530, url: `${i}/countries/1530.geojson` },
  { year: 1600, url: `${i}/countries/1600.geojson` },
  { year: 1650, url: `${i}/countries/1650.geojson` },
  { year: 1700, url: `${i}/countries/1700.geojson` },
  { year: 1715, url: `${i}/countries/1715.geojson` },
  { year: 1783, url: `${i}/countries/1783.geojson` },
  { year: 1800, url: `${i}/countries/1800.geojson` },
  { year: 1815, url: `${i}/countries/1815.geojson` },
  { year: 1880, url: `${i}/countries/1880.geojson` },
  { year: 1900, url: `${i}/countries/1900.geojson` },
  { year: 1914, url: `${i}/countries/1914.geojson` },
  { year: 1920, url: `${i}/countries/1920.geojson` },
  { year: 1930, url: `${i}/countries/1930.geojson` },
  { year: 1938, url: `${i}/countries/1938.geojson` },
  { year: 1945, url: `${i}/countries/1945.geojson` },
  { year: 1960, url: `${i}/countries/1960.geojson` },
  { year: 1991, url: `${i}/countries/1991.geojson` }
], ye = [
  { year: 1897, url: `${i}/states/1897.geojson` },
  { year: 1914, url: `${i}/states/1914.geojson` },
  { year: 1937, url: `${i}/states/1937.geojson` },
  { year: 1945, url: `${i}/states/1945.geojson` },
  { year: 1991, url: `${i}/states/1991.geojson` }
], E = (e, t, n = !1) => {
  if (n) {
    const s = t.find(({ year: r }) => r === e);
    return s ? s.url : null;
  }
  const c = t.filter(({ year: s }) => s > 0 && s <= e).sort((s, r) => r.year - s.year);
  return c.length > 0 ? c[0].url : null;
}, O = (e) => fetch(e).then((t) => t.json()), ke = (e) => {
  const [t, n] = w(e), c = E(t, we), {
    data: s,
    isLoading: r,
    isValidating: u
  } = z(c, O, {
    revalidateOnFocus: !1,
    revalidateOnReconnect: !1,
    refreshWhenHidden: !1,
    refreshWhenOffline: !1
  }), h = E(t, ye, !0), {
    data: d,
    isLoading: m,
    isValidating: f
  } = z(h, O, {
    revalidateOnFocus: !1,
    revalidateOnReconnect: !1,
    refreshWhenHidden: !1,
    refreshWhenOffline: !1
  }), y = V(
    () => s || null,
    [s]
  ), l = V(
    () => d || null,
    [d]
  );
  return {
    countries: y,
    states: l,
    updateYear: (g) => {
      n(g);
    },
    isLoading: r || m || u || f
  };
}, xe = ({ level1: e, level2: t, level3: n }) => /* @__PURE__ */ o("div", { className: "absolute leaflet-bottom leaflet-left", children: /* @__PURE__ */ o(re, { className: "leaflet-control max-w-sm pointer-events-none rounded-xl", children: /* @__PURE__ */ o(se, { className: "py-2", children: /* @__PURE__ */ v("div", { className: "flex flex-col gap-0", children: [
  n && /* @__PURE__ */ o("p", { className: "text-large", children: n }),
  t && /* @__PURE__ */ o("p", { className: "text-small text-default-500", children: t }),
  e && /* @__PURE__ */ o("p", { className: "text-small text-default-500", children: e })
] }) }) }) }), Ce = [
  { value: 1897, label: "Російська Імперія" },
  { value: 1914, label: "WWI" },
  { value: 1937, label: "Перед WWII" },
  { value: 1945, label: "Після WWII" },
  { value: 1991, label: "Незалежність" }
], Ie = (e) => {
  const t = parseInt(e, 10);
  return /^\d{4}$/.test(e) && t >= 1500 && t <= 1991;
}, Se = ({ value: e, onChange: t }) => {
  const [n, c] = w(e.toString()), [s, r] = w(!1), [u, h] = w(!1), d = F(), m = (a) => {
    const g = a.replace(/\D/g, "").slice(0, 4);
    if (c(g), g.length === 4) {
      const p = Ie(g);
      h(!p), p && t(parseInt(g, 10));
    } else
      h(!1);
  }, f = (a) => {
    c(a.toString()), t(a), r(!1), h(!1);
  };
  return /* @__PURE__ */ o("div", { ref: d, className: "absolute leaflet-top leaflet-right", children: /* @__PURE__ */ v("div", { className: "leaflet-control bg-background rounded-xl shadow", children: [
    /* @__PURE__ */ o(
      ce,
      {
        classNames: {
          inputWrapper: "bg-background relative",
          input: "text-sm text-foreground"
        },
        errorMessage: u ? "Введіть рік від 1600 до 2025" : "",
        isInvalid: u,
        placeholder: "1897",
        type: "text",
        value: n,
        variant: "bordered",
        onBlur: () => {
          setTimeout(() => r(!1), 150);
        },
        onFocus: () => {
          r(!0);
        },
        onValueChange: m
      }
    ),
    s && /* @__PURE__ */ o("div", { className: "flex flex-col gap-1 p-2", children: Ce.map((a) => /* @__PURE__ */ v(
      le,
      {
        className: "text-xs justify-start",
        color: "default",
        size: "sm",
        variant: e === a.value ? "flat" : "bordered",
        onPress: () => f(a.value),
        children: [
          a.value,
          " - ",
          a.label
        ]
      },
      a.value
    )) })
  ] }) });
}, A = [
  "green",
  "darkblue",
  "purple",
  "orange",
  "blue",
  "red",
  "yellow"
], be = (e) => {
  var c;
  const t = ((c = e.properties) == null ? void 0 : c.admin_level_1_ID) || e.id || 0;
  if (t === 22)
    return "gold";
  const n = t % A.length;
  return A[n];
}, x = (e, t, n = 1) => {
  const c = e ? be(e) : "gray";
  return {
    color: c,
    fillColor: c,
    weight: n,
    opacity: t ? 1 : 0.5,
    fillOpacity: t ? 0.1 : 0,
    interactive: !0
  };
}, T = N(
  Q(
    ({ data: e, onEachFeature: t }, n) => e ? /* @__PURE__ */ o(
      M,
      {
        ref: n,
        data: e,
        style: (c) => x(c, !1, 0),
        onEachFeature: t
      }
    ) : null
  )
);
T.displayName = "CountriesLayer";
const U = N(
  ({ data: e, onEachFeature: t }) => e ? /* @__PURE__ */ o(
    M,
    {
      data: e,
      style: (n) => x(n, !1, 2),
      onEachFeature: t
    }
  ) : null
);
U.displayName = "StatesLayer";
const je = ({ year: e, onYearChange: t }) => {
  var l, a, g;
  const [n, c] = w(null), [s, r] = w(null), { countries: u, states: h, updateYear: d, isLoading: m } = ke(e);
  S(() => {
    d(e), c(null), r(null);
  }, [e]);
  const f = j(
    (p, b) => {
      b.on({
        mouseover: (k) => {
          c(p), k.target.setStyle(x(p, !1, 1));
        },
        mouseout: (k) => {
          c(null), k.target.setStyle(x(p, !1, 0));
        }
      });
    },
    []
  ), y = j(
    (p, b) => {
      b.on({
        mouseover: (k) => {
          r(p);
          const L = u == null ? void 0 : u.features.find(
            (Y) => {
              var $, W;
              return (($ = Y.id) == null ? void 0 : $.toString()) === ((W = p.properties) == null ? void 0 : W.admin_level_1_ID.toString());
            }
          );
          L && c(L), k.target.setStyle(x(p, !0, 4));
        },
        mouseout: (k) => {
          r(null), k.target.setStyle(x(p, !1, 2));
        }
      });
    },
    [u]
  );
  return /* @__PURE__ */ v(I, { children: [
    m ? /* @__PURE__ */ o("div", { className: "absolute z-[1001] top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm bg-white/50", children: /* @__PURE__ */ o(ne, {}) }) : /* @__PURE__ */ v(I, { children: [
      u && /* @__PURE__ */ o(
        T,
        {
          data: u,
          onEachFeature: f
        }
      ),
      h && /* @__PURE__ */ o(U, { data: h, onEachFeature: y })
    ] }),
    t && /* @__PURE__ */ o(
      Se,
      {
        value: e,
        onChange: t
      }
    ),
    (n || s) && /* @__PURE__ */ o(
      xe,
      {
        level1: (l = n == null ? void 0 : n.properties) == null ? void 0 : l.admin_level_1,
        level2: (a = s == null ? void 0 : s.properties) == null ? void 0 : a.admin_level_2,
        level3: (g = s == null ? void 0 : s.properties) == null ? void 0 : g.admin_level_3
      }
    )
  ] });
}, ze = "https://raw.githubusercontent.com/duckarchive/map/refs/heads/main/geojson/ukraine.geojson", Me = (e) => fetch(e).then((t) => t.json()), Ne = () => {
  const { data: e } = z(
    ze,
    Me,
    {
      revalidateOnFocus: !1,
      revalidateOnReconnect: !1,
      refreshWhenHidden: !1,
      refreshWhenOffline: !1
    }
  );
  return e && /* @__PURE__ */ o(
    M,
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
}, Le = {
  zoomControl: !1,
  doubleClickZoom: !1,
  closePopupOnClick: !1,
  dragging: !1,
  zoomSnap: 0,
  zoomDelta: 1,
  trackResize: !1,
  touchZoom: !1,
  scrollWheelZoom: !1
}, $e = {
  zoomControl: !1,
  scrollWheelZoom: !0
}, He = ({
  positions: e,
  onPositionChange: t,
  tileLayerProps: n,
  year: c = 1897,
  onYearChange: s,
  hideLayers: r,
  ...u
}) => /* @__PURE__ */ v(
  K,
  {
    worldCopyJump: !0,
    center: [49.0139, 31.2858],
    style: { height: "100%", width: "100%" },
    zoom: 6,
    ...t ? $e : Le,
    ...u,
    children: [
      /* @__PURE__ */ o(
        q,
        {
          className: "grayscale",
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          ...n
        }
      ),
      !(r != null && r.ukraineLayer) && /* @__PURE__ */ o(Ne, {}),
      !(r != null && r.searchInput) && /* @__PURE__ */ o(H, { onSelect: t }),
      !(r != null && r.historicalLayers) && /* @__PURE__ */ o(je, { year: c, onYearChange: s }),
      !(r != null && r.locationMarker) && (t ? /* @__PURE__ */ o(R, { value: e[0], onChange: t }) : e.map((h, d) => /* @__PURE__ */ o(R, { value: h }, d)))
    ]
  }
);
export {
  He as default
};
//# sourceMappingURL=index.js.map
