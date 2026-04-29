/* ============================================================
   enhance.js  — cursor · magnetic buttons · stats · reveal
   Carousel removed — grid layout needs no JS
   ============================================================ */

(function () {
  'use strict';

  const qs  = s => document.querySelector(s);
  const qsa = s => [...document.querySelectorAll(s)];

  /* ── Cursor ──────────────────────────────────────────────── */
  const dot  = qs('.cursor-dot');
  const ring = qs('.cursor-ring');

  if (dot && ring) {
    let mx = -200, my = -200, rx = -200, ry = -200;
    let rafPending = false;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(tick);
      }
    }, { passive: true });

    function tick() {
      rafPending = false;
      dot.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
      if (Math.abs(mx - rx) > .5 || Math.abs(my - ry) > .5) requestAnimationFrame(tick);
    }

    /* event delegation — one listener, not N */
    const sel = 'a, button, .service-mini, .pill-link';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(sel)) document.body.classList.add('cursor-hover');
    }, { passive: true });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(sel)) document.body.classList.remove('cursor-hover');
    }, { passive: true });

    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; }, { passive: true });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; }, { passive: true });
  }

  /* ── Magnetic Buttons ────────────────────────────────────── */
  qsa('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.18;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.18;
      btn.style.transform = `translate(${dx}px,${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  /* ── Scroll Reveal ───────────────────────────────────────── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  qsa('.reveal').forEach(el => revealObs.observe(el));

})();
