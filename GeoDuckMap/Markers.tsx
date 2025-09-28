import L from "leaflet";

const pinIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="0" viewBox="0 0 384 512"><path stroke="none" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/></svg>`,
  className: "io5-icon",
  iconSize: [20, 20],
  iconAnchor: [10, 30],
});

const christChurchIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="0" viewBox="0 0 384 512"><path stroke="none" d="M352 128h-96V32c0-17.67-14.33-32-32-32h-64c-17.67 0-32 14.33-32 32v96H32c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h96v224c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32V256h96c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32z"/></svg>`,
  className: "io5-icon",
  iconSize: [20, 20],
  iconAnchor: [10, 30],
});

const jewChurchIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="0" viewBox="0 0 24 24"><path stroke="none" d="M8.433 6H3l-.114.006a1 1 0 0 0-.743 1.508L4.833 12l-2.69 4.486-.054.1A1 1 0 0 0 3 18h5.434l2.709 4.514.074.108a1 1 0 0 0 1.64-.108L15.565 18H21l.114-.006a1 1 0 0 0 .743-1.508L19.166 12l2.691-4.486.054-.1A1 1 0 0 0 21 6h-5.434l-2.709-4.514a1 1 0 0 0-1.714 0L8.433 6z"/></svg>`,
  className: "io5-icon",
  iconSize: [20, 20],
  iconAnchor: [10, 30],
});

const crimeIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="0" viewBox="0 0 24 24"><path fill="none" stroke="none" d="M0 0h24v24H0z"/><path stroke="none" d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm2.5 11.59.9 3.88-3.4-2.05-3.4 2.05.9-3.87-3-2.59 3.96-.34L12 6.02l1.54 3.64 3.96.34-3 2.59z"/></svg>`,
  className: "io5-icon",
  iconSize: [20, 20],
  iconAnchor: [10, 30],
});

const govIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="0" viewBox="0 0 512 512"><path stroke="none" d="m243.4 2.6-224 96c-14 6-21.8 21-18.7 35.8S16.8 160 32 160v8c0 13.3 10.7 24 24 24h400c13.3 0 24-10.7 24-24v-8c15.2 0 28.3-10.7 31.3-25.6s-4.8-29.9-18.7-35.8l-224-96c-8-3.4-17.2-3.4-25.2 0zM128 224H64v196.3c-.6.3-1.2.7-1.8 1.1l-48 32c-11.7 7.8-17 22.4-12.9 35.9S17.9 512 32 512h448c14.1 0 26.5-9.2 30.6-22.7s-1.1-28.1-12.9-35.9l-48-32c-.6-.4-1.2-.7-1.8-1.1L448 224h-64v192h-40V224h-64v192h-48V224h-64v192h-40V224zM256 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>`,
  className: "io5-icon",
  iconSize: [20, 20],
  iconAnchor: [10, 30],
});

const gov2Icon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="0" viewBox="0 0 448 512"><path stroke="none" d="M436 480h-20V24c0-13.255-10.745-24-24-24H56C42.745 0 32 10.745 32 24v456H12c-6.627 0-12 5.373-12 12v20h448v-20c0-6.627-5.373-12-12-12zM128 76c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12V76zm0 96c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12v-40zm52 148h-40c-6.627 0-12-5.373-12-12v-40c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40c0 6.627-5.373 12-12 12zm76 160h-64v-84c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v84zm64-172c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12v-40c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40zm0-96c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12v-40c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40zm0-96c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12V76c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40z"/></svg>`,
  className: "io5-icon",
  iconSize: [20, 20],
  iconAnchor: [10, 30],
});

const icons: Record<string, L.DivIcon> = {
  pinIcon,
  christChurchIcon,
  jewChurchIcon,
  crimeIcon,
  govIcon,
  gov2Icon,
};

export default icons;
