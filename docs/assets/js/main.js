/**
 * Theme Configuration Constants
 */
const ThemeConfig = {
  STORAGE_KEY: 'theme',
  DARK: 'dark',
  LIGHT: 'light',
  EMOJI: {
    DARK: '🌙',
    LIGHT: '☀️'
  },
  TRANSITION: 'all 0.3s ease'
};

/**
 * Mobile Menu Configuration Constants
 */
const MenuConfig = {
  CLASSES: {
    ACTIVE: 'active',
    CLOSING: 'closing'
  },
  SELECTORS: {
    NAV_LINKS: '.nav-links',
    HAMBURGER: '.hamburger',
    LINKS: '.nav-links a'
  },
  ANIMATION_END: 'animationend'
};

/**
 * Theme Manager
 */
const ThemeManager = {
  /**
   * Initialize theme management
   */
  init() {
    const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem(ThemeConfig.STORAGE_KEY);
    const initialTheme = savedTheme || (systemIsDark ? ThemeConfig.DARK : ThemeConfig.LIGHT);
    
    this.applyTheme(initialTheme);
    this._setupTransitions();
  },

  /**
   * Apply specified theme
   * @param {string} theme - Theme to apply (dark/light)
   */
  applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    this._updateThemeButton(theme);
    localStorage.setItem(ThemeConfig.STORAGE_KEY, theme);
  },

  /**
   * Toggle between dark/light themes
   */
  toggle() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === ThemeConfig.DARK ? ThemeConfig.LIGHT : ThemeConfig.DARK;
    this.applyTheme(newTheme);
  },

  /**
   * Update theme toggle button
   * @private
   */
  _updateThemeButton(theme) {
    const button = document.querySelector('.theme-toggle');
    if (button) {
      button.textContent = theme === ThemeConfig.DARK 
        ? ThemeConfig.EMOJI.DARK 
        : ThemeConfig.EMOJI.LIGHT;
    }
  },

  /**
   * Setup CSS transitions
   * @private
   */
  _setupTransitions() {
    document.documentElement.style.transition = ThemeConfig.TRANSITION;
  }
};

/**
 * Mobile Menu Manager
 */
const MobileMenu = {
  _elements: {
    navLinks: null,
    hamburger: null
  },

  /**
   * Initialize mobile menu
   */
  init() {
    this._cacheElements();
    this._registerEventListeners();
  },

  /**
   * Cache DOM elements
   * @private
   */
  _cacheElements() {
    this._elements.navLinks = document.querySelector(MenuConfig.SELECTORS.NAV_LINKS);
    this._elements.hamburger = document.querySelector(MenuConfig.SELECTORS.HAMBURGER);
  },

  /**
   * Register event listeners
   * @private
   */
  _registerEventListeners() {
    if (this._elements.hamburger) {
      this._elements.hamburger.addEventListener('click', () => this.toggleMenu());
    }

    document.addEventListener('click', (e) => this._handleDocumentClick(e));
    document.querySelectorAll(MenuConfig.SELECTORS.LINKS).forEach(link => 
      link.addEventListener('click', () => this.closeMenu())
    );
  },

  /**
   * Handle document click events
   * @private
   */
  _handleDocumentClick(event) {
    const isNavLink = event.target.closest(MenuConfig.SELECTORS.NAV_LINKS);
    const isHamburger = event.target.closest(MenuConfig.SELECTORS.HAMBURGER);
    
    if (!isNavLink && !isHamburger) {
      this.closeMenu();
    }
  },

  /**
   * Toggle menu visibility
   */
  toggleMenu() {
    this._elements.navLinks?.classList.contains(MenuConfig.CLASSES.ACTIVE) 
      ? this.closeMenu() 
      : this.openMenu();
  },

  /**
   * Open mobile menu
   */
  openMenu() {
    this._elements.navLinks?.classList.add(MenuConfig.CLASSES.ACTIVE);
  },

  /**
   * Close mobile menu
   */
  closeMenu() {
    const navLinks = this._elements.navLinks;
    if (!navLinks?.classList.contains(MenuConfig.CLASSES.ACTIVE)) return;

    navLinks.classList.add(MenuConfig.CLASSES.CLOSING);
    navLinks.addEventListener(MenuConfig.ANIMATION_END, () => {
      navLinks.classList.remove(MenuConfig.CLASSES.ACTIVE, MenuConfig.CLASSES.CLOSING);
    }, { once: true });
  }
};

/**
 * Initialize application
 */
function initializeApp() {
  window.componentsLoaded.then(() => {
    ThemeManager.init();
    MobileMenu.init();
    
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle?.addEventListener('click', () => {
      // Temporary disable transitions during theme switch
      document.documentElement.style.transition = 'none';
      requestAnimationFrame(() => {
        document.documentElement.style.transition = ThemeConfig.TRANSITION;
      });
      ThemeManager.toggle();
    });
  });
}

document.addEventListener('DOMContentLoaded', initializeApp);
