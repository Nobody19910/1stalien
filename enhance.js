/* ============================================================
   enhance.js — magnetic buttons + scroll reveal only
   Cursor removed (system pointer restored)
   ============================================================ */

(function () {
  'use strict';

  const qs  = s => document.querySelector(s);
  const qsa = s => [...document.querySelectorAll(s)];

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
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  qsa('.reveal').forEach(el => obs.observe(el));

})();
