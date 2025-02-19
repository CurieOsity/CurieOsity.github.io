// main.js

// Array of dynamic introduction texts for the homepage
const introTexts = [
  "Explorez l'univers de la physique autrement.",
  "Chaque visite est une redécouverte.",
  "La science vous ouvre ses portes."
];

// Set dynamic introduction text on page load
document.addEventListener("DOMContentLoaded", function () {
  const introElement = document.getElementById("intro-text");
  if (introElement) {
    const randomText = introTexts[Math.floor(Math.random() * introTexts.length)];
    introElement.textContent = randomText;
  }
});

// Theme toggle functionality
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark-theme");
  document.body.classList.toggle("light-theme");
});

