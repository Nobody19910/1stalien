/* ============================================================
   enhance.js  — layered on top of script.js
   Carousel · Custom Cursor · Tilt Cards · Stats Counter
   ============================================================ */

(function () {
  'use strict';

  /* ── Helpers ─────────────────────────────────────────────── */
  const qs  = s => document.querySelector(s);
  const qsa = s => [...document.querySelectorAll(s)];

  /* ════════════════════════════════════════════════════════════
     1. CUSTOM CURSOR
  ════════════════════════════════════════════════════════════ */
  const dot  = qs('.cursor-dot');
  const ring = qs('.cursor-ring');

  if (dot && ring) {
    let mx = -200, my = -200, rx = -200, ry = -200;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
    });

    // ring follows with smooth lerp
    (function lerpRing() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(lerpRing);
    })();

    // hover state on interactive elements
    const hoverEls = 'a, button, .service-mini, .scrap-item, .carousel-btn, .pill-link, .stat-item';
    qsa(hoverEls).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // hide cursor when it leaves the window
    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
  }


  /* ════════════════════════════════════════════════════════════
     2. MAGNETIC BUTTON EFFECT
  ════════════════════════════════════════════════════════════ */
  qsa('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r   = btn.getBoundingClientRect();
      const cx  = r.left + r.width  / 2;
      const cy  = r.top  + r.height / 2;
      const dx  = (e.clientX - cx) * 0.22;
      const dy  = (e.clientY - cy) * 0.22;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });


  /* ════════════════════════════════════════════════════════════
     3. TILT EFFECT ON CARDS
  ════════════════════════════════════════════════════════════ */
  function applyTilt(el) {
    el.addEventListener('mousemove', e => {
      const r   = el.getBoundingClientRect();
      const x   = (e.clientX - r.left) / r.width  - 0.5;
      const y   = (e.clientY - r.top)  / r.height - 0.5;
      el.style.transform = `
        perspective(600px)
        rotateY(${x * 10}deg)
        rotateX(${-y * 10}deg)
        scale(1.025)
      `;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  }
  qsa('.tilt-card').forEach(applyTilt);


  /* ════════════════════════════════════════════════════════════
     4. STATS COUNTER ANIMATION
  ════════════════════════════════════════════════════════════ */
  function animateCount(el) {
    const target   = +el.dataset.target;
    const duration = 1600;
    const start    = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.floor(ease * target);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        statsObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  qsa('.stat-num').forEach(n => statsObserver.observe(n));


  /* ════════════════════════════════════════════════════════════
     5. SCROLL REVEAL
  ════════════════════════════════════════════════════════════ */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  qsa('.reveal').forEach(el => revealObs.observe(el));


  /* ════════════════════════════════════════════════════════════
     6. CAROUSEL
  ════════════════════════════════════════════════════════════ */
  const track     = qs('.carousel-track');
  const slides    = qsa('.carousel-slide');
  const prevBtn   = qs('.carousel-prev');
  const nextBtn   = qs('.carousel-next');
  const dotsWrap  = qs('.carousel-dots');
  const container = qs('.carousel-track-container');

  if (!track || !slides.length) return;

  let current     = 0;
  let autoTimer   = null;
  let isAnimating = false;

  /* How many slides are visible at once */
  function visibleCount() {
    const w = container.offsetWidth;
    if (w >= 900) return 3;
    if (w >= 560) return 2;
    return 1;
  }

  /* Build dots */
  function buildDots() {
    dotsWrap.innerHTML = '';
    const total = slides.length - visibleCount() + 1;
    for (let i = 0; i < total; i++) {
      const d = document.createElement('button');
      d.className = 'carousel-dot' + (i === current ? ' active' : '');
      d.setAttribute('aria-label', `Go to slide ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }

  /* Slide to position */
  function goTo(idx) {
    if (isAnimating) return;
    const maxIdx = slides.length - visibleCount();
    current = Math.max(0, Math.min(idx, maxIdx));

    const gapPx  = 24;
    const slideW = slides[0].offsetWidth + gapPx;
    track.style.transform = `translateX(${-current * slideW}px)`;

    isAnimating = true;
    setTimeout(() => isAnimating = false, 520);

    // update dots
    qsa('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === current));

    // update arrows
    prevBtn.classList.toggle('disabled', current === 0);
    nextBtn.classList.toggle('disabled', current >= slides.length - visibleCount());
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  /* Auto-play */
  function startAuto() {
    autoTimer = setInterval(() => {
      const maxIdx = slides.length - visibleCount();
      goTo(current >= maxIdx ? 0 : current + 1);
    }, 4000);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  // Pause on hover
  const wrapper = qs('.carousel-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', () => clearInterval(autoTimer));
    wrapper.addEventListener('mouseleave', startAuto);
  }

  /* Touch / swipe */
  let touchStartX = 0;
  container.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  container.addEventListener('touchend',   e => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) dx > 0 ? goTo(current + 1) : goTo(current - 1);
    resetAuto();
  });

  /* Init and re-init on resize */
  function init() {
    buildDots();
    goTo(current);
    clearInterval(autoTimer);
    startAuto();
  }

  init();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 200);
  });

})();
