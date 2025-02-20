// Load header and footer with Promise-based approach
const loadComponents = {
  header: () => 
    fetch('/includes/header.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('header').outerHTML = data;
      }),

  footer: () =>
    fetch('/includes/footer.html')
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
