// NewsCarousel.js - Handles loading and display of news content in a carousel format

// Constants
const NEWS_MARKDOWN_PATH = "/assets/data/news.md";

class NewsCarousel {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentIndex = 0;
    this.slides = [];
    this.navigationDots = [];
    this.captions = [];
  }

  /** Initializes the carousel component */
  async initialize() {
    if (!this.container) return;

    try {
      const markdownContent = await this.fetchNewsContent();
      const newsEvents = this.parseMarkdownContent(markdownContent);
      this.createCarouselStructure(newsEvents);
      this.initializeEventHandlers();
    } catch (error) {
      console.error('News carousel initialization failed:', error);
      this.container.remove();
    }
  }

  /** Fetches news content from markdown file */
  async fetchNewsContent() {
    const response = await fetch(NEWS_MARKDOWN_PATH);
    if (!response.ok) throw new Error('News content unavailable');
    return await response.text();
  }

  /** Parses markdown content into structured news events */
  parseMarkdownContent(markdown) {
    const parsedHTML = marked.parse(markdown);
    const temporaryContainer = document.createElement('div');
    temporaryContainer.innerHTML = parsedHTML;

    const newsEvents = [];
    let currentEvent = null;

    // Process each HTML element to create news cards
    Array.from(temporaryContainer.children).forEach(element => {
      if (element.tagName === 'H3') {
        currentEvent && newsEvents.push(currentEvent);
        currentEvent = this.createNewsCard(element);
      } else if (currentEvent) {
        this.appendCardContent(currentEvent, element);
      }
    });

    currentEvent && newsEvents.push(currentEvent);
    return newsEvents.filter(Boolean); // Remove any null entries
  }

  /** Creates a news card element from an H3 header */
  createNewsCard(headerElement) {
    // Expected format: "YYYY-MM-DD Title Text"
    const dateTitleMatch = headerElement.textContent.match(/^(\d{4}-\d{2}-\d{2})\s+(.+)/);
    if (!dateTitleMatch) {
      console.warn('Invalid news header format:', headerElement.textContent);
      return null;
    }

    const cardTemplate = `
      <div class="news-card">
        <div class="event-date-title">
          <h4 class="date">${dateTitleMatch[1]}<h4>
          <h3>${dateTitleMatch[2]}</h3>
        </div>
        <div class="event-content"></div>
      </div>
    `;
    
    return new DOMParser().parseFromString(cardTemplate, 'text/html').body.firstChild;
  }

  /** Appends content to a news card */
  appendCardContent(card, contentElement) {
    const contentContainer = card.querySelector('.event-content');
    const shouldAppend = contentElement.nodeName === 'UL' || contentElement.textContent.trim();
    shouldAppend && contentContainer.appendChild(contentElement.cloneNode(true));
  }

  /** Builds the carousel DOM structure */
  createCarouselStructure(events) {
    const carousel = this.createCarouselSkeleton();
    this.createSlidesAndDots(events, carousel.imagesContainer);
    this.container.appendChild(carousel.mainElement);
    this.slides = Array.from(carousel.imagesContainer.children);
  }

  /** Creates basic carousel structure elements */
  createCarouselSkeleton() {
    const elements = {
      mainElement: document.createElement('div'),
      imagesContainer: document.createElement('div'),
      footer: document.createElement('div'),
    };

    elements.mainElement.className = 'project-carousel';
    elements.imagesContainer.className = 'carousel-images';
    elements.footer.className = 'carousel-footer';
    elements.footer.appendChild(this.createControlElements());

    elements.mainElement.append(elements.imagesContainer, elements.footer);
    return elements;
  }

  /** Creates navigation controls */
  createControlElements() {
    const controls = document.createElement('div');
    controls.className = 'carousel-controls';

    this.previousButton = this.createNavigationButton('previous');
    this.nextButton = this.createNavigationButton('next');
    this.dotsContainer = document.createElement('div');
    this.dotsContainer.className = 'carousel-dots';

    controls.append(this.previousButton, this.dotsContainer, this.nextButton);
    return controls;
  }

  /** Creates individual navigation buttons */
  createNavigationButton(type) {
    const button = document.createElement('button');
    button.className = `carousel-${type === 'previous' ? 'prev' : 'next'}`;
    button.setAttribute('aria-label', `${type} slide`);
    button.innerHTML = `<i class="fas fa-chevron-${type === 'previous' ? 'left' : 'right'}"></i>`;
    button.addEventListener('click', () => 
      this.handleSlideChange(type === 'previous' ? -1 : 1)
    );
    return button;
  }

  /** Creates slides and navigation dots */
  createSlidesAndDots(events, container) {
    events.forEach((event, index) => {
      const slideWrapper = document.createElement('div');
      slideWrapper.className = `carousel-item-container ${index === 0 ? 'active' : ''}`;
      slideWrapper.appendChild(event);
      container.appendChild(slideWrapper);

      const dot = document.createElement('div');
      dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => this.updateActiveElements(index));
      this.navigationDots.push(dot);
      this.dotsContainer.appendChild(dot);
    });
  }

  /** Initializes event listeners */
  initializeEventHandlers() {
    this.initializeTouchHandling();
    this.initializeKeyboardNavigation();
  }

  /** Handles touch swipe events */
  initializeTouchHandling() {
    let touchStartPosition = 0;
    
    this.container.addEventListener('touchstart', (e) => {
      touchStartPosition = e.touches[0].clientX;
    });
    
    this.container.addEventListener('touchend', (e) => {
      const touchEndPosition = e.changedTouches[0].clientX;
      const deltaX = touchStartPosition - touchEndPosition;
      if (Math.abs(deltaX) > 50) {
        this.handleSlideChange(deltaX > 0 ? 1 : -1);
      }
    });
  }

  /** Handles keyboard arrow navigation */
  initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.handleSlideChange(-1);
      if (e.key === 'ArrowRight') this.handleSlideChange(1);
    });
  }

  /** Updates slide position */
  handleSlideChange(offset) {
    const newIndex = (this.currentIndex + offset + this.slides.length) % this.slides.length;
    this.updateActiveElements(newIndex);
  }
  
  /** Updates visible slide and navigation state */
  updateActiveElements(newIndex) {
    this.slides[this.currentIndex].classList.remove('active');
    this.navigationDots[this.currentIndex].classList.remove('active');
    
    this.currentIndex = newIndex;
    
    this.slides[this.currentIndex].classList.add('active');
    this.navigationDots[this.currentIndex].classList.add('active');
  }
}

// Initialize the carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new NewsCarousel('news-container').initialize();
});
