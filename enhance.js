/* ============================================================
   enhance.js  — performance-first
   • Single mousemove listener with RAF throttling
   • Carousel width computed once, recalculated on resize only
   • No per-card mousemove listeners (tilt removed)
   • Passive event listeners throughout
   ============================================================ */

(function () {
  'use strict';

  const qs  = s => document.querySelector(s);
  const qsa = s => [...document.querySelectorAll(s)];

  /* ════════════════════════════════════════════════════════════
     1. CURSOR  — single RAF loop, no per-element listeners
  ════════════════════════════════════════════════════════════ */
  const dot  = qs('.cursor-dot');
  const ring = qs('.cursor-ring');

  if (dot && ring) {
    let mx = -200, my = -200;
    let rx = -200, ry = -200;
    let rafPending = false;

    /* single mousemove — passive so scroll is never blocked */
    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(moveCursor);
      }
    }, { passive: true });

    function moveCursor() {
      rafPending = false;
      dot.style.transform  = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
      /* ring lerps toward dot position */
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
      /* keep lerping until ring reaches dot */
      if (Math.abs(mx - rx) > .5 || Math.abs(my - ry) > .5) {
        requestAnimationFrame(moveCursor);
      }
    }

    /* Use event delegation — one listener on body, not N on every element */
    const hoverSelector = 'a, button, .service-mini, .carousel-btn, .pill-link';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverSelector)) document.body.classList.add('cursor-hover');
    }, { passive: true });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverSelector)) document.body.classList.remove('cursor-hover');
    }, { passive: true });

    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; }, { passive: true });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; }, { passive: true });
  }


  /* ════════════════════════════════════════════════════════════
     2. MAGNETIC BUTTONS  — lightweight, no continuous RAF
  ════════════════════════════════════════════════════════════ */
  qsa('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.18;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.18;
      btn.style.transform = `translate(${dx}px,${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });


  /* ════════════════════════════════════════════════════════════
     3. STATS COUNTER
  ════════════════════════════════════════════════════════════ */
  function animateCount(el) {
    const target = +el.dataset.target;
    const dur    = 1400;
    const start  = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3); // ease-out-cubic
      el.textContent = Math.floor(e * target);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCount(e.target); statsObs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  qsa('.stat-num').forEach(n => statsObs.observe(n));


  /* ════════════════════════════════════════════════════════════
     4. SCROLL REVEAL
  ════════════════════════════════════════════════════════════ */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  qsa('.reveal').forEach(el => revealObs.observe(el));


  /* ════════════════════════════════════════════════════════════
     5. CAROUSEL  — pixel-precise, no layout thrash
  ════════════════════════════════════════════════════════════ */
  const wrapper   = qs('.carousel-wrapper');
  const container = qs('.carousel-track-container');
  const track     = qs('.carousel-track');
  const slides    = qsa('.carousel-slide');
  const prevBtn   = qs('.carousel-prev');
  const nextBtn   = qs('.carousel-next');
  const dotsWrap  = qs('.carousel-dots');

  if (!track || !slides.length) return;

  const GAP    = 20;   /* must match padding-right in CSS */
  let current  = 0;
  let perView  = 3;
  let slideW   = 0;    /* computed once per layout */
  let autoId   = null;

  /* ── Compute slide width once ─────────────────────────────── */
  function measure() {
    const vw = container.offsetWidth;
    perView  = vw >= 860 ? 3 : vw >= 540 ? 2 : 1;
    /* each slide: equal share of container minus gaps between visible slides */
    slideW = (vw - GAP * (perView - 1)) / perView;

    slides.forEach(s => { s.style.width = slideW + 'px'; });

    /* clamp current index after resize */
    const max = slides.length - perView;
    if (current > max) current = Math.max(0, max);
    applyPosition(false); /* instant reposition, no animation */
    buildDots();
    updateArrows();
  }

  /* ── Move track (transform only — composited) ─────────────── */
  function applyPosition(animate) {
    track.style.transition = animate
      ? 'transform .42s cubic-bezier(.4,0,.2,1)'
      : 'none';
    track.style.transform = `translateX(${-current * (slideW + GAP)}px)`;
  }

  /* ── Dots ─────────────────────────────────────────────────── */
  function buildDots() {
    const total = slides.length - perView + 1;
    if (dotsWrap.children.length === total) {
      /* just update active state — avoid DOM rebuild */
      qsa('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === current));
      return;
    }
    dotsWrap.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const d = document.createElement('button');
      d.className = 'carousel-dot' + (i === current ? ' active' : '');
      d.setAttribute('aria-label', `Slide ${i + 1}`);
      d.addEventListener('click', () => { goTo(i); resetAuto(); });
      dotsWrap.appendChild(d);
    }
  }

  function updateDots() {
    qsa('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function updateArrows() {
    prevBtn.classList.toggle('disabled', current === 0);
    nextBtn.classList.toggle('disabled', current >= slides.length - perView);
  }

  /* ── Navigate ─────────────────────────────────────────────── */
  function goTo(idx) {
    const max = slides.length - perView;
    current   = Math.max(0, Math.min(idx, max));
    applyPosition(true);
    updateDots();
    updateArrows();
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  /* ── Autoplay ─────────────────────────────────────────────── */
  function startAuto() {
    autoId = setInterval(() => {
      goTo(current >= slides.length - perView ? 0 : current + 1);
    }, 4500);
  }
  function resetAuto() { clearInterval(autoId); startAuto(); }

  wrapper.addEventListener('mouseenter', () => clearInterval(autoId), { passive: true });
  wrapper.addEventListener('mouseleave', startAuto, { passive: true });

  /* ── Touch swipe ─────────────────────────────────────────── */
  let tx0 = 0;
  container.addEventListener('touchstart', e => { tx0 = e.touches[0].clientX; }, { passive: true });
  container.addEventListener('touchend',   e => {
    const dx = tx0 - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 36) { goTo(dx > 0 ? current + 1 : current - 1); resetAuto(); }
  }, { passive: true });

  /* ── Init & resize ─────────────────────────────────────────── */
  measure();
  startAuto();

  let resizeRaf;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(measure);
  }, { passive: true });

})();
