// Global variables
const path_includes = "/assets/includes"

// Load header and footer with Promise-based approach
const loadComponents = {
  header: () => 
    fetch(`${path_includes}/header.html`)
      .then(response => response.text())
      .then(data => {
        document.getElementById('header').outerHTML = data;
      }),

  footer: () =>
    fetch(`${path_includes}/footer.html`)
      .then(response => response.text())
      .then(data => {
        document.getElementById('footer').outerHTML = data;
      })
};

// Export a promise that resolves when both are loaded
window.componentsLoaded = Promise.all([
  loadComponents.header(),
  loadComponents.footer()
]).catch(error => {
  console.error('Component loading error:', error);
});
