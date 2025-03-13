// Map Configuration Constants
const MAP_THEMES = {
  LIGHT: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    className: 'light-layer'
  },
  DARK: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    className: 'dark-layer'
  }
};

const TILE_LAYER_OPTIONS = {
  maxZoom: 19,
  reuseTiles: true,
  updateWhenIdle: true
};

const MAP_OPTIONS = {
  preferCanvas: true,
  fadeAnimation: true,
  zoomControl: false,
  attributionControl: false
};

const INITIAL_COORDINATES = [48.846119, 2.354910];
const INITIAL_ZOOM = 16;
const MARKER_COORDINATES = [48.848041, 2.356787];

// Creates custom map marker icon using accent color
const createCustomIcon = () => {
  const accentColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--accent').trim();

  const svgPath = `
    M4-6a6 6 0 0 0-6 6c0 2.658 1.564 5.109 3.963 6.691L4 16
    l2.037-9.309C8.436 5.109 10 2.658 10 0a6 6 0 0 0-6-6z
    m0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z
  `;

  return L.divIcon({
    className: 'custom-pin',
    html: `
      <svg viewBox="0 -6 8 22" width="30" height="40">
        <path fill="${accentColor}" d="${svgPath}"/>
      </svg>
    `,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -35]
  });
};

// Initializes map with specified options
const initializeMap = () => {
  const map = L.map("map", MAP_OPTIONS)
    .setView(INITIAL_COORDINATES, INITIAL_ZOOM);

  // Create both theme layers but only add active one
  const layers = {
    light: L.tileLayer(MAP_THEMES.LIGHT.url, TILE_LAYER_OPTIONS),
    dark: L.tileLayer(MAP_THEMES.DARK.url, TILE_LAYER_OPTIONS)
  };

  return { map, layers };
};

// Handles theme switching logic
const setupThemeObserver = (map, layers) => {
  let currentTheme = document.body.getAttribute('data-theme');
  let activeLayer = currentTheme === 'dark' ? layers.dark : layers.light;
  activeLayer.addTo(map);

  const observer = new MutationObserver(() => {
    const newTheme = document.body.getAttribute('data-theme');
    if (newTheme === currentTheme) return;
    
    const newLayer = newTheme === 'dark' ? layers.dark : layers.light;
    newLayer.addTo(map);
    activeLayer.remove();
    activeLayer = newLayer;
    currentTheme = newTheme; // Update current theme
  });

  observer.observe(document.body, { attributes: true });
};

// Initializes map marker with interactions
const setupMapMarker = (map) => {
  const marker = L.marker(MARKER_COORDINATES, {
    icon: createCustomIcon(),
    keyboard: false
  }).addTo(map);

  marker
    .bindPopup("<b>CurieOsity</b><br>Couloir 22-32<br>Salle 115")
    .on('mouseover', () => marker.openPopup())
    .on('mouseout', () => marker.closePopup());
};

// Main initialization function
document.addEventListener('DOMContentLoaded', () => {
  const { map, layers } = initializeMap();
  setupThemeObserver(map, layers);
  setupMapMarker(map);
});
