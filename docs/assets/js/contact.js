// contact.js
document.addEventListener('DOMContentLoaded', () => {
    // Map container reference
    const mapContainer = document.getElementById('map');
    
    // Initialize map with performance options
    let map = L.map(mapContainer, {
        preferCanvas: true,
        fadeAnimation: true,
        zoomControl: false,
        attributionControl: false
    }).setView([48.848041, 2.356787], 16);

    // Create tile layers upfront
    const lightLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        reuseTiles: true,
        updateWhenIdle: true
    });
    
    const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        reuseTiles: true,
        updateWhenIdle: true
    });

    // Marker creation
    const createMarker = () => {
        const accentColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--accent').trim();

        return L.marker([48.848041, 2.356787], {
            icon: L.divIcon({
                className: 'custom-pin',
                html: `<svg viewBox="0 -6 8 22" width="30" height="40">
                    <path fill="${accentColor}" 
                        d="M4-6a6 6 0 0 0-6 6c0 2.658 1.564 5.109 3.963 6.691L4 16l2.037-9.309C8.436 5.109 10 2.658 10 0a6 6 0 0 0-6-6zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
                </svg>`,
                iconSize: [30, 40],
                iconAnchor: [15, 40],
                popupAnchor: [0, -35]
            }),
            keyboard: false
        });
    };

    // Initialize marker and popup
    const marker = createMarker().addTo(map)
        .bindPopup(`
            <b>CurieOsity</b><br>
            Couloir 22-32<br>
            Salle 115
        `);

    // Initial theme setup
    let currentTheme = document.body.getAttribute('data-theme');
    let activeLayer = currentTheme === 'dark' ? darkLayer : lightLayer;
    activeLayer.addTo(map);

    // Add controls after initial render
    L.control.attribution({ position: 'bottomright' }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Smooth layer switching
    const switchLayers = (newLayer) => {
        if (activeLayer === newLayer) return;

        mapContainer.classList.add('map-transitioning');
        
        newLayer.addTo(map);
        newLayer.bringToFront();
        
        setTimeout(() => {
            activeLayer.remove();
            activeLayer = newLayer;
            mapContainer.classList.remove('map-transitioning');
        }, 250);
    };

    // Theme observer with transition
    const observer = new MutationObserver(() => {
        const newTheme = document.body.getAttribute('data-theme');
        if (newTheme === currentTheme) return;
        
        currentTheme = newTheme;
        switchLayers(newTheme === 'dark' ? darkLayer : lightLayer);
        marker.setIcon(createMarker().options.icon);
    });

    observer.observe(document.body, { attributes: true });

    // Map event handlers
    marker.on('mouseover', () => marker.openPopup());
    marker.on('mouseout', () => marker.closePopup());
});
