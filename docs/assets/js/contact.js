const mapLight = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const mapDark = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

const layerParam = {"maxZoom": 19, "reuseTiles": true, "updateWhenIdle": true};
const mapParam = {"preferCanvas": true, "fadeAnimation": true, "zoomControl": false, "attributionControl": false};

document.addEventListener('DOMContentLoaded', () => {
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    const svg = `
        <svg viewBox="0 -6 8 22" width="30" height="40">
            <path 
                fill="${accentColor}"
                d="
                    M4-6a6 6 0 0 0-6 6c0 2.658 1.564 5.109 3.963 6.691L4 16
                    l2.037-9.309C8.436 5.109 10 2.658 10 0a6 6 0 0 0-6-6z
                    m0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z
                "
            />
        </svg>`;
    const icon = L.divIcon({className: 'custom-pin', html: svg, iconSize: [30, 40], iconAnchor: [15, 40], popupAnchor: [0, -35]});

    // Create tile layers upfront
    const lightLayer = L.tileLayer(mapLight, layerParam); 
    const darkLayer = L.tileLayer(mapDark, layerParam);

    // Initialize map with performance options
    let map = L.map("map", mapParam).setView([48.846119, 2.354910], 16);
    
    // Initial theme setup
    let currentTheme = document.body.getAttribute('data-theme');
    let activeLayer = currentTheme === 'dark' ? darkLayer : lightLayer;
    activeLayer.addTo(map);

    // Theme observer with transition
    const observer = new MutationObserver(() => {
        const newTheme = document.body.getAttribute('data-theme');
        if (newTheme === currentTheme) return;
        currentTheme = newTheme;
        newLayer = currentTheme === 'dark' ? darkLayer : lightLayer;
        
        newLayer.addTo(map);
        activeLayer.remove();
        activeLayer = newLayer;
    });

    observer.observe(document.body, { attributes: true });
    
    // Initialize marker and popup
    const marker = L.marker([48.848041, 2.356787], {icon: icon, keyboard: false})
        .addTo(map).bindPopup("<b>CurieOsity</b><br>Couloir 22-32<br>Salle 115");
    marker.on('mouseover', () => marker.openPopup());
    marker.on('mouseout', () => marker.closePopup());
});
