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

            let events = [];
            let currentEvent = null;

            // Process markdown content
            Array.from(tempDiv.children).forEach(child => {
                if (child.tagName === 'H3') {
                    // Close previous event
                    if (currentEvent) events.push(currentEvent);
                    
                    // Create new event
                    const match = child.textContent.match(/^(\d{4}-\d{2}-\d{2})\s+(.+)/);
                    if (match) {
                        currentEvent = document.createElement('div');
                        currentEvent.className = 'news-card';
                        currentEvent.innerHTML = `
                            <div class="event-date-title">
                                <span class="date">${match[1]}</span>
                                <h3>${match[2]}</h3>
                            </div>
                            <div class="event-content"></div>
                        `;
                    }
                } else if (currentEvent) {
                    const content = currentEvent.querySelector('.event-content');
                    if (child.nodeName === 'UL') {
                        const list = document.createElement('ul');
                        Array.from(child.children).forEach(li => {
                            list.appendChild(li.cloneNode(true));
                        });
                        content.appendChild(list);
                    } else if (child.textContent.trim() !== '') {
                        content.appendChild(child.cloneNode(true));
                    }
                }
            });

            if (currentEvent) events.push(currentEvent);

            // Add empty vignette
            const emptySlide = document.createElement('div');
            emptySlide.className = 'empty-vignette';
            events.push(emptySlide);

            // Create slider structure
            const sliderWrapper = document.createElement('div');
            sliderWrapper.className = 'slider-wrapper';
            
            const sliderContent = document.createElement('div');
            sliderContent.className = 'slider-content';
            
            events.forEach((event, index) => {
                const slide = document.createElement('div');
                slide.className = `slide ${index === 0 ? 'active' : ''}`;
                slide.appendChild(event);
                sliderContent.appendChild(slide);
            });

            sliderWrapper.appendChild(sliderContent);
            
            // Navigation buttons
            const prevBtn = document.createElement('button');
            prevBtn.className = 'slider-nav prev';
            prevBtn.innerHTML = '❮';
            
            const nextBtn = document.createElement('button');
            nextBtn.className = 'slider-nav next';
            nextBtn.innerHTML = '❯';
            
            sliderWrapper.appendChild(prevBtn);
            sliderWrapper.appendChild(nextBtn);
            newsContainer.appendChild(sliderWrapper);

            // Slider logic
            let currentIndex = 0;
            const slides = Array.from(sliderContent.children);

            function updateSlider() {
                sliderContent.style.transform = `translateX(-${currentIndex * 100}%)`;
            }

            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateSlider();
                }
            });

            nextBtn.addEventListener('click', () => {
                if (currentIndex < slides.length - 1) {
                    currentIndex++;
                    updateSlider();
                }
            });
        })
        .catch(error => {
            console.error('Error loading news:', error);
            newsContainer.remove();
        });
});
