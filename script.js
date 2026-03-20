// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ===== ANIMATED FLOWING LINES BACKGROUND =====
const canvas = document.getElementById('starfield');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let lines = [];
  let mouse = { x: -1000, y: -1000 };
  const LINE_COUNT = 18;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createLines() {
    lines = [];
    for (let i = 0; i < LINE_COUNT; i++) {
      const points = [];
      const y = (canvas.height / (LINE_COUNT + 1)) * (i + 1);
      const segments = 12;
      for (let j = 0; j <= segments; j++) {
        points.push({
          x: (canvas.width / segments) * j,
          baseY: y,
          y: y,
          speed: 0.3 + Math.random() * 0.5,
          amplitude: 15 + Math.random() * 25,
          phase: Math.random() * Math.PI * 2
        });
      }
      lines.push({
        points,
        color: `rgba(196, 122, 42, ${0.04 + Math.random() * 0.06})`,
        width: 1 + Math.random() * 1.5
      });
    }
  }

  let time = 0;
  function drawLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time += 0.008;

    lines.forEach(line => {
      line.points.forEach(pt => {
        const dx = mouse.x - pt.x;
        const dy = mouse.y - pt.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = dist < 200 ? (1 - dist / 200) * 40 : 0;
        const direction = dy > 0 ? -1 : 1;
        pt.y = pt.baseY + Math.sin(time * pt.speed + pt.phase) * pt.amplitude + influence * direction;
      });

      ctx.beginPath();
      ctx.moveTo(line.points[0].x, line.points[0].y);
      for (let i = 1; i < line.points.length - 1; i++) {
        const xc = (line.points[i].x + line.points[i + 1].x) / 2;
        const yc = (line.points[i].y + line.points[i + 1].y) / 2;
        ctx.quadraticCurveTo(line.points[i].x, line.points[i].y, xc, yc);
      }
      const last = line.points[line.points.length - 1];
      ctx.lineTo(last.x, last.y);
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.width;
      ctx.stroke();
    });

    requestAnimationFrame(drawLines);
  }

  resizeCanvas();
  createLines();
  drawLines();
  window.addEventListener('resize', () => { resizeCanvas(); createLines(); });
  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
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

// ===== BOTTOM PILL NAV - ACTIVE STATE =====
const pillLinks = document.querySelectorAll('.pill-link[data-section]');
if (pillLinks.length > 0) {
  window.addEventListener('scroll', () => {
    let current = '';
    document.querySelectorAll('section[id], [id="about"]').forEach(section => {
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

// ===== INTERACTIVE FLOATING SHAPES =====
document.querySelectorAll('.interactive-shape').forEach(shape => {
  let baseX = parseFloat(shape.style.left);
  let baseY = parseFloat(shape.style.top);
  let angle = Math.random() * Math.PI * 2;
  let speed = 0.003 + Math.random() * 0.005;
  let radius = 8 + Math.random() * 12;

  function float() {
    angle += speed;
    const offsetX = Math.sin(angle) * radius;
    const offsetY = Math.cos(angle * 0.7) * radius;
    shape.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    requestAnimationFrame(float);
  }
  float();

  shape.addEventListener('click', () => {
    shape.style.transition = 'transform 0.3s, opacity 0.3s';
    shape.style.transform = 'scale(3)';
    shape.style.opacity = '0';
    setTimeout(() => {
      shape.style.transform = 'scale(1)';
      shape.style.opacity = '0.25';
      shape.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s';
    }, 500);
  });
});
