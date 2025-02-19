document.addEventListener('DOMContentLoaded', function() {
    const newsContainer = document.getElementById('news-container');
    if (!newsContainer) return;

    newsContainer.innerHTML = '';

    fetch('data/news.md')
        .then(response => {
            if (!response.ok) throw new Error('File not found');
            return response.text();
        })
        .then(md => {
            const parsedHtml = marked.parse(md);
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = parsedHtml;

            let hasContent = false;
            let currentEvent = null;

            // Add News heading only if content exists
            if (tempDiv.children.length > 0) {
                const newsHeading = document.createElement('h1');
                newsHeading.textContent = 'News';
                newsContainer.appendChild(newsHeading);
                hasContent = true;
            }

            Array.from(tempDiv.children).forEach(child => {
                if (child.tagName.match(/H[1-6]/) && child.tagName !== 'H3') {
                    currentEvent = null;
                }

                if (child.tagName === 'H3') {
                    const match = child.textContent.match(/^(\d{4}-\d{2}-\d{2})\s+(.+)/);
                    if (match) {
                        hasContent = true;
                        currentEvent = document.createElement('div');
                        currentEvent.className = 'event';
                        currentEvent.innerHTML = `
                            <div class="event-date-title">
                                <span class="date">${match[1]}</span>
                                <span class="title">${match[2]}</span>
                            </div>
                        `;
                        newsContainer.appendChild(currentEvent);
                    } else {
                        currentEvent = null;
                        newsContainer.appendChild(child.cloneNode(true));
                        hasContent = true;
                    }
                } else if (currentEvent) {
                    const explanation = document.createElement('div');
                    explanation.className = 'explanation';
                    explanation.appendChild(child.cloneNode(true));
                    currentEvent.appendChild(explanation);
                    hasContent = true;
                } else {
                    newsContainer.appendChild(child.cloneNode(true));
                    hasContent = true;
                }
            });

            if (!hasContent) {
                newsContainer.parentElement.remove();
            }
        })
        .catch(error => {
            console.error('Error loading news:', error);
            newsContainer.parentElement.remove();
        });
});
