document.addEventListener('DOMContentLoaded', initializeTimeline);

async function initializeTimeline() {
    const timelineContainer = document.getElementById('timelineTrack'); // More descriptive name
    const modal = new ModalController('#eventModal'); // Encapsulated modal logic

    try {
        const timelineData = await fetchTimelineData();
        renderTimeline(timelineData, timelineContainer, modal);
    } catch (error) {
        console.error('Failed to initialize timeline:', error);
        timelineContainer.innerHTML = '<div class="error">Failed to load timeline</div>';
    }
}

// Data handling
async function fetchTimelineData() {
    const response = await fetch('/assets/data/timeline.json');
    const data = await response.json();
    return data.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Rendering
function renderTimeline(data, container, modal) {
    container.innerHTML = '';
    let currentYear = null;

    data.forEach((item, index) => {
        if (item.type === 'year') {
            currentYear = item.year;
            container.appendChild(createYearMarker(currentYear));
        } else {
            container.appendChild(createTimelineItem(item, currentYear, index, modal));
        }
    });
}

function createYearMarker(year) {
    const marker = document.createElement('div');
    marker.className = 'year-marker';
    marker.innerHTML = `<div class="year-text">${year}</div>`;
    return marker;
}

function createTimelineItem(event, year, index, modal) {
    const item = document.createElement('div');
    item.className = 'timeline-element';
    item.innerHTML = `
        <div class="event-dot"></div>
        ${getEventVisual(event)}
        <div class="event-date">${formatFrenchDate(event.date)}</div>
        <div class="event-title">${event.title}</div>
    `;
    
    item.addEventListener('click', () => modal.showEvent(event));
    return item;
}

// Helpers
function getEventVisual(event) {
    return event.image 
        ? `<img src="${event.image}" alt="${event.title}" class="event-image">`
        : '<div class="event-icon">📅</div>';
}

function formatFrenchDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Modal controller class
class ModalController {
    constructor(selector) {
        this.modal = document.querySelector(selector);
        this.content = this.modal.querySelector('#modalContent');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) this.hide();
        });
    }

    async showEvent(event) {
        this.modal.classList.add('visible');
        this.content.innerHTML = '<div class="loader">Chargement...</div>';

        try {
            const content = await this.fetchModalContent(event.markdownFile);
            this.renderContent(event, content);
        } catch (error) {
            this.content.innerHTML = 'Erreur de chargement du contenu';
            console.error('Failed to load modal content:', error);
        }
    }

    async fetchModalContent(url) {
        const response = await fetch(url);
        const md = await response.text();
        return marked.parse(md, {
            gfm: true,
            breaks: true,
            headerIds: false,
            sanitize: false
        });
    }

    renderContent(event, parsedMarkdown) {
        this.content.innerHTML = `
            <div class="modal-header ${event.template ?? ''}">
                <h2>${event.title}</h2>
                <div class="event-date">${formatFrenchDate(event.date)}</div>
            </div>
            <div class="modal-body ${event.template ?? ''}">${parsedMarkdown}</div>
        `;
    }

    hide() {
        this.modal.classList.remove('visible');
    }
}
