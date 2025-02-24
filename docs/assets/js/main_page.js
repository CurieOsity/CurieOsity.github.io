// Global variables
const path_main = "/assets/data/main_page"

// Dynamic Content Manager
const DynamicContent = {
  greetings: [],
  backgrounds: [],

  init() {
    this.setRandomGreeting();
    this.setRandomBackground();
  },

  setRandomGreeting() {
    const randomIndex = Math.floor(Math.random() * this.greetings.length);
    document.querySelector('.dynamic-text').textContent = this.greetings[randomIndex];
  },
  setRandomBackground() {
    const mediaContainer = document.querySelector('.background-media');
    mediaContainer.innerHTML = '';
  
    if (this.backgrounds.length === 0) return;
    const randomMedia = this.backgrounds[
      Math.floor(Math.random() * this.backgrounds.length)
    ];
  
    // Create media element
    let mediaElement;
    if (randomMedia.type === 'video') {
      const video = document.createElement('video');
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      
      const source = document.createElement('source');
      source.src = `${path_main}/${randomMedia.name}`;
      source.type = `video/${randomMedia.extension}`;
      
      video.appendChild(source);
      mediaElement = video;
    } else {
      const img = document.createElement('img');
      img.src = `${path_main}/${randomMedia.name}`;
      img.alt = '';
      mediaElement = img;
    }
  
    // Add media to container
    mediaContainer.appendChild(mediaElement);
  
    // Create credit element
    const credit = document.createElement('div');
    credit.className = 'media-credit';
    credit.innerHTML = `Crédit: <a href="${randomMedia['source-url']}" target="_blank" rel="noopener">${randomMedia.source}</a>`;
    mediaContainer.appendChild(credit);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.componentsLoaded.then(() => {
    fetch(`${path_main}/main_page.json`)
      .then(response => response.json())
      .then(data => {
        DynamicContent.backgrounds = data.backgrounds;
        DynamicContent.greetings = data.greetings;
        DynamicContent.init();
      })
      .catch(error => console.error('Error loading images:', error));
  });
});
