document.addEventListener('DOMContentLoaded', () => {
    const timelineTrack = document.getElementById('timelineTrack');
    const modal = document.getElementById('eventModal');
    const closeModal = document.querySelector('.close');

    // Load timeline data
    fetch('/assets/data/timeline.json')
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => new Date(b.date) - new Date(a.date));
            let currentYear = null;

            timelineTrack.innerHTML = '';

            data.forEach((item, index) => {
                if (item.type === 'year') {
                    currentYear = item.year;
                    createYearMarker(currentYear);
                } else {
                    createTimelineElement(item, currentYear, index);
                }
            });
        })
        .catch(console.error);

    function createYearMarker(year) {
        const yearMarker = document.createElement('div');
        yearMarker.className = 'year-marker';
        yearMarker.innerHTML = `
            <div class="year-text">${year}</div>
        `;
        timelineTrack.appendChild(yearMarker);
    }

    function createTimelineElement(event, year, index) {
        const element = document.createElement('div');
        element.className = 'timeline-element';
        element.innerHTML = `
            <div class="event-dot"></div>
            ${event.image ? 
                `<img src="${event.image}" alt="${event.title}" class="event-image">` : 
                '<div class="event-icon">📅</div>'}
            <div class="event-title">${event.title}</div>
            <div class="event-date">${new Date(event.date).toLocaleDateString('fr-FR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}</div>
        `;

        element.addEventListener('click', () => showEventDetails(event));
        timelineTrack.appendChild(element);
    }

    function showEventDetails(event) {
        const modalContent = document.getElementById('modalContent');
        modalContent.innerHTML = '<div class="loader">Chargement...</div>';
        modal.classList.add('visible');

        fetch(event.markdownFile)
            .then(response => response.text())
            .then(md => {
                const content = marked.parse(md);
                modalContent.innerHTML = `
                    <div class="modal-header ${event.template || ''}">
                        <h2>${event.title}</h2>
                        <div class="event-date">
                            ${new Date(event.date).toLocaleDateString('fr-FR', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </div>
                    </div>
                    <div class="modal-body ${event.template || ''}">${content}</div>
                `;
            })
            .catch(() => {
                modalContent.innerHTML = 'Erreur de chargement du contenu';
            });
    }

    // Modal controls
    closeModal.addEventListener('click', () => {
        modal.classList.remove('visible');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('visible');
        }
    });
});
