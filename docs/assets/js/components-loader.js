// components-loader.js
(() => {
  'use strict';

  // Configuration constants
  const COMPONENTS_PATH = '/assets/includes';
  const COMPONENT_IDS = {
    HEADER: 'header',
    FOOTER: 'footer'
  };

  /**
   * Generic component loader function
   * @param {string} componentName - Name of the component to load
   * @returns {Promise<void>} Promise that resolves when component is loaded
   */
  const loadComponent = (componentName) => {
    const targetElement = document.getElementById(COMPONENT_IDS[componentName.toUpperCase()]);
    
    if (!targetElement) {
      return Promise.reject(new Error(`Target element for ${componentName} not found`));
    }

    return fetch(`${COMPONENTS_PATH}/${componentName}.html`)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.text();
      })
      .then(html => {
        targetElement.outerHTML = html;
      });
  };

  // Auto-initialize on script load and expose promise
  window.componentsLoaded = Promise.all([
    loadComponent('header'),
    loadComponent('footer')
  ]).catch(error => {
    console.error('Component loading error:', error);
    throw error; // Re-throw to maintain error chain
  });
})();
