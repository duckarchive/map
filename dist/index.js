import { jsx as n, jsxs as f, Fragment as z } from "react/jsx-runtime";
import { Marker as V, Tooltip as Z, Circle as U, useMap as $, useMapEvents as Y, GeoJSON as B, MapContainer as s1, TileLayer as r1 } from "react-leaflet";
import { useEffect as b, useRef as l1, memo as R, useState as q, useCallback as I, useMemo as j, forwardRef as c1 } from "react";
import w, { DomEvent as a1, latLngBounds as i1, DivIcon as u1 } from "leaflet";
import { OpenStreetMapProvider as h1 } from "leaflet-geosearch";
import { ComboBox as M, Input as G, ListBox as A, EmptyState as d1, Card as S, TextField as m1, FieldError as p1, Button as g1, Spinner as f1 } from "@heroui/react";
import L from "swr";
const K = w.divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="0" viewBox="0 0 384 512"><path stroke="none" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/></svg>',
  className: "io5-icon",
  iconSize: [30, 30],
  iconAnchor: [15, 35]
}), v1 = w.divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M192 0c106 0 192 86 192 192 0 77-27 99-172 310a24 24 0 0 1-40 0C27 291 0 269 0 192 0 86 86 0 192 0m-20 32v114H32v40h140v294h40V186h140v-40H212V32z"/></svg>',
  className: "io5-icon",
  iconSize: [30, 30],
  iconAnchor: [15, 35]
}), w1 = w.divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 382 512"><path fill="currentColor" d="M192 0c106 0 192 86 192 192 0 77-27 99-172 310a24 24 0 0 1-40 0C27 291 0 269 0 192 0 86 86 0 192 0m-30 32v130H32v60h130v258h60V222h130v-60H222V32z"/></svg>',
  className: "io5-icon",
  iconSize: [30, 30],
  iconAnchor: [15, 35]
}), y1 = w.divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M192 0c106 0 192 86 192 192 0 77-27 99-172 310a24 24 0 0 1-40 0C27 291 0 269 0 192 0 86 86 0 192 0m0 32q-10 1-18 7-6 8-7 18-10 1-17 7-8 8-8 18t8 17 17 8v60h-60q0-10-8-17-7-8-17-8t-18 8-7 17q-10 0-18 8-6 7-7 17 1 11 7 18 8 6 18 7 1 10 7 18 8 7 18 7 10-1 17-7 8-7 8-18h60v167q-10 0-17 8-8 7-8 17 0 11 8 18 7 6 17 7 1 10 7 18 8 7 18 7 11 0 18-7 6-7 7-18 10-1 17-7 8-8 8-18t-8-17-17-8V217h60q0 10 8 18 7 7 17 7 11-1 18-7 7-7 7-18 11-1 18-7 6-8 7-18 0-10-7-17-8-8-18-8 0-10-7-17-7-8-18-8-10 0-17 8-8 7-8 17h-60v-60q10 0 17-8 8-7 8-17t-8-18-17-7q0-10-7-18-8-6-18-7"/></svg>',
  className: "io5-icon",
  iconSize: [30, 30],
  iconAnchor: [15, 35]
}), q1 = w.divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M192 0c106 0 192 86 192 192 0 77-27 99-172 310a24 24 0 0 1-40 0C27 291 0 269 0 192 0 86 86 0 192 0m-19 32v68h-68v35h68v28H64v35h109v282h35V198h109v-35H208v-28h68v-35h-68V32z"/></svg>',
  className: "io5-icon",
  iconSize: [30, 30],
  iconAnchor: [15, 35]
}), x1 = w.divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M192 0c106 0 192 86 192 192 0 77-27 99-172 310a24 24 0 0 1-40 0C27 291 0 269 0 192 0 86 86 0 192 0m0 32s-10 9-19 12-53-4-62 19c-8 23 15 25 29 45 4 8-3 13-3 13s-7 5-12-2c-15-19-10-42-35-41-24 1-31 45-37 53-5 8-17 14-17 14 0 1 6 12 6 22-1 10-21 50-2 65 20 15 29-7 52-13 9-2 11 6 11 6s3 8-5 12c-22 8-43-4-50 20-6 23 34 43 39 51 6 8 8 21 8 21 1 0 14-2 23 1s41 35 61 22c20-14 3-30 4-54 0-9 9-9 9-9s9 0 9 9c1 24-16 40 4 54 20 13 52-19 61-22s23-1 23-1 2-13 8-21c5-8 45-28 39-51-7-24-28-12-50-20-8-4-5-12-5-12s2-8 11-6c23 6 32 28 52 13 19-15-1-55-2-65 0-10 6-22 6-22s-12-6-17-14c-6-8-13-52-37-53-25-1-20 22-35 41-5 7-12 2-12 2s-7-5-3-13c14-20 37-22 29-45-9-23-53-16-62-19s-19-12-19-12m-42 229-43 58-3-2-3-2 43-59zm133 54-3 2-3 2-43-58 6-5zm-60-194c24 0 44 26 44 55 0 61-75 104-75 104s-75-43-75-104c0-29 20-55 44-55 14 0 31 16 31 16s17-16 31-16m-41 23v26h-26v20h26v71h20v-71h26v-20h-26v-26zm-72 21-1 4-1 4-59-19 2-8zm225-11-59 19-1-4-1-4 59-19zM196 47v73h-8V47z"/></svg>',
  className: "io5-icon",
  iconSize: [30, 30],
  iconAnchor: [15, 35]
}), C1 = w.divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M192 0c106 0 192 86 192 192 0 77-27 99-172 310a24 24 0 0 1-40 0C27 291 0 269 0 192 0 86 86 0 192 0m64 33a11 11 0 0 0-9 16l-55 37-55-37a11 11 0 1 0-5 4l54 131-2 2-131-54a11 11 0 1 0-4 5l37 55-37 55a11 11 0 0 0-13 1 11 11 0 1 0 17 4l131-53 2 2-54 130a11 11 0 1 0 5 4l33-22q4 13 17 17v4q-5 2-6 8v2h-1c0 3 6 10 7 12 4 8 0 14-2 21l-3 8-11-7q-9-1-19 2-9 0-16-2c1 10 6 11 12 15 7 4 10 3 17 4 9 1 10 4 17 8l3 7q5 4 2 8-4 6 1 10 4 1 3 4l1 5 1-5 3-4q5-4 1-10-3-4 2-8l4-7c6-4 8-7 16-8q9 0 17-4c7-4 12-5 12-15q-7 2-15 2-10-3-20-2l-11 7-2-8c-3-7-7-13-3-21 2-2 7-9 7-12h-1v-2q0-6-6-8v-4q14-4 17-17l33 22a11 11 0 0 0 1 13 11 11 0 1 0 4-17l-32-79c12 9 17-2 21 0 5 5 7 18 3 23-2 2-6-7-7-8q-7 10-3 20c11 19 29 2 23-16l-9-18 7 10q4 10 9 19c7 11 18 13 31 14h1v-1q0-19-15-30-8-5-18-9l-10-8c4 0 12 7 17 9 18 6 35-12 17-22q-11-6-21 3c2 1 10 4 8 6-4 3-19 3-22-2-2-4 8-9 0-22-2 18-6 25-20 12 13 15 5 18-12 20l-21-51 2-2 130 53a11 11 0 1 0 4-5l-37-55 37-55a11 11 0 0 0 13-1 11 11 0 1 0-17-4l-130 54-2-2 21-53c18 2 25 6 11 21 15-14 19-6 21 12 9-13-2-18 0-22 4-4 18-6 22-3 2 2-6 6-8 7q10 8 21 3c18-11 1-28-16-22l-18 8 10-7q10-4 18-9 15-11 15-31h-1q-19-1-31 14-5 8-9 18-2 6-7 10c-1-4 6-12 8-17 6-17-11-34-22-17l18-43a11 11 0 1 0 4-20m-60 304q3 2 3 5 0 2-2 4l-5 1-5-1-2-4q0-3 3-5l1 2 1 3 2 1 2-1 2-3zm13-27q0 12-13 15v-2l-2-3-2-1-2 1-1 3-1 2q-12-3-13-15l17-12zm-77-90c-9 13 2 18 0 22-5 4-18 6-23 2-2-1 6-5 8-6q-10-8-21-3c-18 11-1 28 17 22l17-9q-4 6-9 8-10 4-19 9c-11 7-13 18-14 30v1h1q19 1 30-14 5-9 9-19 2-5 8-10c0 4-7 13-9 18-6 17 12 34 22 16q6-11-3-21c-1 2-4 11-6 9-3-4-3-19 2-23 4-2 9 8 22 0-19-2-25-5-12-20-15 13-18 6-20-12M88 88q0 20 14 31 9 5 19 9 5 3 9 7c-3 1-12-6-17-8-17-6-34 12-16 22q10 5 21-3c-2-1-11-5-9-6 4-3 19-3 23 2 2 4-8 9 0 22 2-19 5-26 20-12-13-15-6-18 12-20-13-9-18 1-22 0-4-5-6-19-2-23 1-2 5 6 6 8q8-10 3-21c-11-18-28-1-22 17l9 17q-6-3-8-10-4-10-9-18c-7-11-18-13-30-14zm144 13q-1 9 5 16c1-1 5-10 6-8 4 4 3 19-2 23-4 1-9-8-21-1z"/></svg>',
  className: "io5-icon",
  iconSize: [30, 30],
  iconAnchor: [15, 35]
}), z1 = w.divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M192 0c106 0 192 86 192 192 0 77-27 99-172 310a24 24 0 0 1-40 0C27 291 0 269 0 192 0 86 86 0 192 0m-9 62-38 67H50l8 15 39 68-39 67-8 15h95l38 67 9 15 9-15 38-67h95l-8-15-39-67 39-68 8-15h-95l-38-67-9-15zm33 232-24 42-24-42zm-83-20H84l25-42zm95-125 36 63-36 62h-72l-36-62 36-63zm72 125h-49l24-42zM133 149l-24 42-25-42zm167 0-25 42-24-42zm-84-20h-48l24-42z"/></svg>',
  className: "io5-icon",
  iconSize: [30, 30],
  iconAnchor: [15, 35]
}), I1 = w.divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M192 0c106 0 192 86 192 192 0 77-27 99-172 310a24 24 0 0 1-40 0C27 291 0 269 0 192 0 86 86 0 192 0M87 262zl-26 18a18 18 0 0 0 10 32h245a17 17 0 0 0 9-32l-26-18h-1V154h-35v105h-22V154h-35v105h-26V154h-35v105h-22V154H87zM199 33h-14L63 86q-12 6-11 19 4 14 18 14v5q1 12 13 13h218q13-1 14-13v-5a17 17 0 0 0 6-33zm-7 34a17 17 0 1 1 0 35 17 17 0 0 1 0-35"/></svg>',
  className: "io5-icon",
  iconSize: [30, 30],
  iconAnchor: [15, 35]
}), S1 = w.divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 383 512"><path fill="currentColor" d="M192 0c106 0 192 86 192 192 0 77-27 99-172 310a24 24 0 0 1-40 0C27 291 0 269 0 192 0 86 86 0 192 0m-90 52q-12 1-13 12v222H78q-5 1-6 6v10h240v-10q-1-5-6-6h-11V64q-1-11-13-12zm101 188q5 0 6 5v41h-34v-41q1-5 6-5zm-35-63q7 1 7 6v19q0 6-7 6h-21q-6 0-6-6v-19q0-5 6-6zm69 0q6 1 6 6v19q0 6-6 6h-21q-7 0-7-6v-19q0-5 7-6zm-69-47q7 1 7 6v20q0 5-7 5h-21q-6 0-6-5v-20q0-5 6-6zm69 0q6 1 6 6v20q0 5-6 5h-21q-7 0-7-5v-20q0-5 7-6zm-69-47q7 1 7 6v20q0 5-7 6h-21q-6-1-6-6V89q0-5 6-6zm69 0q6 1 6 6v20q0 5-6 6h-21q-7-1-7-6V89q0-5 7-6z"/></svg>',
  className: "io5-icon",
  iconSize: [30, 30],
  iconAnchor: [15, 35]
}), b1 = {
  pinIcon: K,
  latinCrossIcon: v1,
  christianCrossIcon: w1,
  orthodoxCrossIcon: y1,
  patriarchalCrossIcon: q1,
  davidStarIcon: z1,
  lutherRoseIcon: x1,
  huguenotCrossIcon: C1,
  courtBuildingIcon: I1,
  buildingIcon: S1
}, X = (e) => b1[e || "pinIcon"] || K, k1 = ({ value: e, onClick: t }) => {
  if (!e) return null;
  const o = X(e[4]), s = [e[0], e[1]];
  return /* @__PURE__ */ f(z, { children: [
    /* @__PURE__ */ n(
      V,
      {
        position: s,
        icon: o,
        eventHandlers: t ? { click: () => t(e) } : void 0,
        children: e[3] && /* @__PURE__ */ n(Z, { direction: "top", offset: [0, -30], children: e[3] })
      }
    ),
    e[2] && e[2] > 0 && /* @__PURE__ */ n(
      U,
      {
        center: s,
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
}, M1 = ({ value: e, onChange: t }) => {
  const o = $();
  if (Y({
    click(r) {
      if (!r.latlng) return;
      const { lat: i, lng: l } = r.latlng;
      t == null || t([i, l, e[2] || 0, e[3], e[4]]);
    }
  }), b(() => {
    const r = (u) => {
      if (u.ctrlKey) {
        u.preventDefault(), u.stopPropagation(), u.stopImmediatePropagation();
        const p = u.deltaY, g = 100, m = 100, a = 1e4;
        let h = e[2] || 0;
        p < 0 ? h = Math.min((e[2] || 0) + g, a) : h = Math.max((e[2] || 0) - g, m), h !== e[2] && (t == null || t([e[0], e[1], h, e[3], e[4]]));
      }
    }, i = (u) => {
      u.key === "Control" && o.scrollWheelZoom.disable();
    }, l = (u) => {
      u.key === "Control" && o.scrollWheelZoom.enable();
    }, c = o.getContainer();
    return c.addEventListener("wheel", r, {
      passive: !1,
      capture: !0
    }), document.addEventListener("keydown", i), document.addEventListener("keyup", l), () => {
      c.removeEventListener("wheel", r, { capture: !0 }), document.removeEventListener("keydown", i), document.removeEventListener("keyup", l), o.scrollWheelZoom.enable();
    };
  }, [o, e, t]), !e) return null;
  const s = [e[0], e[1]];
  return /* @__PURE__ */ f(z, { children: [
    /* @__PURE__ */ n(V, { position: s, icon: X(e[4]) }),
    e[2] && e[2] > 0 && /* @__PURE__ */ n(
      U,
      {
        center: s,
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
}, E = ({
  value: e,
  onChange: t,
  onClick: o
}) => !t ? /* @__PURE__ */ n(k1, { value: e, onClick: o }) : /* @__PURE__ */ n(M1, { value: e, onChange: t }), J = () => {
  const e = l1(null);
  return b(() => {
    e.current && a1.disableClickPropagation(e.current);
  }, [e.current]), e;
}, N1 = () => /* @__PURE__ */ n(
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
), j1 = () => /* @__PURE__ */ f(
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
), Q = R(({ onSelect: e }) => {
  const [t, o] = q(""), [s, r] = q([]), i = J(), l = $(), c = new h1({
    params: {
      "accept-language": "ua",
      countrycodes: "ua,pl,by,ru,ro,md,tr",
      limit: 5,
      email: "admin@duckarchive.com"
    }
  }), u = I(
    async (a) => {
      if (!a.trim()) {
        r([]);
        return;
      }
      try {
        const h = await c.search({ query: a });
        r(h);
      } catch {
        r([]);
      }
    },
    [c]
  );
  b(() => {
    const a = setTimeout(() => {
      u(t);
    }, 300);
    return () => clearTimeout(a);
  }, [t]);
  const p = (a) => {
    o(a.label), l.setView([a.y, a.x], 15), l.fire("geosearch/showlocation", {
      location: a,
      marker: null
    }), e == null || e([a.y, a.x]);
  };
  return /* @__PURE__ */ n(
    "div",
    {
      ref: i,
      className: "absolute leaflet-top leaflet-left",
      children: /* @__PURE__ */ f(
        M,
        {
          "aria-label": "Пошук за сучасною назвою",
          className: "leaflet-control w-auto bg-background rounded-xl shadow text-foreground",
          inputValue: t,
          variant: "secondary",
          onClick: (a) => a.stopPropagation(),
          onInputChange: (a) => {
            o(a);
          },
          onMouseDown: (a) => a.stopPropagation(),
          onSelectionChange: (a) => {
            if (a !== null) {
              const h = s[a];
              h && p(h);
            }
          },
          children: [
            /* @__PURE__ */ f(M.InputGroup, { className: "flex items-center gap-2 px-2", children: [
              /* @__PURE__ */ n(N1, {}),
              /* @__PURE__ */ n(G, { className: "bg-transparent", placeholder: "Пошук за сучасною назвою" })
            ] }),
            /* @__PURE__ */ n(M.Popover, { children: /* @__PURE__ */ n(
              A,
              {
                renderEmptyState: () => /* @__PURE__ */ n(d1, { children: "Нічого не знайдено. Уточніть свій запит." }),
                children: s.map((a, h) => /* @__PURE__ */ f(A.Item, { id: h, textValue: a.label, children: [
                  /* @__PURE__ */ n(j1, {}),
                  a.label
                ] }, h))
              }
            ) })
          ]
        }
      )
    }
  );
});
Q.displayName = "MapLocationSearch";
const D = 72, L1 = 0.25, N = 5, E1 = (e) => {
  const t = e % 10, o = e % 100;
  return t === 1 && o !== 11 ? "позначка" : t >= 2 && t <= 4 && (o < 12 || o > 14) ? "позначки" : "позначок";
}, e1 = (e) => e < 10 ? 32 : e < 100 ? 40 : e < 1e3 ? 48 : 56, H = /* @__PURE__ */ new Map(), V1 = (e) => {
  const t = H.get(e);
  if (t) return t;
  const o = e1(e), s = e > 999 ? `${Math.floor(e / 1e3)}k+` : `${e}`, r = new u1({
    html: `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;border-radius:9999px;background-color:currentColor;box-shadow:0 1px 4px rgba(0,0,0,0.4);opacity:0.9"><span style="color:#fff;text-shadow:0 0 5px #000;font-size:${o / 3}px;font-weight:600;line-height:1">${s}</span></div>`,
    className: "geoduck-cluster-icon",
    iconSize: [o, o],
    iconAnchor: [o / 2, o / 2]
  });
  return H.set(e, r), r;
}, $1 = (e, t, { zoom: o, bounds: s }) => {
  const r = s.pad(L1), i = /* @__PURE__ */ new Map();
  for (const l of e) {
    const [c, u] = l;
    if (!Number.isFinite(c) || !Number.isFinite(u) || !r.contains([c, u])) continue;
    const { x: p, y: g } = t.project([c, u], o), m = `${Math.floor(p / D)}:${Math.floor(g / D)}`, a = i.get(m);
    a ? (a.items.push(l), a.sumX += p, a.sumY += g) : i.set(m, { key: m, lat: c, lng: u, items: [l], sumX: p, sumY: g });
  }
  return Array.from(i.values()).map((l) => {
    if (l.items.length === 1) return l;
    const c = t.unproject(
      [l.sumX / l.items.length, l.sumY / l.items.length],
      o
    );
    return { ...l, lat: c.lat, lng: c.lng };
  });
}, B1 = ({ cluster: e, onExpand: t }) => {
  const { items: o, lat: s, lng: r } = e, i = o.map((l) => l[3]).filter((l) => !!l);
  return /* @__PURE__ */ n(
    V,
    {
      eventHandlers: { click: () => t(e) },
      icon: V1(o.length),
      position: [s, r],
      children: /* @__PURE__ */ f(Z, { direction: "top", offset: [0, -e1(o.length) / 2], children: [
        /* @__PURE__ */ f("span", { className: "font-semibold", children: [
          o.length,
          " ",
          E1(o.length)
        ] }),
        i.slice(0, N).map((l, c) => /* @__PURE__ */ n("div", { children: l }, c)),
        i.length > N && /* @__PURE__ */ f("div", { children: [
          "…і ще ",
          i.length - N
        ] })
      ] })
    }
  );
}, R1 = ({
  positions: e,
  onMarkerClick: t
}) => {
  const o = $(), [s, r] = q(() => ({
    zoom: o.getZoom(),
    bounds: o.getBounds()
  })), i = I(() => {
    r({ zoom: o.getZoom(), bounds: o.getBounds() });
  }, [o]);
  Y({
    zoomend: i,
    moveend: i,
    resize: i
  });
  const l = j(
    () => $1(e, o, s),
    [e, o, s]
  ), c = I(
    ({ items: u, lat: p, lng: g }) => {
      const m = i1(
        u.map((h) => [h[0], h[1]])
      );
      m.isValid() && !m.getNorthEast().equals(m.getSouthWest()) ? o.fitBounds(m, { padding: [48, 48] }) : o.setView([p, g], Math.min(o.getZoom() + 2, o.getMaxZoom()));
    },
    [o]
  );
  return /* @__PURE__ */ n(z, { children: l.map(
    (u) => u.items.length === 1 ? /* @__PURE__ */ n(
      E,
      {
        value: u.items[0],
        onClick: t
      },
      u.key
    ) : /* @__PURE__ */ n(
      B1,
      {
        cluster: u,
        onExpand: c
      },
      u.key
    )
  ) });
}, d = "https://raw.githubusercontent.com/duckarchive/map/refs/heads/main/geojson", W1 = [
  { year: 1500, url: `${d}/countries/1500.geojson` },
  { year: 1530, url: `${d}/countries/1530.geojson` },
  { year: 1600, url: `${d}/countries/1600.geojson` },
  { year: 1650, url: `${d}/countries/1650.geojson` },
  { year: 1700, url: `${d}/countries/1700.geojson` },
  { year: 1715, url: `${d}/countries/1715.geojson` },
  { year: 1783, url: `${d}/countries/1783.geojson` },
  { year: 1800, url: `${d}/countries/1800.geojson` },
  { year: 1815, url: `${d}/countries/1815.geojson` },
  { year: 1880, url: `${d}/countries/1880.geojson` },
  { year: 1900, url: `${d}/countries/1900.geojson` },
  { year: 1914, url: `${d}/countries/1914.geojson` },
  { year: 1920, url: `${d}/countries/1920.geojson` },
  { year: 1930, url: `${d}/countries/1930.geojson` },
  { year: 1938, url: `${d}/countries/1938.geojson` },
  { year: 1945, url: `${d}/countries/1945.geojson` },
  { year: 1960, url: `${d}/countries/1960.geojson` },
  { year: 1991, url: `${d}/countries/1991.geojson` }
], O1 = [
  { year: 1897, url: `${d}/states/1897.geojson` },
  { year: 1914, url: `${d}/states/1914.geojson` },
  { year: 1937, url: `${d}/states/1937.geojson` },
  { year: 1945, url: `${d}/states/1945.geojson` },
  { year: 1991, url: `${d}/states/1991.geojson` }
], T = (e, t, o = !1) => {
  if (o) {
    const r = t.find(({ year: i }) => i === e);
    return r ? r.url : null;
  }
  const s = t.filter(({ year: r }) => r > 0 && r <= e).sort((r, i) => i.year - r.year);
  return s.length > 0 ? s[0].url : null;
}, F = (e) => fetch(e).then((t) => t.json()), _1 = (e) => {
  const [t, o] = q(e), s = T(t, W1), {
    data: r,
    isLoading: i,
    isValidating: l
  } = L(s, F, {
    revalidateOnFocus: !1,
    revalidateOnReconnect: !1,
    refreshWhenHidden: !1,
    refreshWhenOffline: !1
  }), c = T(t, O1, !0), {
    data: u,
    isLoading: p,
    isValidating: g
  } = L(c, F, {
    revalidateOnFocus: !1,
    revalidateOnReconnect: !1,
    refreshWhenHidden: !1,
    refreshWhenOffline: !1
  }), m = j(
    () => r || null,
    [r]
  ), a = j(
    () => u || null,
    [u]
  );
  return {
    countries: m,
    states: a,
    updateYear: (y) => {
      o(y);
    },
    isLoading: i || p || l || g
  };
}, A1 = ({ level1: e, level2: t, level3: o }) => /* @__PURE__ */ n("div", { className: "absolute leaflet-bottom leaflet-left", children: /* @__PURE__ */ n(S, { className: "leaflet-control max-w-sm pointer-events-none rounded-xl", children: /* @__PURE__ */ f(S.Header, { children: [
  /* @__PURE__ */ n(S.Title, { className: "text-lg", children: o }),
  /* @__PURE__ */ f(S.Description, { children: [
    t && /* @__PURE__ */ n("p", { className: "text-foreground", children: t }),
    e && /* @__PURE__ */ n("p", { className: "text-sm text-foreground", children: e })
  ] })
] }) }) }), D1 = [
  { value: 1897, label: "Російська Імперія" },
  { value: 1914, label: "WWI" },
  { value: 1937, label: "Перед WWII" },
  { value: 1945, label: "Після WWII" },
  { value: 1991, label: "Незалежність" }
], H1 = (e) => {
  const t = parseInt(e, 10);
  return /^\d{4}$/.test(e) && t >= 1500 && t <= 1991;
}, T1 = ({ value: e, onChange: t }) => {
  const [o, s] = q(e.toString()), [r, i] = q(!1), [l, c] = q(!1), u = J(), p = (h) => {
    const y = h.replace(/\D/g, "").slice(0, 4);
    if (s(y), y.length === 4) {
      const v = H1(y);
      c(!v), v && t(parseInt(y, 10));
    } else
      c(!1);
  }, g = (h) => {
    s(h.toString()), t(h), i(!1), c(!1);
  };
  return /* @__PURE__ */ n("div", { ref: u, className: "absolute leaflet-top leaflet-right", children: /* @__PURE__ */ f("div", { className: "leaflet-control bg-background rounded-xl shadow", children: [
    /* @__PURE__ */ f(
      m1,
      {
        "aria-label": "Рік",
        className: "bg-background relative",
        isInvalid: l,
        type: "text",
        value: o,
        onChange: p,
        children: [
          /* @__PURE__ */ n(
            G,
            {
              className: "text-sm text-foreground",
              placeholder: "1897",
              onBlur: () => {
                setTimeout(() => i(!1), 150);
              },
              onFocus: () => {
                i(!0);
              }
            }
          ),
          l && /* @__PURE__ */ n(p1, { children: "Введіть рік від 1600 до 2025" })
        ]
      }
    ),
    r && /* @__PURE__ */ n("div", { className: "flex flex-col gap-1 p-2", children: D1.map((h) => /* @__PURE__ */ f(
      g1,
      {
        className: "text-xs justify-start",
        size: "sm",
        variant: e === h.value ? "tertiary" : "outline",
        onPress: () => g(h.value),
        children: [
          h.value,
          " - ",
          h.label
        ]
      },
      h.value
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
], F1 = (e) => {
  var s;
  const t = ((s = e.properties) == null ? void 0 : s.admin_level_1_ID) || e.id || 0;
  if (t === 22)
    return "gold";
  const o = t % P.length;
  return P[o];
}, C = (e, t, o = 1) => {
  const s = e ? F1(e) : "gray";
  return {
    color: s,
    fillColor: s,
    weight: o,
    opacity: t ? 1 : 0.5,
    fillOpacity: t ? 0.1 : 0,
    interactive: !0
  };
}, t1 = R(
  c1(
    ({ data: e, onEachFeature: t }, o) => e ? /* @__PURE__ */ n(
      B,
      {
        ref: o,
        data: e,
        style: (s) => C(s, !1, 0),
        onEachFeature: t
      }
    ) : null
  )
);
t1.displayName = "CountriesLayer";
const o1 = R(
  ({ data: e, onEachFeature: t }) => e ? /* @__PURE__ */ n(
    B,
    {
      data: e,
      style: (o) => C(o, !1, 2),
      onEachFeature: t
    }
  ) : null
);
o1.displayName = "StatesLayer";
const P1 = ({ year: e, onYearChange: t }) => {
  var a, h, y;
  const [o, s] = q(null), [r, i] = q(null), { countries: l, states: c, updateYear: u, isLoading: p } = _1(e);
  b(() => {
    u(e), s(null), i(null);
  }, [e]);
  const g = I(
    (v, k) => {
      k.on({
        mouseover: (x) => {
          s(v), x.target.setStyle(C(v, !1, 1));
        },
        mouseout: (x) => {
          s(null), x.target.setStyle(C(v, !1, 0));
        }
      });
    },
    []
  ), m = I(
    (v, k) => {
      k.on({
        mouseover: (x) => {
          i(v);
          const W = l == null ? void 0 : l.features.find(
            (n1) => {
              var O, _;
              return ((O = n1.id) == null ? void 0 : O.toString()) === ((_ = v.properties) == null ? void 0 : _.admin_level_1_ID.toString());
            }
          );
          W && s(W), x.target.setStyle(C(v, !0, 4));
        },
        mouseout: (x) => {
          i(null), x.target.setStyle(C(v, !1, 2));
        }
      });
    },
    [l]
  );
  return /* @__PURE__ */ f(z, { children: [
    p ? /* @__PURE__ */ n("div", { className: "absolute z-[1001] top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm bg-white/50", children: /* @__PURE__ */ n(f1, {}) }) : /* @__PURE__ */ f(z, { children: [
      l && /* @__PURE__ */ n(
        t1,
        {
          data: l,
          onEachFeature: g
        }
      ),
      c && /* @__PURE__ */ n(o1, { data: c, onEachFeature: m })
    ] }),
    t && /* @__PURE__ */ n(
      T1,
      {
        value: e,
        onChange: t
      }
    ),
    (o || r) && /* @__PURE__ */ n(
      A1,
      {
        level1: (a = o == null ? void 0 : o.properties) == null ? void 0 : a.admin_level_1,
        level2: (h = r == null ? void 0 : r.properties) == null ? void 0 : h.admin_level_2,
        level3: (y = r == null ? void 0 : r.properties) == null ? void 0 : y.admin_level_3
      }
    )
  ] });
}, Z1 = "https://raw.githubusercontent.com/duckarchive/map/refs/heads/main/geojson/ukraine.geojson", U1 = (e) => fetch(e).then((t) => t.json()), Y1 = () => {
  const { data: e } = L(
    Z1,
    U1,
    {
      revalidateOnFocus: !1,
      revalidateOnReconnect: !1,
      refreshWhenHidden: !1,
      refreshWhenOffline: !1
    }
  );
  return e && /* @__PURE__ */ n(
    B,
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
}, G1 = {
  zoomControl: !1,
  doubleClickZoom: !1,
  closePopupOnClick: !1,
  dragging: !1,
  zoomSnap: 0,
  zoomDelta: 1,
  trackResize: !1,
  touchZoom: !1,
  scrollWheelZoom: !1
}, K1 = {
  zoomControl: !1,
  scrollWheelZoom: !0
}, X1 = 20, re = ({
  positions: e,
  onPositionChange: t,
  onMarkerClick: o,
  tileLayerProps: s,
  year: r = 1897,
  onYearChange: i,
  clusterThreshold: l = X1,
  hideLayers: c,
  className: u,
  style: p,
  ...g
}) => {
  const m = !t && e.length > l;
  return /* @__PURE__ */ f(
    s1,
    {
      worldCopyJump: !0,
      center: [49.0139, 31.2858],
      zoom: 6,
      ...t || m ? K1 : G1,
      ...g,
      style: {
        height: "100%",
        width: "100%",
        isolation: "isolate",
        ...p
      },
      className: ["isolate", u].filter(Boolean).join(" "),
      children: [
        /* @__PURE__ */ n(
          r1,
          {
            className: "grayscale",
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            ...s
          }
        ),
        !(c != null && c.ukraineLayer) && /* @__PURE__ */ n(Y1, {}),
        !(c != null && c.searchInput) && /* @__PURE__ */ n(Q, { onSelect: t }),
        !(c != null && c.historicalLayers) && /* @__PURE__ */ n(P1, { year: r, onYearChange: i }),
        !(c != null && c.locationMarker) && (t ? /* @__PURE__ */ n(E, { value: e[0], onChange: t }) : m ? /* @__PURE__ */ n(R1, { positions: e, onMarkerClick: o }) : e.map((a, h) => /* @__PURE__ */ n(E, { value: a, onClick: o }, h)))
      ]
    }
  );
};
export {
  re as default
};
//# sourceMappingURL=index.js.map
