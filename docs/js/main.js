function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');
    
    document.body.setAttribute('data-theme', initialTheme);
    document.querySelector('.theme-toggle').textContent = 
        initialTheme === 'dark' ? '🌙' : '☀️';
    document.documentElement.style.transition = 'all 0.3s ease';
}

document.querySelector('.theme-toggle').addEventListener('click', () => {
    document.documentElement.style.transition = 'none';
    requestAnimationFrame(() => {
        document.documentElement.style.transition = 'all 0.3s ease';
    });
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    document.querySelector('.theme-toggle').textContent = 
        newTheme === 'dark' ? '🌙' : '☀️';
});

const greetings = [
    "Explorez l'univers avec nous",
    "Découvrez la physique autrement",
    "La science à portée de main"
];

document.querySelector('.dynamic-text').textContent = 
    greetings[Math.floor(Math.random() * greetings.length)];

// Initialize theme when page loads
initializeTheme();

// Mobile menu
document.querySelector('.hamburger').addEventListener('click', (e) => {
    const navLinks = document.querySelector('.nav-links');
    
    if (navLinks.classList.contains('active')) {
        navLinks.classList.add('closing');
        navLinks.addEventListener('animationend', () => {
            navLinks.classList.remove('active', 'closing');
        }, { once: true });
    } else {
        navLinks.classList.add('active');
    }
});


// Close menu when clicking outside or on links
document.addEventListener('click', (e) => {
    const navLinks = document.querySelector('.nav-links');
    if (!e.target.closest('.nav-links') && !e.target.closest('.hamburger')) {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.add('closing');
            navLinks.addEventListener('animationend', () => {
                navLinks.classList.remove('active', 'closing');
            }, { once: true });
        }
    }
});

// Close menu when clicking links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks.classList.contains('active')) {
            navLinks.classList.add('closing');
            navLinks.addEventListener('animationend', () => {
                navLinks.classList.remove('active', 'closing');
            }, { once: true });
        }
    });
});


// Random background images
const backgroundImages = [
    'image1.jpg',
    'image2.jpg',
    'image3.jpg',
    'image4.jpg'
];

function setRandomBackground() {
    const bgElement = document.getElementById('dynamic-background');
    const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    const timestamp = new Date().getTime(); // Cache buster

    bgElement.style.backgroundImage = `url(/images/${randomImage}?t=${timestamp})`;
}

// Call the function when page loads
window.addEventListener('load', setRandomBackground);
