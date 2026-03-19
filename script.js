// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ===== STARFIELD PARTICLE BACKGROUND =====
const canvas = document.getElementById('starfield');
if (canvas) {
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
  window.addEventListener('resize', () => { resizeCanvas(); createStars(); });
}

// ===== SCROLL REVEAL ANIMATION =====
function revealOnScroll() {
  document.querySelectorAll('.reveal').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 80) {
      el.classList.add('active');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ===== TYPING ANIMATION =====
const typingEl = document.querySelector('.typing-text');
if (typingEl) {
  const phrases = ['Creative Mind', 'Graphic Designer', 'Motion Artist', '3D Visionary'];
  let phraseIndex = 0, charIndex = 0, isDeleting = false;

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
}

// ===== PARALLAX SCROLLING =====
const parallaxBgs = document.querySelectorAll('.parallax-bg');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  parallaxBgs.forEach(bg => {
    const section = bg.parentElement;
    const speed = parseFloat(section.dataset.speed) || 0.3;
    const offset = section.offsetTop;
    const yPos = (scrollY - offset) * speed;
    bg.style.transform = `translateY(${yPos}px)`;
  });
});

// ===== BOTTOM PILL NAV - ACTIVE STATE =====
const pillLinks = document.querySelectorAll('.pill-link[data-section]');
if (pillLinks.length > 0) {
  window.addEventListener('scroll', () => {
    let current = '';
    document.querySelectorAll('section[id]').forEach(section => {
      const top = section.offsetTop - 200;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    pillLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === current) {
        link.classList.add('active');
      }
    });
  });
}

// ===== 3D CAROUSEL =====
const ring = document.querySelector('.carousel-ring');
if (ring) {
  const cards = document.querySelectorAll('.carousel-card');
  const cardCount = cards.length;
  const angleStep = 360 / cardCount;
  const radius = 350;
  let currentAngle = 0;

  // Position cards in a circle
  cards.forEach((card, i) => {
    const angle = angleStep * i;
    card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
  });

  function rotateCarousel() {
    ring.style.transform = `rotateY(${currentAngle}deg)`;
  }

  document.querySelector('.carousel-btn.prev')?.addEventListener('click', () => {
    currentAngle += angleStep;
    rotateCarousel();
  });

  document.querySelector('.carousel-btn.next')?.addEventListener('click', () => {
    currentAngle -= angleStep;
    rotateCarousel();
  });

  // Auto-rotate
  let autoRotate = setInterval(() => {
    currentAngle -= angleStep;
    rotateCarousel();
  }, 4000);

  // Pause on hover
  const wrapper = document.querySelector('.carousel-wrapper');
  wrapper?.addEventListener('mouseenter', () => clearInterval(autoRotate));
  wrapper?.addEventListener('mouseleave', () => {
    autoRotate = setInterval(() => {
      currentAngle -= angleStep;
      rotateCarousel();
    }, 4000);
  });

  // Touch/drag support
  let touchStartX = 0;
  const scene = document.querySelector('.carousel-scene');
  scene?.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    clearInterval(autoRotate);
  });
  scene?.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 40) {
      currentAngle += diff > 0 ? angleStep : -angleStep;
      rotateCarousel();
    }
  });
}

// ===== SCRAPYARD LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lightboxContent = lightbox.querySelector('.lightbox-content');

  document.querySelectorAll('.scrap-item img, .scrap-item video').forEach(el => {
    el.addEventListener('click', () => {
      lightboxContent.innerHTML = '';
      const clone = el.cloneNode(true);
      if (clone.tagName === 'VIDEO') {
        clone.controls = true;
        clone.autoplay = true;
      }
      lightboxContent.appendChild(clone);
      lightbox.classList.add('open');
    });
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
      lightbox.classList.remove('open');
      const vid = lightboxContent.querySelector('video');
      if (vid) vid.pause();
    }
  });
}
