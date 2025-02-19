// newsLoader.js

document.addEventListener("DOMContentLoaded", function () {
  fetch('data/hot-news.md')
    .then(response => response.text())
    .then(markdown => {
      // A simple conversion for demonstration; for production use marked.js or similar.
      // This example only converts line breaks.
      const htmlContent = markdown.replace(/\n/g, "<br>");
      document.getElementById('news-content').innerHTML = htmlContent;
    })
    .catch(err => console.error('Error loading hot news:', err));
});
