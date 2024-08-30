// Smooth scrolling
const links = document.querySelectorAll('a[href^="#"]');

links.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));

    target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navbar = document.querySelector('.navbar');

navToggle.addEventListener('click', () => {
  navbar.classList.toggle('active');
});