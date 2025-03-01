document.addEventListener('DOMContentLoaded', () => {
    const timelineTrack = document.getElementById('timelineTrack'); // Changed container reference
    if (!timelineTrack) return;

    fetch('/assets/data/full-news.md')
        .then(response => response.text())
        .then(md => {
            const html = marked.parse(md);
            processNewsContent(html);
        })
        .catch(error => console.error('Error loading news:', error));

    function processNewsContent(html) {
        const sections = html.split('<hr>');
        
        sections.forEach((section, index) => {
            const element = document.createElement('div');
            element.className = 'timeline-element'; // Match CSS class
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = section;
            const heading = tempDiv.querySelector('h1, h2, h3, h4, h5, h6');
            
            element.innerHTML = `
                <div class="event-dot"></div>
                <div class="event-content">
                    ${heading ? `<div class="event-date">${heading.textContent}</div>` : ''}
                    ${tempDiv.innerHTML.replace(heading?.outerHTML || '', '')}
                </div>
            `;

            timelineTrack.appendChild(element);
        });
    }
});
