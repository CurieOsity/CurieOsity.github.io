/**
 * dynamicContentManager.js
 * Manages dynamic content for the main page including greetings and backgrounds
 */

// Constants
const MAIN_DATA_PATH = "/assets/data/main_page";
const MEDIA_TYPE = {
  VIDEO: 'video',
  IMAGE: 'image'
};

/**
 * Dynamic Content Controller
 */
class DynamicContentManager {
  constructor() {
    this.greetings = [];
    this.backgrounds = [];
  }

  /**
   * Initialize dynamic content
   */
  async initialize() {
    await this.loadContentData();
    this.setRandomGreeting();
    this.setRandomBackground();
  }

  /**
   * Load content data from JSON
   */
  async loadContentData() {
    try {
      const response = await fetch(`${MAIN_DATA_PATH}/dynamicContentManager.json`);
      const data = await response.json();
      this.greetings = data.greetings || [];
      this.backgrounds = data.backgrounds || [];
    } catch (error) {
      console.error('Failed to load content data:', error);
      this.handleContentError();
    }
  }

  /**
   * Set random greeting from available list
   */
  setRandomGreeting() {
    const greeting = this.getRandomElement(this.greetings) || 'Welcome!';
    document.querySelector('.dynamic-text').textContent = greeting;
  }

  /**
   * Set random background media
   */
  setRandomBackground() {
    const background = this.getRandomElement(this.backgrounds);
    const container = document.querySelector('.background-media');
    
    if (!background || !container) return;

    container.innerHTML = '';
    container.append(
      this.createMediaElement(background),
      this.createCreditElement(background)
    );
  }

  /**
   * Creates media element based on type
   */
  createMediaElement(mediaData) {
    if (mediaData.type === MEDIA_TYPE.VIDEO) {
      const video = document.createElement('video');
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      
      const source = document.createElement('source');
      source.src = `${MAIN_DATA_PATH}/${mediaData.name}`;
      source.type = `video/${mediaData.extension}`;
      video.appendChild(source);
      
      return video;
    }

    const img = document.createElement('img');
    img.src = `${MAIN_DATA_PATH}/${mediaData.name}`;
    img.alt = 'Background image';
    return img;
  }

  /**
   * Creates credit element for media
   */
  createCreditElement(mediaData) {
    const credit = document.createElement('div');
    credit.className = 'media-credit';
    credit.innerHTML = `Crédit: <a href="${mediaData['source-url']}" 
      target="_blank" 
      rel="noopener">${mediaData.source}</a>`;
    return credit;
  }

  /**
   * Gets random element from array
   */
  getRandomElement(array) {
    if (!array?.length) return null;
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Handles content loading errors
   */
  handleContentError() {
    // Implement fallback content or error display
    console.warn('Using default content due to loading error');
    this.greetings = ['Welcome!'];
    this.backgrounds = [{
      type: MEDIA_TYPE.IMAGE,
      name: 'default-background.jpg',
      source: 'Site Admin',
      'source-url': '/'
    }];
  }
}

// Initialize when both DOM and other components are ready
document.addEventListener('DOMContentLoaded', () => {
  window.componentsLoaded.then(async () => {
    const contentManager = new DynamicContentManager();
    await contentManager.initialize();
  }).catch(error => console.error('Initialization failed:', error));
});
