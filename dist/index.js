import { jsx as r, jsxs as g, Fragment as b } from "react/jsx-runtime";
import { Marker as $, Tooltip as H, Circle as P, useMap as E, useMapEvents as Z, GeoJSON as V, MapContainer as Q, TileLayer as ee } from "react-leaflet";
import { useEffect as S, useRef as te, memo as W, useState as y, useCallback as I, useMemo as j, forwardRef as oe } from "react";
import C, { DomEvent as ne, latLngBounds as re, DivIcon as se } from "leaflet";
import { OpenStreetMapProvider as le } from "leaflet-geosearch";
import { Autocomplete as ce, AutocompleteItem as ae } from "@heroui/autocomplete";
import { Spinner as ie } from "@heroui/spinner";
import L from "swr";
import { Card as ue, CardBody as de } from "@heroui/card";
import { Button as he } from "@heroui/button";
import { Input as me } from "@heroui/input";
const pe = C.divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="0" viewBox="0 0 384 512"><path stroke="none" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/></svg>',
  className: "io5-icon",
  iconSize: [20, 20],
  iconAnchor: [10, 30]
}), fe = C.divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="0" viewBox="0 0 384 512"><path stroke="none" d="M352 128h-96V32c0-17.67-14.33-32-32-32h-64c-17.67 0-32 14.33-32 32v96H32c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h96v224c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32V256h96c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32z"/></svg>',
  className: "io5-icon",
  iconSize: [20, 20],
  iconAnchor: [10, 30]
}), ge = C.divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="0" viewBox="0 0 24 24"><path stroke="none" d="M8.433 6H3l-.114.006a1 1 0 0 0-.743 1.508L4.833 12l-2.69 4.486-.054.1A1 1 0 0 0 3 18h5.434l2.709 4.514.074.108a1 1 0 0 0 1.64-.108L15.565 18H21l.114-.006a1 1 0 0 0 .743-1.508L19.166 12l2.691-4.486.054-.1A1 1 0 0 0 21 6h-5.434l-2.709-4.514a1 1 0 0 0-1.714 0L8.433 6z"/></svg>',
  className: "io5-icon",
  iconSize: [20, 20],
  iconAnchor: [10, 30]
}), ve = C.divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="0" viewBox="0 0 24 24"><path fill="none" stroke="none" d="M0 0h24v24H0z"/><path stroke="none" d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm2.5 11.59.9 3.88-3.4-2.05-3.4 2.05.9-3.87-3-2.59 3.96-.34L12 6.02l1.54 3.64 3.96.34-3 2.59z"/></svg>',
  className: "io5-icon",
  iconSize: [20, 20],
  iconAnchor: [10, 30]
}), we = C.divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="0" viewBox="0 0 512 512"><path stroke="none" d="m243.4 2.6-224 96c-14 6-21.8 21-18.7 35.8S16.8 160 32 160v8c0 13.3 10.7 24 24 24h400c13.3 0 24-10.7 24-24v-8c15.2 0 28.3-10.7 31.3-25.6s-4.8-29.9-18.7-35.8l-224-96c-8-3.4-17.2-3.4-25.2 0zM128 224H64v196.3c-.6.3-1.2.7-1.8 1.1l-48 32c-11.7 7.8-17 22.4-12.9 35.9S17.9 512 32 512h448c14.1 0 26.5-9.2 30.6-22.7s-1.1-28.1-12.9-35.9l-48-32c-.6-.4-1.2-.7-1.8-1.1L448 224h-64v192h-40V224h-64v192h-48V224h-64v192h-40V224zM256 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>',
  className: "io5-icon",
  iconSize: [20, 20],
  iconAnchor: [10, 30]
}), ye = C.divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="0" viewBox="0 0 448 512"><path stroke="none" d="M436 480h-20V24c0-13.255-10.745-24-24-24H56C42.745 0 32 10.745 32 24v456H12c-6.627 0-12 5.373-12 12v20h448v-20c0-6.627-5.373-12-12-12zM128 76c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12V76zm0 96c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12v-40zm52 148h-40c-6.627 0-12-5.373-12-12v-40c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40c0 6.627-5.373 12-12 12zm76 160h-64v-84c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v84zm64-172c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12v-40c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40zm0-96c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12v-40c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40zm0-96c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12V76c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40z"/></svg>',
  className: "io5-icon",
  iconSize: [20, 20],
  iconAnchor: [10, 30]
}), U = {
  pinIcon: pe,
  christChurchIcon: fe,
  jewChurchIcon: ge,
  crimeIcon: ve,
  govIcon: we,
  gov2Icon: ye
}, ke = ({
  value: e
}) => {
  if (!e) return null;
  const t = U[e[4] || "pinIcon"], o = [e[0], e[1]];
  return /* @__PURE__ */ g(b, { children: [
    /* @__PURE__ */ r($, { position: o, icon: t, children: e[3] && /* @__PURE__ */ r(H, { direction: "top", offset: [0, -30], children: e[3] }) }),
    e[2] && e[2] > 0 && /* @__PURE__ */ r(
      P,
      {
        center: o,
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
}, xe = ({ value: e, onChange: t }) => {
  const o = E();
  if (Z({
    click(s) {
      if (!s.latlng) return;
      const { lat: i, lng: n } = s.latlng;
      t == null || t([i, n, e[2] || 0]);
    }
  }), S(() => {
    const s = (u) => {
      if (u.ctrlKey) {
        u.preventDefault(), u.stopPropagation(), u.stopImmediatePropagation();
        const p = u.deltaY, m = 100, f = 100, l = 1e4;
        let d = e[2] || 0;
        p < 0 ? d = Math.min((e[2] || 0) + m, l) : d = Math.max((e[2] || 0) - m, f), d !== e[2] && (t == null || t([e[0], e[1], d]));
      }
    }, i = (u) => {
      u.key === "Control" && o.scrollWheelZoom.disable();
    }, n = (u) => {
      u.key === "Control" && o.scrollWheelZoom.enable();
    }, a = o.getContainer();
    return a.addEventListener("wheel", s, {
      passive: !1,
      capture: !0
    }), document.addEventListener("keydown", i), document.addEventListener("keyup", n), () => {
      a.removeEventListener("wheel", s, { capture: !0 }), document.removeEventListener("keydown", i), document.removeEventListener("keyup", n), o.scrollWheelZoom.enable();
    };
  }, [o, e, t]), !e) return null;
  const c = [e[0], e[1]];
  return /* @__PURE__ */ g(b, { children: [
    /* @__PURE__ */ r($, { position: c, icon: U.pinIcon }),
    e[2] && e[2] > 0 && /* @__PURE__ */ r(
      P,
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
}, N = ({ value: e, onChange: t }) => !t ? /* @__PURE__ */ r(ke, { value: e }) : /* @__PURE__ */ r(xe, { value: e, onChange: t }), Y = () => {
  const e = te(null);
  return S(() => {
    e.current && ne.disableClickPropagation(e.current);
  }, [e.current]), e;
}, Ce = () => /* @__PURE__ */ r(
  "svg",
  {
    className: "w-4 h-4 text-gray-400",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
    children: /* @__PURE__ */ r(
      "path",
      {
        d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2
      }
    )
  }
), be = () => /* @__PURE__ */ g(
  "svg",
  {
    className: "w-4 h-4 text-gray-400 flex-shrink-0",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
    children: [
      /* @__PURE__ */ r(
        "path",
        {
          d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 2
        }
      ),
      /* @__PURE__ */ r(
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
), G = W(({ onSelect: e }) => {
  const [t, o] = y(""), [c, s] = y([]), i = Y(), n = E(), a = new le({
    params: {
      "accept-language": "ua",
      countrycodes: "ua,pl,by,ru,ro,md,tr",
      limit: 5,
      email: "admin@duckarchive.com"
    }
  }), u = I(
    async (l) => {
      if (!l.trim()) {
        s([]);
        return;
      }
      try {
        const d = await a.search({ query: l });
        s(d);
      } catch {
        s([]);
      }
    },
    [a]
  );
  S(() => {
    const l = setTimeout(() => {
      u(t);
    }, 300);
    return () => clearTimeout(l);
  }, [t]);
  const p = (l) => {
    o(l.label), n.setView([l.y, l.x], 15), n.fire("geosearch/showlocation", {
      location: l,
      marker: null
    }), e == null || e([l.y, l.x]);
  };
  return /* @__PURE__ */ r(
    "div",
    {
      ref: i,
      className: "absolute leaflet-top leaflet-left",
      children: /* @__PURE__ */ r(
        ce,
        {
          "aria-label": "Пошук за сучасною назвою",
          className: "leaflet-control w-auto bg-background rounded-xl shadow text-foreground",
          defaultItems: c,
          inputValue: t,
          listboxProps: {
            emptyContent: "Нічого не знайдено. Уточніть свій запит."
          },
          placeholder: "Пошук за сучасною назвою",
          startContent: /* @__PURE__ */ r(Ce, {}),
          variant: "bordered",
          onClick: (l) => l.stopPropagation(),
          onInputChange: (l) => {
            o(l);
          },
          onMouseDown: (l) => l.stopPropagation(),
          onSelectionChange: (l) => {
            if (l) {
              const d = c[l];
              d && p(d);
            }
          },
          children: (l) => /* @__PURE__ */ r(
            ae,
            {
              startContent: /* @__PURE__ */ r(be, {}),
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
G.displayName = "MapLocationSearch";
const _ = 72, Ie = 0.25, M = 5, Se = (e) => {
  const t = e % 10, o = e % 100;
  return t === 1 && o !== 11 ? "позначка" : t >= 2 && t <= 4 && (o < 12 || o > 14) ? "позначки" : "позначок";
}, K = (e) => e < 10 ? 32 : e < 100 ? 40 : e < 1e3 ? 48 : 56, A = /* @__PURE__ */ new Map(), ze = (e) => {
  const t = A.get(e);
  if (t) return t;
  const o = K(e), c = e > 999 ? `${Math.floor(e / 1e3)}k+` : `${e}`, s = new se({
    html: `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;border-radius:9999px;background-color:currentColor;box-shadow:0 1px 4px rgba(0,0,0,0.4);opacity:0.9"><span style="color:#fff;font-size:${o / 3}px;font-weight:600;line-height:1">${c}</span></div>`,
    className: "geoduck-cluster-icon",
    iconSize: [o, o],
    iconAnchor: [o / 2, o / 2]
  });
  return A.set(e, s), s;
}, Me = (e, t, { zoom: o, bounds: c }) => {
  const s = c.pad(Ie), i = /* @__PURE__ */ new Map();
  for (const n of e) {
    const [a, u] = n;
    if (!Number.isFinite(a) || !Number.isFinite(u) || !s.contains([a, u])) continue;
    const { x: p, y: m } = t.project([a, u], o), f = `${Math.floor(p / _)}:${Math.floor(m / _)}`, l = i.get(f);
    l ? (l.items.push(n), l.sumX += p, l.sumY += m) : i.set(f, { key: f, lat: a, lng: u, items: [n], sumX: p, sumY: m });
  }
  return Array.from(i.values()).map((n) => {
    if (n.items.length === 1) return n;
    const a = t.unproject(
      [n.sumX / n.items.length, n.sumY / n.items.length],
      o
    );
    return { ...n, lat: a.lat, lng: a.lng };
  });
}, je = ({ cluster: e, onExpand: t }) => {
  const { items: o, lat: c, lng: s } = e, i = o.map((n) => n[3]).filter((n) => !!n);
  return /* @__PURE__ */ r(
    $,
    {
      eventHandlers: { click: () => t(e) },
      icon: ze(o.length),
      position: [c, s],
      children: /* @__PURE__ */ g(H, { direction: "top", offset: [0, -K(o.length) / 2], children: [
        /* @__PURE__ */ g("span", { className: "font-semibold", children: [
          o.length,
          " ",
          Se(o.length)
        ] }),
        i.slice(0, M).map((n, a) => /* @__PURE__ */ r("div", { children: n }, a)),
        i.length > M && /* @__PURE__ */ g("div", { children: [
          "…і ще ",
          i.length - M
        ] })
      ] })
    }
  );
}, Le = ({ positions: e }) => {
  const t = E(), [o, c] = y(() => ({
    zoom: t.getZoom(),
    bounds: t.getBounds()
  })), s = I(() => {
    c({ zoom: t.getZoom(), bounds: t.getBounds() });
  }, [t]);
  Z({
    zoomend: s,
    moveend: s,
    resize: s
  });
  const i = j(
    () => Me(e, t, o),
    [e, t, o]
  ), n = I(
    ({ items: a, lat: u, lng: p }) => {
      const m = re(
        a.map((l) => [l[0], l[1]])
      );
      m.isValid() && !m.getNorthEast().equals(m.getSouthWest()) ? t.fitBounds(m, { padding: [48, 48] }) : t.setView([u, p], Math.min(t.getZoom() + 2, t.getMaxZoom()));
    },
    [t]
  );
  return /* @__PURE__ */ r(b, { children: i.map(
    (a) => a.items.length === 1 ? /* @__PURE__ */ r(N, { value: a.items[0] }, a.key) : /* @__PURE__ */ r(
      je,
      {
        cluster: a,
        onExpand: n
      },
      a.key
    )
  ) });
}, h = "https://raw.githubusercontent.com/duckarchive/map/refs/heads/main/geojson", Ne = [
  { year: 1500, url: `${h}/countries/1500.geojson` },
  { year: 1530, url: `${h}/countries/1530.geojson` },
  { year: 1600, url: `${h}/countries/1600.geojson` },
  { year: 1650, url: `${h}/countries/1650.geojson` },
  { year: 1700, url: `${h}/countries/1700.geojson` },
  { year: 1715, url: `${h}/countries/1715.geojson` },
  { year: 1783, url: `${h}/countries/1783.geojson` },
  { year: 1800, url: `${h}/countries/1800.geojson` },
  { year: 1815, url: `${h}/countries/1815.geojson` },
  { year: 1880, url: `${h}/countries/1880.geojson` },
  { year: 1900, url: `${h}/countries/1900.geojson` },
  { year: 1914, url: `${h}/countries/1914.geojson` },
  { year: 1920, url: `${h}/countries/1920.geojson` },
  { year: 1930, url: `${h}/countries/1930.geojson` },
  { year: 1938, url: `${h}/countries/1938.geojson` },
  { year: 1945, url: `${h}/countries/1945.geojson` },
  { year: 1960, url: `${h}/countries/1960.geojson` },
  { year: 1991, url: `${h}/countries/1991.geojson` }
], $e = [
  { year: 1897, url: `${h}/states/1897.geojson` },
  { year: 1914, url: `${h}/states/1914.geojson` },
  { year: 1937, url: `${h}/states/1937.geojson` },
  { year: 1945, url: `${h}/states/1945.geojson` },
  { year: 1991, url: `${h}/states/1991.geojson` }
], D = (e, t, o = !1) => {
  if (o) {
    const s = t.find(({ year: i }) => i === e);
    return s ? s.url : null;
  }
  const c = t.filter(({ year: s }) => s > 0 && s <= e).sort((s, i) => i.year - s.year);
  return c.length > 0 ? c[0].url : null;
}, T = (e) => fetch(e).then((t) => t.json()), Ee = (e) => {
  const [t, o] = y(e), c = D(t, Ne), {
    data: s,
    isLoading: i,
    isValidating: n
  } = L(c, T, {
    revalidateOnFocus: !1,
    revalidateOnReconnect: !1,
    refreshWhenHidden: !1,
    refreshWhenOffline: !1
  }), a = D(t, $e, !0), {
    data: u,
    isLoading: p,
    isValidating: m
  } = L(a, T, {
    revalidateOnFocus: !1,
    revalidateOnReconnect: !1,
    refreshWhenHidden: !1,
    refreshWhenOffline: !1
  }), f = j(
    () => s || null,
    [s]
  ), l = j(
    () => u || null,
    [u]
  );
  return {
    countries: f,
    states: l,
    updateYear: (w) => {
      o(w);
    },
    isLoading: i || p || n || m
  };
}, Ve = ({ level1: e, level2: t, level3: o }) => /* @__PURE__ */ r("div", { className: "absolute leaflet-bottom leaflet-left", children: /* @__PURE__ */ r(ue, { className: "leaflet-control max-w-sm pointer-events-none rounded-xl", children: /* @__PURE__ */ r(de, { className: "py-2", children: /* @__PURE__ */ g("div", { className: "flex flex-col gap-0", children: [
  o && /* @__PURE__ */ r("p", { className: "text-large", children: o }),
  t && /* @__PURE__ */ r("p", { className: "text-small text-default-500", children: t }),
  e && /* @__PURE__ */ r("p", { className: "text-small text-default-500", children: e })
] }) }) }) }), We = [
  { value: 1897, label: "Російська Імперія" },
  { value: 1914, label: "WWI" },
  { value: 1937, label: "Перед WWII" },
  { value: 1945, label: "Після WWII" },
  { value: 1991, label: "Незалежність" }
], Oe = (e) => {
  const t = parseInt(e, 10);
  return /^\d{4}$/.test(e) && t >= 1500 && t <= 1991;
}, Re = ({ value: e, onChange: t }) => {
  const [o, c] = y(e.toString()), [s, i] = y(!1), [n, a] = y(!1), u = Y(), p = (d) => {
    const w = d.replace(/\D/g, "").slice(0, 4);
    if (c(w), w.length === 4) {
      const v = Oe(w);
      a(!v), v && t(parseInt(w, 10));
    } else
      a(!1);
  }, m = (d) => {
    c(d.toString()), t(d), i(!1), a(!1);
  };
  return /* @__PURE__ */ r("div", { ref: u, className: "absolute leaflet-top leaflet-right", children: /* @__PURE__ */ g("div", { className: "leaflet-control bg-background rounded-xl shadow", children: [
    /* @__PURE__ */ r(
      me,
      {
        classNames: {
          inputWrapper: "bg-background relative",
          input: "text-sm text-foreground"
        },
        errorMessage: n ? "Введіть рік від 1600 до 2025" : "",
        isInvalid: n,
        placeholder: "1897",
        type: "text",
        value: o,
        variant: "bordered",
        onBlur: () => {
          setTimeout(() => i(!1), 150);
        },
        onFocus: () => {
          i(!0);
        },
        onValueChange: p
      }
    ),
    s && /* @__PURE__ */ r("div", { className: "flex flex-col gap-1 p-2", children: We.map((d) => /* @__PURE__ */ g(
      he,
      {
        className: "text-xs justify-start",
        color: "default",
        size: "sm",
        variant: e === d.value ? "flat" : "bordered",
        onPress: () => m(d.value),
        children: [
          d.value,
          " - ",
          d.label
        ]
      },
      d.value
    )) })
  ] }) });
}, F = [
  "green",
  "darkblue",
  "purple",
  "orange",
  "blue",
  "red",
  "yellow"
], Be = (e) => {
  var c;
  const t = ((c = e.properties) == null ? void 0 : c.admin_level_1_ID) || e.id || 0;
  if (t === 22)
    return "gold";
  const o = t % F.length;
  return F[o];
}, x = (e, t, o = 1) => {
  const c = e ? Be(e) : "gray";
  return {
    color: c,
    fillColor: c,
    weight: o,
    opacity: t ? 1 : 0.5,
    fillOpacity: t ? 0.1 : 0,
    interactive: !0
  };
}, q = W(
  oe(
    ({ data: e, onEachFeature: t }, o) => e ? /* @__PURE__ */ r(
      V,
      {
        ref: o,
        data: e,
        style: (c) => x(c, !1, 0),
        onEachFeature: t
      }
    ) : null
  )
);
q.displayName = "CountriesLayer";
const X = W(
  ({ data: e, onEachFeature: t }) => e ? /* @__PURE__ */ r(
    V,
    {
      data: e,
      style: (o) => x(o, !1, 2),
      onEachFeature: t
    }
  ) : null
);
X.displayName = "StatesLayer";
const _e = ({ year: e, onYearChange: t }) => {
  var l, d, w;
  const [o, c] = y(null), [s, i] = y(null), { countries: n, states: a, updateYear: u, isLoading: p } = Ee(e);
  S(() => {
    u(e), c(null), i(null);
  }, [e]);
  const m = I(
    (v, z) => {
      z.on({
        mouseover: (k) => {
          c(v), k.target.setStyle(x(v, !1, 1));
        },
        mouseout: (k) => {
          c(null), k.target.setStyle(x(v, !1, 0));
        }
      });
    },
    []
  ), f = I(
    (v, z) => {
      z.on({
        mouseover: (k) => {
          i(v);
          const O = n == null ? void 0 : n.features.find(
            (J) => {
              var R, B;
              return ((R = J.id) == null ? void 0 : R.toString()) === ((B = v.properties) == null ? void 0 : B.admin_level_1_ID.toString());
            }
          );
          O && c(O), k.target.setStyle(x(v, !0, 4));
        },
        mouseout: (k) => {
          i(null), k.target.setStyle(x(v, !1, 2));
        }
      });
    },
    [n]
  );
  return /* @__PURE__ */ g(b, { children: [
    p ? /* @__PURE__ */ r("div", { className: "absolute z-[1001] top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm bg-white/50", children: /* @__PURE__ */ r(ie, {}) }) : /* @__PURE__ */ g(b, { children: [
      n && /* @__PURE__ */ r(
        q,
        {
          data: n,
          onEachFeature: m
        }
      ),
      a && /* @__PURE__ */ r(X, { data: a, onEachFeature: f })
    ] }),
    t && /* @__PURE__ */ r(
      Re,
      {
        value: e,
        onChange: t
      }
    ),
    (o || s) && /* @__PURE__ */ r(
      Ve,
      {
        level1: (l = o == null ? void 0 : o.properties) == null ? void 0 : l.admin_level_1,
        level2: (d = s == null ? void 0 : s.properties) == null ? void 0 : d.admin_level_2,
        level3: (w = s == null ? void 0 : s.properties) == null ? void 0 : w.admin_level_3
      }
    )
  ] });
}, Ae = "https://raw.githubusercontent.com/duckarchive/map/refs/heads/main/geojson/ukraine.geojson", De = (e) => fetch(e).then((t) => t.json()), Te = () => {
  const { data: e } = L(
    Ae,
    De,
    {
      revalidateOnFocus: !1,
      revalidateOnReconnect: !1,
      refreshWhenHidden: !1,
      refreshWhenOffline: !1
    }
  );
  return e && /* @__PURE__ */ r(
    V,
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
}, Fe = {
  zoomControl: !1,
  doubleClickZoom: !1,
  closePopupOnClick: !1,
  dragging: !1,
  zoomSnap: 0,
  zoomDelta: 1,
  trackResize: !1,
  touchZoom: !1,
  scrollWheelZoom: !1
}, He = {
  zoomControl: !1,
  scrollWheelZoom: !0
}, Pe = 20, ot = ({
  positions: e,
  onPositionChange: t,
  tileLayerProps: o,
  year: c = 1897,
  onYearChange: s,
  clusterThreshold: i = Pe,
  hideLayers: n,
  ...a
}) => {
  const u = !t && e.length > i;
  return /* @__PURE__ */ g(
    Q,
    {
      worldCopyJump: !0,
      center: [49.0139, 31.2858],
      style: { height: "100%", width: "100%" },
      zoom: 6,
      ...t || u ? He : Fe,
      ...a,
      children: [
        /* @__PURE__ */ r(
          ee,
          {
            className: "grayscale",
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            ...o
          }
        ),
        !(n != null && n.ukraineLayer) && /* @__PURE__ */ r(Te, {}),
        !(n != null && n.searchInput) && /* @__PURE__ */ r(G, { onSelect: t }),
        !(n != null && n.historicalLayers) && /* @__PURE__ */ r(_e, { year: c, onYearChange: s }),
        !(n != null && n.locationMarker) && (t ? /* @__PURE__ */ r(N, { value: e[0], onChange: t }) : u ? /* @__PURE__ */ r(Le, { positions: e }) : e.map((p, m) => /* @__PURE__ */ r(N, { value: p }, m)))
      ]
    }
  );
};
export {
  ot as default
};
//# sourceMappingURL=index.js.map
