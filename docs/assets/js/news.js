// timeline.js - Renamed to better reflect functionality

document.addEventListener('DOMContentLoaded', async () => {
    const timelineContainer = document.getElementById('timelineTrack'); // More descriptive variable name
    
    if (!timelineContainer) {
        console.warn('Timeline container element not found');
        return;
    }

    try {
        // Isolated data fetching logic
        const markdownContent = await fetchMarkdownContent('/assets/data/full-news.md');
        const processedHTML = processMarkdownToHTML(markdownContent);
        renderTimelineElements(timelineContainer, processedHTML);
    } catch (error) {
        handleLoadingError(error);
    }
});

// Isolated functions for better readability and reusability

async function fetchMarkdownContent(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.text();
}

function processMarkdownToHTML(markdownContent) {
    // Security note: Ensure marked is properly sanitized if content is untrusted
    return marked.parse(markdownContent);
}

function renderTimelineElements(container, htmlContent) {
    const sections = htmlContent.split('<hr>');
    
    sections.forEach((sectionHTML, index) => {
        const { date, content } = extractSectionData(sectionHTML);
        const timelineElement = createTimelineElement(date, content);
        container.appendChild(timelineElement);
    });
}

function extractSectionData(sectionHTML) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(sectionHTML, 'text/html');
    const heading = doc.querySelector('h1, h2, h3, h4, h5, h6');
    
    return {
        date: heading?.textContent || '',
        content: heading ? sectionHTML.replace(heading.outerHTML, '') : sectionHTML
    };
}

function createTimelineElement(date, content) {
    const element = document.createElement('div');
    element.className = 'timeline-element';
    
    element.innerHTML = `
        <div class="event-dot"></div>
        <div class="event-content">
            ${date ? `<div class="event-date">${date}</div>` : ''}
            ${content}
        </div>
    `;

    return element;
}

function handleLoadingError(error) {
    console.error('News timeline loading failed:', error);
    // Consider adding user-facing error message here
}
