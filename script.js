// ===== SMOOTH SCROLLING =====
const links = document.querySelectorAll('a[href^="#"]');
links.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ===== NAVIGATION TOGGLE =====
const navToggle = document.querySelector('.nav-toggle');
const navbar = document.querySelector('.navbar');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navbar.classList.toggle('active');
  });
}

// ===== STARFIELD PARTICLE BACKGROUND =====
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
const STAR_COUNT = 200;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createStars() {
  stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.8 + 0.2,
      pulse: Math.random() * Math.PI * 2
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(star => {
    star.y += star.speed;
    star.pulse += 0.02;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
    const flicker = Math.sin(star.pulse) * 0.3 + 0.7;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 171, 240, ${star.opacity * flicker})`;
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}

resizeCanvas();
createStars();
drawStars();
window.addEventListener('resize', () => {
  resizeCanvas();
  createStars();
});

// ===== SCROLL REVEAL ANIMATION =====
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(el => {
    const windowHeight = window.innerHeight;
    const top = el.getBoundingClientRect().top;
    if (top < windowHeight - 80) {
      el.classList.add('active');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ===== TYPING ANIMATION =====
const typingEl = document.querySelector('.typing-text');
const phrases = ['Creative Mind', 'Graphic Designer', 'Motion Artist', '3D Visionary'];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  const current = phrases[phraseIndex];
  if (isDeleting) {
    typingEl.textContent = current.substring(0, charIndex--);
    if (charIndex < 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typeLoop, 400);
      return;
    }
    setTimeout(typeLoop, 40);
  } else {
    typingEl.textContent = current.substring(0, charIndex++);
    if (charIndex > current.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
    setTimeout(typeLoop, 80);
  }
}
typeLoop();
