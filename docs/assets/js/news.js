document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    if (!newsContainer) return;

    // Fetch and parse markdown
    fetch('/assets/data/full-news.md')
        .then(response => response.text())
        .then(md => {
            const html = marked.parse(md);
            processNewsContent(html);
            applyTimelineLayout();
        })
        .catch(error => console.error('Error loading news:', error));

    function processNewsContent(html) {
        // Split content by horizontal rules
        const sections = html.split('<hr>');
        
        sections.forEach((section, index) => {
            const card = document.createElement('article');
            card.className = 'news-card timeline-card';
            
            // Extract first heading as date/title
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = section;
            const heading = tempDiv.querySelector('h1, h2, h3, h4, h5, h6');
            
            if (heading) {
                const dateElement = document.createElement('span');
                dateElement.className = 'timeline-date';
                dateElement.textContent = heading.textContent;
                card.appendChild(dateElement);
                heading.remove();
            }

            const contentDiv = document.createElement('div');
            contentDiv.className = 'news-content';
            contentDiv.innerHTML = tempDiv.innerHTML;
            card.appendChild(contentDiv);

            newsContainer.appendChild(card);
        });
    }

    function applyTimelineLayout() {
        newsContainer.classList.add('timeline');
        
        // Add animation on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.timeline-card').forEach(card => {
            card.style.opacity = 0;
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(card);
        });
    }
});
