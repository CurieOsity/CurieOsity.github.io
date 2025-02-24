// about.js
document.addEventListener('DOMContentLoaded', () => {
    const timelineTrack = document.getElementById('timelineTrack');
    const modal = document.getElementById('eventModal');
    const closeModal = document.querySelector('.close');
    let isDragging = false;
    let startX;
    let scrollLeft;

    // Add timeline connector line
    const connector = document.createElement('div');
    connector.className = 'timeline-connector';
    timelineTrack.parentElement.appendChild(connector);

    // Load and display timeline data
    fetch('/assets/data/timeline.json')
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => new Date(a.date) - new Date(b.date));
            let currentYear = null;

            data.forEach(item => {
                if (item.type === 'year') {
                    currentYear = item.year;
                    createYearMarker(currentYear);
                } else if (item.type === 'event') {
                    createTimelineElement(item, currentYear);
                }
            });

            // Update connector line width after loading
            connector.style.width = `${timelineTrack.scrollWidth}px`;
        })
        .catch(console.error);

    function createYearMarker(year) {
        const yearMarker = document.createElement('div');
        yearMarker.className = 'year-marker';
        yearMarker.dataset.year = year;
        timelineTrack.appendChild(yearMarker);
    }

    function createTimelineElement(event) {
        const element = document.createElement('div');
        element.className = 'timeline-element';
        element.innerHTML = `
            <div class="event-preview">
                ${event.image ? `<img src="${event.image}" alt="${event.title}">` : ''}
                <h4>${event.title}</h4>
                <p>${new Date(event.date).toLocaleDateString('fr-FR')}</p>
            </div>
            <div class="glass-container">
                <h3>${event.title}</h3>
                <p>${event.shortDescription}</p>
            </div>
        `;

        element.addEventListener('click', () => showEventDetails(event));
        timelineTrack.appendChild(element);
    }

    function showEventDetails(event) {
        const modalContent = document.getElementById('modalContent');
        modalContent.innerHTML = '<div class="loader">Chargement...</div>';
        modal.style.display = 'block';

        fetch(event.markdownFile)
            .then(response => response.text())
            .then(md => {
                modalContent.innerHTML = `
                    <h2>${event.title}</h2>
                    <p class="event-date">
                        ${new Date(event.date).toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </p>
                    <div class="event-content">${marked.parse(md)}</div>
                `;
            })
            .catch(() => {
                modalContent.innerHTML = 'Erreur de chargement du contenu';
            });
    }

    // Smooth scrolling handlers
    timelineTrack.addEventListener('wheel', (e) => {
        e.preventDefault();
        timelineTrack.scrollLeft += e.deltaY * 0.5;
    }, { passive: false });

    // Touch scrolling handlers
    timelineTrack.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].pageX;
        scrollLeft = timelineTrack.scrollLeft;
    });

    timelineTrack.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.touches[0].pageX;
        const walk = (x - startX) * 2;
        timelineTrack.scrollLeft = scrollLeft - walk;
    });

    timelineTrack.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Modal controls
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Update connector line on resize
    window.addEventListener('resize', () => {
        connector.style.width = `${timelineTrack.scrollWidth}px`;
    });
});
