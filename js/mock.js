// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const currentTheme = localStorage.getItem('theme');

// Set initial theme
if (currentTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    darkModeToggle.checked = true;
} else if (currentTheme === 'light') {
    document.body.setAttribute('data-theme', 'light');
    darkModeToggle.checked = false;
} else if (prefersDarkScheme.matches) {
    document.body.setAttribute('data-theme', 'dark');
    darkModeToggle.checked = true;
    localStorage.setItem('theme', 'dark');
} else {
    document.body.setAttribute('data-theme', 'light');
    darkModeToggle.checked = false;
    localStorage.setItem('theme', 'light');
}

// Toggle dark mode
darkModeToggle.addEventListener('change', function() {
    if (this.checked) {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.innerHTML = navLinks.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Help button functionality
const helpButton = document.querySelector('.help-button');
helpButton.addEventListener('click', (e) => {
    e.preventDefault();
    alert('For assistance, please contact us at support@japasafe.com');
});
