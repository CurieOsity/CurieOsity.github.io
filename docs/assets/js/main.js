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
    document.querySelector('.theme-toggle')
          .textContent = theme === 'dark' ? '🌙' : '☀️';
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

document.addEventListener('DOMContentLoaded', () => {
  window.componentsLoaded.then(() => {
    ThemeManager.init();
    MobileMenu.init();
    document.querySelector('.theme-toggle').addEventListener('click', () => {
      document.documentElement.style.transition = 'none';
      requestAnimationFrame(() => {
        document.documentElement.style.transition = 'all 0.3s ease';
      });
      ThemeManager.toggle();
    });
  });
})
