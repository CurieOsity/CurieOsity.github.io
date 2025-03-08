// Global variables:
const path_news = "/assets/data/news.md"

class NewsSlider {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentIndex = 0;
    this.slides = [];
    this.dots = [];
    this.captions = [];
  }

  async init() {
    if (!this.container) return;

    try {
      const markdownContent = await this.fetchNewsContent();
      const events = this.parseMarkdown(markdownContent);
      this.createSliderStructure(events);
      this.initEventListeners();
    } catch (error) {
      console.error('News loading error:', error);
      this.container.remove();
    }
  }

  async fetchNewsContent() {
    const response = await fetch(path_news);
    if (!response.ok) throw new Error('News file not found');
    const content = await response.text();
    if (!content.trim()) throw new Error('Empty news file');
    return content;
  }

  parseMarkdown(markdown) {
    const parsedHtml = marked.parse(markdown);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = parsedHtml;

    let currentEvent = null;
    const events = [];

    Array.from(tempDiv.children).forEach(child => {
      if (child.tagName === 'H3') {
        currentEvent && events.push(currentEvent);
        currentEvent = this.createNewsCard(child);
      } else if (currentEvent) {
        this.appendContent(currentEvent, child);
      }
    });

    currentEvent && events.push(currentEvent);
    return events;
  }

  createNewsCard(headerElement) {
    const match = headerElement.textContent.match(/^(\d{4}-\d{2}-\d{2})\s+(.+)/);
    if (!match) return null;

    const card = document.createElement('div');
    card.className = 'news-card';
    card.innerHTML = `
      <div class="event-date-title">
        <h4 class="date">${match[1]}<h4>
        <h3>${match[2]}</h3>
      </div>
      <div class="event-content"></div>
    `;
    return card;
  }

  appendContent(card, element) {
    const content = card.querySelector('.event-content');
    if (element.nodeName === 'UL') {
      content.appendChild(element.cloneNode(true));
    } else if (element.textContent.trim()) {
      content.appendChild(element.cloneNode(true));
    }
  }

  createSliderStructure(events) {
    const carousel = document.createElement('div');
    carousel.className = 'project-carousel';
    
    const carouselFooter = document.createElement('div');
    carouselFooter.className = 'carousel-footer';
    
    const controls = document.createElement('div');
    controls.className = 'carousel-controls';
    
    this.prevBtn = this.createControlButton('prev');
    this.nextBtn = this.createControlButton('next');
    this.dotsContainer = document.createElement('div');
    this.dotsContainer.className = 'carousel-dots';

    controls.appendChild(this.prevBtn);
    controls.appendChild(this.dotsContainer);
    controls.appendChild(this.nextBtn);
    
    carouselFooter.appendChild(controls);
    
    const carouselImages = document.createElement('div');
    carouselImages.className = 'carousel-images';
    
    events.forEach((event, index) => {
      const container = document.createElement('div');
      container.className = `carousel-item-container ${index === 0 ? 'active' : ''}`;
      container.appendChild(event);
      carouselImages.appendChild(container);

      const dot = document.createElement('div');
      dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => this.updateSlide(index));
      this.dots.push(dot);
      this.dotsContainer.appendChild(dot);
    });

    carousel.appendChild(carouselImages);
    carousel.appendChild(carouselFooter);
    this.container.appendChild(carousel);
    this.slides = Array.from(carouselImages.children);
  }

  createControlButton(type) {
    const btn = document.createElement('button');
    btn.className = `carousel-${type}`;
    btn.setAttribute('aria-label', `${type === 'prev' ? 'Previous' : 'Next'} slide`);
    btn.innerHTML = `<i class="fas fa-chevron-${type === 'prev' ? 'left' : 'right'}"></i>`;
    btn.addEventListener('click', () => 
      this.updateSlide(this.currentIndex + (type === 'prev' ? -1 : 1))
    );
    return btn;
  }

  initEventListeners() {
    // Touch events
    let touchStartX = 0;
    this.container.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    });
    
    this.container.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        this.updateSlide(diff > 0 ? this.currentIndex + 1 : this.currentIndex - 1);
      }
    });

    // Keyboard events
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.updateSlide(this.currentIndex - 1);
      if (e.key === 'ArrowRight') this.updateSlide(this.currentIndex + 1);
    });
  }

  updateSlide(newIndex) {
    newIndex = (newIndex + this.slides.length) % this.slides.length;
    
    this.slides[this.currentIndex].classList.remove('active');
    this.dots[this.currentIndex].classList.remove('active');
    
    this.currentIndex = newIndex;
    
    this.slides[this.currentIndex].classList.add('active');
    this.dots[this.currentIndex].classList.add('active');
  }
}

// Initialize news slider
document.addEventListener('DOMContentLoaded', () => {
  new NewsSlider('news-container').init();
});
