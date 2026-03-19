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

// ===== ALIEN CANVAS — WAVY LINES + PARTICLES =====
const alienCanvas = document.getElementById('alienCanvas');
if (alienCanvas) {
  const actx = alienCanvas.getContext('2d');
  let time = 0;
  let alienParticles = [];
  const PARTICLE_COUNT = 60;

  function resizeAlienCanvas() {
    const section = alienCanvas.parentElement;
    alienCanvas.width = section.offsetWidth;
    alienCanvas.height = section.offsetHeight;
  }

  // Create floating particles
  function createAlienParticles() {
    alienParticles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      alienParticles.push({
        x: Math.random() * alienCanvas.width,
        y: Math.random() * alienCanvas.height,
        radius: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? '0, 171, 240' : '115, 191, 67',
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  function drawAlienScene() {
    actx.clearRect(0, 0, alienCanvas.width, alienCanvas.height);
    const w = alienCanvas.width;
    const h = alienCanvas.height;
    time += 0.008;

    // Draw thick wavy lines
    for (let i = 0; i < 6; i++) {
      actx.beginPath();
      const baseY = (h / 7) * (i + 1);
      const amplitude = 30 + i * 8;
      const frequency = 0.003 + i * 0.0005;
      const phaseOffset = i * 0.8;
      const lineWidth = 3 + i * 0.5;

      for (let x = 0; x <= w; x += 2) {
        const y = baseY +
          Math.sin(x * frequency + time * 2 + phaseOffset) * amplitude +
          Math.sin(x * frequency * 2.5 + time * 1.5 + phaseOffset) * (amplitude * 0.3);
        if (x === 0) actx.moveTo(x, y);
        else actx.lineTo(x, y);
      }

      const hue = i % 2 === 0 ? '0, 171, 240' : '115, 191, 67';
      actx.strokeStyle = `rgba(${hue}, ${0.06 + i * 0.015})`;
      actx.lineWidth = lineWidth;
      actx.lineCap = 'round';
      actx.stroke();

      // Draw a second pass with glow
      actx.strokeStyle = `rgba(${hue}, ${0.03 + i * 0.008})`;
      actx.lineWidth = lineWidth + 6;
      actx.stroke();
    }

    // Draw additional crossing wavy lines (diagonal feel)
    for (let i = 0; i < 4; i++) {
      actx.beginPath();
      const startX = (w / 5) * (i + 1);
      const amplitude = 40;
      const frequency = 0.004;

      for (let y = 0; y <= h; y += 2) {
        const x = startX +
          Math.sin(y * frequency + time * 1.8 + i * 1.2) * amplitude +
          Math.cos(y * frequency * 1.5 + time + i) * (amplitude * 0.4);
        if (y === 0) actx.moveTo(x, y);
        else actx.lineTo(x, y);
      }

      const hue = i % 2 === 0 ? '115, 191, 67' : '0, 171, 240';
      actx.strokeStyle = `rgba(${hue}, 0.04)`;
      actx.lineWidth = 2.5;
      actx.stroke();
      actx.strokeStyle = `rgba(${hue}, 0.02)`;
      actx.lineWidth = 8;
      actx.stroke();
    }

    // Draw floating particles
    alienParticles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += 0.03;

      // Wrap around
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      const flicker = Math.sin(p.pulse) * 0.3 + 0.7;
      const r = p.radius + Math.sin(p.pulse) * 0.5;

      // Glow
      actx.beginPath();
      actx.arc(p.x, p.y, r + 4, 0, Math.PI * 2);
      actx.fillStyle = `rgba(${p.color}, ${p.opacity * flicker * 0.15})`;
      actx.fill();

      // Core
      actx.beginPath();
      actx.arc(p.x, p.y, r, 0, Math.PI * 2);
      actx.fillStyle = `rgba(${p.color}, ${p.opacity * flicker})`;
      actx.fill();
    });

    requestAnimationFrame(drawAlienScene);
  }

  resizeAlienCanvas();
  createAlienParticles();
  drawAlienScene();

  window.addEventListener('resize', () => {
    resizeAlienCanvas();
    createAlienParticles();
  });
}

// ===== ORBIT THUMBNAILS POSITIONING =====
const orbitThumbs = document.querySelectorAll('.orbit-thumb');
if (orbitThumbs.length > 0) {
  const count = orbitThumbs.length;
  const isMobile = window.innerWidth <= 600;
  const orbitRadius = isMobile ? 140 : 220;

  function positionThumbs() {
    orbitThumbs.forEach((thumb, i) => {
      const angle = (360 / count) * i;
      thumb.style.transform = `rotate(${angle}deg) translateX(${orbitRadius}px) rotate(-${angle}deg)`;
    });
  }
  positionThumbs();
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
