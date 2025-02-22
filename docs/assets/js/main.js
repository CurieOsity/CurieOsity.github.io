// Global variables
const path_logo = "/assets/CurieO"
const path_main = "/assets/main_page"

// Theme Manager
const ThemeManager = {
  init() {
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');
    
    this.applyTheme(initialTheme);
    document.documentElement.style.transition = 'all 0.3s ease';
  },

  applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    document.querySelector('.theme-toggle').textContent = 
      theme === 'dark' ? '🌙' : '☀️';
    document.querySelector('.logo img').src = `${path_logo}/Logo_full_${theme}.svg`;
    localStorage.setItem('theme', theme);
  },

  toggle() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }
};

// Mobile Menu Manager
const MobileMenu = {
  init() {
    this.registerEventListeners();
  },

  registerEventListeners() {
    document.querySelector('.hamburger').addEventListener('click', () => 
      this.toggleMenu()
    );

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-links') && !e.target.closest('.hamburger')) {
        this.closeMenu();
      }
    });

    document.querySelectorAll('.nav-links a').forEach(link => 
      link.addEventListener('click', () => this.closeMenu())
    );
  },

  toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.contains('active') ? this.closeMenu() : this.openMenu();
  },

  openMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.add('active');
  },

  closeMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks.classList.contains('active')) return;

    navLinks.classList.add('closing');
    navLinks.addEventListener('animationend', () => {
      navLinks.classList.remove('active', 'closing');
    }, { once: true });
  }
};

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
    // Now safe to initialize components
    ThemeManager.init();
    MobileMenu.init();
    // Fetch the JSON file and initialize DynamicContent once data is ready
    fetch(`${path_main}/main_page.json`)
      .then(response => response.json())
      .then(data => {
        DynamicContent.backgrounds = data.backgrounds;
        DynamicContent.greetings = data.greetings;
        DynamicContent.init();
      })
      .catch(error => console.error('Error loading images:', error));

    // Theme toggle event
    document.querySelector('.theme-toggle').addEventListener('click', () => {
      document.documentElement.style.transition = 'none';
      requestAnimationFrame(() => {
        document.documentElement.style.transition = 'all 0.3s ease';
      });
      ThemeManager.toggle();
    });
  });
})
