document.addEventListener('DOMContentLoaded', async () => {
    const projectsContainer = document.querySelector('main');
    
    try {
        const response = await fetch('/assets/data/projects.json');
        const data = await response.json();
        
        for(const project of data.projects) {
            const mdResponse = await fetch(project.markdown);
            const mdContent = await mdResponse.text();
            const htmlContent = marked.parse(mdContent);
            
            const projectSection = document.createElement('section');
            projectSection.className = 'project';

            projectSection.innerHTML = `
                <div class="project-content">
                    <h2>${project.title}</h2>
                    <div class="markdown-content">${htmlContent}</div>
                </div>
                <div class="project-carousel" id="carousel-${project.slug}">
                    <div class="carousel-images"></div>
                    <div class="carousel-footer">
                        <div class="carousel-caption"></div>
                        <div class="carousel-controls">
                            <button class="carousel-prev" aria-label="Previous image">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <div class="carousel-dots"></div>
                            <button class="carousel-next" aria-label="Next image">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            const carouselImages = projectSection.querySelector('.carousel-images');
            const carouselDots = projectSection.querySelector('.carousel-dots');
            const captions = project.images.map((_, index) => 
                project.captions?.[index] || project.title
            );

            project.images.forEach((img, index) => {
                const container = document.createElement('div');
                container.classList.add('carousel-item-container');
                if(index === 0) container.classList.add('active');

                const imgElement = document.createElement('img');
                imgElement.classList.add('carousel-item');
                imgElement.src = img;
                imgElement.alt = `${project.title} ${index + 1}`;
                imgElement.loading = 'lazy';

                container.appendChild(imgElement);

                const dot = document.createElement('div');
                dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');

                carouselDots.appendChild(dot);
                carouselImages.appendChild(container);
            });

            projectsContainer.appendChild(projectSection);
            initCarousel(
                projectSection.querySelector('.project-carousel'),
                captions
            );
        }
    } catch (error) {
        console.error('Error loading projects:', error);
    }
});

function initCarousel(carousel, captions) {
    let currentIndex = 0;
    const items = carousel.querySelectorAll('.carousel-item-container');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const captionElement = carousel.querySelector('.carousel-caption');

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => updateCarousel(index));
    });


    const updateCarousel = (newIndex) => {
        currentIndex = (newIndex + items.length) % items.length;
        
        items.forEach((item, index) => {
            item.classList.toggle('active', index === currentIndex);
        });
        
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
        
        if (captionElement) {
            captionElement.textContent = captions[currentIndex];
        }
    };

    // Touch events
    let touchStartX = 0;
    carousel.addEventListener('touchstart', (e) => touchStartX = e.touches[0].clientX);
    carousel.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) updateCarousel(diff > 0 ? currentIndex + 1 : currentIndex - 1);
    });

    // Event listeners
    prevBtn.addEventListener('click', () => updateCarousel(currentIndex - 1));
    nextBtn.addEventListener('click', () => updateCarousel(currentIndex + 1));
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') updateCarousel(currentIndex - 1);
        if (e.key === 'ArrowRight') updateCarousel(currentIndex + 1);
    });

    // Initial caption
    if (captionElement && captions.length > 0) {
        captionElement.textContent = captions[0];
    }
}
