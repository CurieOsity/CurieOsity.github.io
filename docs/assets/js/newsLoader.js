// Global variables:
const path_news = "/assets/data/news.md"

// Code
class NewsSlider {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentIndex = 0;
    this.slides = [];
  }

  async init() {
    if (!this.container) return;

    try {
      const markdownContent = await this.fetchNewsContent();
      const events = this.parseMarkdown(markdownContent);
      this.createSliderStructure(events);
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
        <h4>${match[1]}<h4>
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
    sliderWrapper.appendChild(this.createNavigationButtons());
    this.container.appendChild(sliderWrapper);
    this.slides = Array.from(sliderContent.children);
  }

  createNavigationButtons() {
    const fragment = document.createDocumentFragment();
    
    const prevBtn = document.createElement('button');
    prevBtn.className = 'slider-nav prev';
    prevBtn.innerHTML = '❮';
    prevBtn.addEventListener('click', () => this.navigate(-1));

    const nextBtn = document.createElement('button');
    nextBtn.className = 'slider-nav next';
    nextBtn.innerHTML = '❯';
    nextBtn.addEventListener('click', () => this.navigate(1));

    fragment.appendChild(prevBtn);
    fragment.appendChild(nextBtn);
    return fragment;
  }

  navigate(direction) {
    const newIndex = this.currentIndex + direction;
    if (newIndex >= 0 && newIndex < this.slides.length + 1) {
      this.currentIndex = newIndex;
      this.updateSliderPosition();
    }
  }

  updateSliderPosition() {
    this.container.querySelector('.slider-content').style.transform = 
      `translateX(-${this.currentIndex * 100}%)`;
  }
}

// Initialize news slider
document.addEventListener('DOMContentLoaded', () => {
  new NewsSlider('news-container').init();
});
