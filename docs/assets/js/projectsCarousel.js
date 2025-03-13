/**
 * Constants for maintainability
 */
const SELECTORS = {
    MAIN: 'main',
    CAROUSEL: {
        IMAGES: '.carousel-images',
        DOTS: '.carousel-dots',
        CAPTION: '.carousel-caption',
        PREV: '.carousel-prev',
        NEXT: '.carousel-next',
        ITEM: '.carousel-item-container',
        DOT: '.carousel-dot'
    }
};

const CLASSES = {
    ACTIVE: 'active',
    PROJECT: 'project',
    CAROUSEL_ITEM: 'carousel-item-container'
};

/**
 * Main initialization
 */
document.addEventListener('DOMContentLoaded', () => {
    const projectsContainer = document.querySelector(SELECTORS.MAIN);
    loadProjects(projectsContainer).catch(handleLoadingError);
});

/**
 * Loads projects data and creates project sections
 */
async function loadProjects(container) {
    try {
        const response = await fetch('/assets/data/projects.json');
        const { projects } = await response.json();
        
        const projectSections = await Promise.all(
            projects.map(createProjectSection)
        );

        projectSections.forEach(section => container.appendChild(section));
    } catch (error) {
        throw new Error(`Failed to load projects: ${error.message}`);
    }
}

/**
 * Creates complete project section with carousel
 */
async function createProjectSection(project) {
    const section = document.createElement('section');
    section.className = CLASSES.PROJECT;

    // Fetch and process markdown content
    const htmlContent = await fetchMarkdownContent(project.markdown);
    
    section.innerHTML = generateProjectHTML(project, htmlContent);
    setupCarousel(section, project);

    return section;
}

/**
 * Fetches and converts markdown content
 */
async function fetchMarkdownContent(url) {
    try {
        const response = await fetch(url);
        const markdown = await response.text();
        return marked.parse(markdown);
    } catch (error) {
        console.warn(`Failed to load markdown from ${url}:`, error);
        return '<p>Project description unavailable</p>';
    }
}

/**
 * Generates project section HTML structure
 */
function generateProjectHTML(project, content) {
    return `
        <div class="project-content">
            <h2>${project.title}</h2>
            <div class="markdown-content">${content}</div>
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
}

/**
 * Sets up carousel components and initializes interaction
 */
function setupCarousel(section, project) {
    const carousel = section.querySelector('.project-carousel');
    const captions = project.images.map((_, i) => 
        project.captions?.[i] || `${project.title} Image ${i + 1}`
    );

    // Create carousel items and dots
    project.images.forEach((img, index) => {
        createCarouselImage(carousel, img, project.title, index);
        createCarouselDot(carousel, index);
    });

    new Carousel(carousel, captions).initialize();
}

/**
 * Creates individual carousel image element
 */
function createCarouselImage(carousel, src, altText, index) {
    const container = document.createElement('div');
    container.classList.add(CLASSES.CAROUSEL_ITEM);
    if (index === 0) container.classList.add(CLASSES.ACTIVE);

    const img = document.createElement('img');
    img.className = 'carousel-item';
    img.src = src;
    img.alt = `${altText} ${index + 1}`;
    img.loading = 'lazy';

    container.appendChild(img);
    carousel.querySelector(SELECTORS.CAROUSEL.IMAGES).appendChild(container);
}

/**
 * Creates individual carousel navigation dot
 */
function createCarouselDot(carousel, index) {
    const dot = document.createElement('div');
    dot.className = 'carousel-dot' + (index === 0 ? ` ${CLASSES.ACTIVE}` : '');
    carousel.querySelector(SELECTORS.CAROUSEL.DOTS).appendChild(dot);
}

/**
 * Error handling
 */
function handleLoadingError(error) {
    console.error('Project loading error:', error);
    const alert = document.createElement('div');
    alert.className = 'error-message';
    alert.textContent = 'Failed to load projects. Please try again later.';
    document.body.prepend(alert);
}

/**
 * Carousel controller class
 */
class Carousel {
    constructor(container, captions) {
        this.container = container;
        this.captions = captions;
        this.currentIndex = 0;
        this.items = container.querySelectorAll(SELECTORS.CAROUSEL.ITEM);
        this.dots = container.querySelectorAll(SELECTORS.CAROUSEL.DOT);
        this.captionElement = container.querySelector(SELECTORS.CAROUSEL.CAPTION);
    }

    initialize() {
        this.addEventListeners();
        this.updateCaption();
    }

    addEventListeners() {
        this.container.querySelector(SELECTORS.CAROUSEL.PREV)
            .addEventListener('click', () => this.navigate(-1));
        this.container.querySelector(SELECTORS.CAROUSEL.NEXT)
            .addEventListener('click', () => this.navigate(1));
        
        this.dots.forEach((dot, index) => 
            dot.addEventListener('click', () => this.jumpTo(index))
        );

        this.container.addEventListener('touchstart', e => 
            this.touchStartX = e.touches[0].clientX);
        this.container.addEventListener('touchend', this.handleTouchEnd.bind(this));
        this.container.addEventListener('keydown', this.handleKeyPress.bind(this));
    }

    navigate(step) {
        this.currentIndex = (this.currentIndex + step + this.items.length) % this.items.length;
        this.updateCarousel();
    }

    jumpTo(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }

    updateCarousel() {
        this.items.forEach((item, index) => 
            item.classList.toggle(CLASSES.ACTIVE, index === this.currentIndex));
        
        this.dots.forEach(dot => dot.classList.remove(CLASSES.ACTIVE));
        this.dots[this.currentIndex].classList.add(CLASSES.ACTIVE);
        
        this.updateCaption();
    }

    updateCaption() {
        if (this.captionElement && this.captions.length > 0) {
            this.captionElement.textContent = this.captions[this.currentIndex];
        }
    }

    handleTouchEnd(e) {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = this.touchStartX - touchEndX;
        if (Math.abs(diff) > 50) this.navigate(diff > 0 ? 1 : -1);
    }

    handleKeyPress(e) {
        if (e.key === 'ArrowLeft') this.navigate(-1);
        if (e.key === 'ArrowRight') this.navigate(1);
    }
}
