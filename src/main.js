import '@fontsource/anton/400.css';
import '@fontsource-variable/inter';
import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { SHOPS, REVIEWS, MIXTAPES, SERVICES, PHOTOS, GALLERY, SERVICE_PHOTOS, photoUrl } from './data.js';

gsap.registerPlugin(ScrollTrigger);
document.documentElement.classList.add('js');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------------- Content from data ---------------- */
const initials = (n) => n.split(' ').map((p) => p[0]).join('');
const avatarColors = ['#e63b2e', '#c8963e', '#f4ecdf', '#7aa2d6'];
function reviewCard(r, i, clone) {
  return `<article class="review"${clone ? ' data-clone aria-hidden="true"' : ''}>
    <span class="stars" aria-label="5 out of 5 stars">★★★★★</span>
    <p>${r.text}</p>
    <footer><span class="avatar" style="background:${avatarColors[i % 4]}" aria-hidden="true">${initials(r.name)}</span><span><strong style="color:var(--ink)">${r.name}</strong><br/>${r.shop}</span></footer>
  </article>`;
}
const half = Math.ceil(REVIEWS.length / 2);
[REVIEWS.slice(0, half), REVIEWS.slice(half)].forEach((list, row) => {
  const track = $(`[data-review-track="${row + 1}"]`);
  // duplicated once so the CSS loop is seamless
  track.innerHTML = list.map((r, i) => reviewCard(r, i + row, false)).join('') + list.map((r, i) => reviewCard(r, i + row, true)).join('');
});

$('[data-loc-grid]').innerHTML = SHOPS.map((s) => `<li><a class="loc" href="#top" data-book data-shop="${s.name}">
  <img class="loc-img" src="${photoUrl(s.photo)}" alt="" loading="lazy" decoding="async" width="800" height="533" />
  <h3>${s.name}</h3>
  <div class="loc-meta"><span>${s.address}<br/>${s.hours}</span><span class="loc-open">Open now</span></div>
</a></li>`).join('');

$('[data-mix]').innerHTML = MIXTAPES.map((m) => `<button class="mix" type="button" style="--label:${m.color}" aria-pressed="false">
  <div class="vinyl" aria-hidden="true"></div>
  <div><h3>${m.title}</h3><small>${m.by} &middot; ${m.tracks} tracks</small></div>
  <span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
</button>`).join('');
$$('.mix').forEach((b) => b.addEventListener('click', () => {
  const on = !b.classList.contains('playing');
  $$('.mix').forEach((x) => { x.classList.remove('playing'); x.setAttribute('aria-pressed', 'false'); });
  b.classList.toggle('playing', on); b.setAttribute('aria-pressed', String(on));
}));

$('[data-year]').textContent = new Date().getFullYear();

$('[data-gallery-track]').innerHTML = GALLERY.map((g, i) => {
  const p = PHOTOS[g.photo];
  return `<figure class="g-card${i % 2 ? ' low' : ''}">
    <div class="g-frame"><img src="${photoUrl(g.photo)}" alt="${p.alt}" loading="lazy" decoding="async" width="1400" height="933" /></div>
    <figcaption><span>${g.caption}</span><a href="${p.page}" target="_blank" rel="noopener">Photo: ${p.by}</a></figcaption>
  </figure>`;
}).join('');
const used = new Set([...GALLERY.map((g) => g.photo), ...SHOPS.map((s) => s.photo), ...Object.values(SERVICE_PHOTOS)]);
$('[data-photo-credits]').innerHTML = [...new Set([...used].map((k) => PHOTOS[k].by))].join(', ');

/* ---------------- Smooth scroll ---------------- */
let lenis;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
$$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
  const id = a.getAttribute('href');
  if (a.hasAttribute('data-book') || id.length < 2) return;
  const el = $(id); if (!el) return;
  e.preventDefault();
  closeMenu();
  lenis ? lenis.scrollTo(el, { offset: -70 }) : el.scrollIntoView();
}));

/* ---------------- Nav: solid on scroll, hide on scroll down ---------------- */
const nav = $('[data-nav]');
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 40);
  nav.classList.toggle('hide', y > 500 && y > lastY && !document.body.classList.contains('menu-open'));
  lastY = y;
}, { passive: true });

const menuBtn = $('[data-menu-btn]'), menu = $('[data-menu]');
function closeMenu() { menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); lenis?.start(); }
menuBtn.addEventListener('click', () => {
  const open = menu.hidden;
  menu.hidden = !open; menuBtn.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
  open ? lenis?.stop() : lenis?.start();
});

/* ---------------- Hero intro ---------------- */
$$('[data-split]').forEach((el) => {
  el.innerHTML = [...el.textContent].map((c) => `<span class="char">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
});
if (!reduced) {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('[data-hero-media]', { scale: 1.3, opacity: 0, duration: 2.2, ease: 'power2.out' })
    .from('[data-hero-spot]', { opacity: 0, duration: 1.6, ease: 'power2.out' }, 0.4)
    .from('.hero-title .char', { yPercent: 115, rotate: 6, duration: 1.1, stagger: 0.028 }, 0.2)
    .from('[data-hero-fade]', { y: 24, opacity: 0, duration: 0.9, stagger: 0.12 }, 0.7)
    .from('.nav > *', { y: -20, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.5);

  // hero parallax as you scroll away
  // video drifts down, zooms in and dims as the next section takes over
  // explicit start values so scrolling back to the top always restores the video fully
  gsap.fromTo('.hero-video', { yPercent: 0, scale: 1, opacity: 1 }, { yPercent: 14, scale: 1.18, opacity: 0.35, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-inner', { yPercent: -25, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
}

/* ---------------- Hero: right-sized video + spotlight + depth tilt ---------------- */
{
  const hero = $('.hero');
  const vid = $('.hero-video');
  const media = $('[data-hero-media]');
  const spot = $('[data-hero-spot]');
  const title = $('.hero-title');

  // Portrait screens get the tall cut, landscape screens the wide one
  const portrait = window.matchMedia('(max-aspect-ratio: 1/1)');
  const pickCut = () => {
    const k = portrait.matches ? 'tall' : 'wide';
    if (vid.dataset.cut === k) return;
    vid.dataset.cut = k;
    vid.poster = vid.dataset[`${k}Poster`];
    vid.src = vid.dataset[k];
    if (!reduced) vid.play().catch(() => {});
  };
  pickCut();
  portrait.addEventListener('change', pickCut);

  if (!reduced) {
    const pos = { x: 0.72, y: 0.42 }; // spotlight position, 0..1 of the hero
    const render = () => { spot.style.setProperty('--sx', `${pos.x * 100}%`); spot.style.setProperty('--sy', `${pos.y * 100}%`); };
    const spotX = gsap.quickTo(pos, 'x', { duration: 0.9, ease: 'power3', onUpdate: render });
    const spotY = gsap.quickTo(pos, 'y', { duration: 0.9, ease: 'power3', onUpdate: render });
    const mx = gsap.quickTo(media, 'x', { duration: 1.2, ease: 'power3' });
    const my = gsap.quickTo(media, 'y', { duration: 1.2, ease: 'power3' });
    const rx = gsap.quickTo(title, 'rotationX', { duration: 1, ease: 'power3' });
    const ry = gsap.quickTo(title, 'rotationY', { duration: 1, ease: 'power3' });
    // u, v in -0.5..0.5: video moves against the pointer, headline tilts toward it
    const depth = (u, v) => { mx(-u * 40); my(-v * 28); ry(u * 10); rx(-v * 8); };

    let drift = null;
    const startDrift = () => {
      if (drift) return;
      // no cursor: the spotlight wanders slowly on its own
      drift = gsap.timeline({ repeat: -1, defaults: { duration: 3.5, ease: 'sine.inOut' } })
        .to(pos, { x: 0.35, y: 0.3, onUpdate: render })
        .to(pos, { x: 0.65, y: 0.65, onUpdate: render })
        .to(pos, { x: 0.8, y: 0.35, onUpdate: render })
        .to(pos, { x: 0.5, y: 0.5, onUpdate: render });
    };
    const stopDrift = () => { drift?.kill(); drift = null; };

    if (finePointer) {
      hero.addEventListener('pointermove', (e) => {
        const r = hero.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        stopDrift();
        spotX(x); spotY(y);
        depth(x - 0.5, y - 0.5);
      });
      hero.addEventListener('pointerleave', () => { depth(0, 0); startDrift(); });
    } else {
      startDrift();
      // tilt with the phone where the browser allows it without a prompt
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma == null) return;
        depth(gsap.utils.clamp(-0.5, 0.5, e.gamma / 60), gsap.utils.clamp(-0.5, 0.5, (e.beta - 45) / 60));
      }, { passive: true });
    }
    // pause the drift while the hero is offscreen
    ScrollTrigger.create({ trigger: hero, start: 'top top', end: 'bottom top', onLeave: () => drift?.pause(), onEnterBack: () => drift?.resume() });
  }
}

/* ---------------- Marquee: always moving, speeds up with scroll ---------------- */
const track = $('[data-marquee]');
if (!reduced) {
  const loop = gsap.to(track, { xPercent: -50, duration: 22, ease: 'none', repeat: -1 });
  ScrollTrigger.create({
    onUpdate: (self) => {
      const v = self.getVelocity() / 300;
      gsap.to(loop, { timeScale: (self.direction || 1) * Math.max(1, Math.min(Math.abs(v), 6)), duration: 0.2, overwrite: true });
      gsap.to(loop, { timeScale: self.direction || 1, duration: 1, delay: 0.2 });
    },
  });
}

/* ---------------- Scroll reveals (stagger preset from UI UX Pro Max) ---------------- */
if (!reduced) {
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, overwrite: true }),
  });
  gsap.from('.service-list li', { opacity: 0, y: 30, duration: 0.6, ease: 'back.out(1.4)', stagger: 0.07, scrollTrigger: { trigger: '.service-list', start: 'top 85%' } });
  ScrollTrigger.batch('.loc-grid li', { start: 'top 90%', onEnter: (els) => gsap.from(els, { opacity: 0, scale: 0.92, y: 16, duration: 0.5, ease: 'back.out(1.4)', stagger: 0.06 }) });
  gsap.from('.mix', { y: 60, opacity: 0, rotate: (i) => [-4, 2, 5][i % 3], duration: 0.9, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: '.mix-cards', start: 'top 85%' } });
  gsap.from('.closing-title span', { yPercent: 60, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: '.closing', start: 'top 75%' } });
  gsap.fromTo('.marquee', { rotate: -3 }, { rotate: 1, ease: 'none', scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: true } });
}

/* ---------------- Counters ---------------- */
$$('[data-count]').forEach((el) => {
  const end = +el.dataset.count, suffix = el.dataset.suffix || '';
  if (reduced) { el.textContent = end + suffix; return; }
  const o = { v: 0 };
  gsap.to(o, { v: end, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%' }, onUpdate: () => { el.textContent = Math.round(o.v) + suffix; } });
});

/* ---------------- Reel: video card grows to full-bleed ---------------- */
const frame = $('[data-reel-frame]');
if (!reduced) {
  gsap.timeline({ scrollTrigger: { trigger: '[data-reel]', start: 'top top', end: 'bottom bottom', scrub: 0.8 } })
    .to(frame, { width: '100vw', height: '100vh', borderRadius: 0, ease: 'power2.inOut', duration: 1 })
    .from('[data-reel-title] span', { yPercent: 80, opacity: 0, stagger: 0.15, duration: 0.6 }, 0.25)
    .to('[data-reel-title]', { scale: 1.08, duration: 0.4 }, '>');
}

/* ---------------- Service hover photo preview (follows the cursor) ---------------- */
const box = $('[data-preview-box]');
const dlg = $('[data-booking]');
if (finePointer && !reduced) {
  box.innerHTML = Object.entries(SERVICE_PHOTOS).map(([svc, key]) => `<img src="${photoUrl(key)}" alt="" data-for="${svc}" loading="lazy" decoding="async" width="640" height="480" />`).join('');
  const imgs = $$('img', box);
  const xTo = gsap.quickTo(box, 'x', { duration: 0.5, ease: 'power3' });
  const yTo = gsap.quickTo(box, 'y', { duration: 0.5, ease: 'power3' });
  const list = $('[data-services]');
  list.addEventListener('pointerenter', () => imgs.forEach((i) => { i.loading = 'eager'; }), { once: true });

  // Work out what's under the pointer from its last position. Scrolling moves the
  // page under a still mouse without firing mouseenter/mouseleave, so we re-check on
  // every scroll too; otherwise the photo would stay frozen on screen.
  let px = -1, py = -1, current = null;
  function show(btn) {
    if (btn === current) return;
    current = btn;
    if (!btn) { gsap.to(box, { opacity: 0, scale: 0.6, duration: 0.3, overwrite: 'auto' }); return; }
    imgs.forEach((i) => {
      const on = i.dataset.for === btn.dataset.service;
      i.classList.toggle('on', on);
      if (on) gsap.fromTo(i, { scale: 1.25 }, { scale: 1, duration: 0.8, ease: 'power3.out' });
    });
    gsap.to(box, { opacity: 1, scale: 1, rotate: gsap.utils.random(-6, 6), duration: 0.45, ease: 'back.out(1.6)', overwrite: 'auto' });
  }
  function sync() {
    if (px < 0) return;
    const el = document.elementFromPoint(px, py);
    const btn = el && el.closest('[data-services] button');
    show(btn && !dlg.open ? btn : null);
  }
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    px = e.clientX; py = e.clientY;
    xTo(px); yTo(py);
    sync();
  }, { passive: true });
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('mouseleave', () => { px = -1; show(null); });
  document.addEventListener('click', (e) => { if (e.target.closest('[data-book]')) show(null); });
}

/* ---------------- Gallery: vertical scroll drives a horizontal photo strip ---------------- */
const gTrack = $('[data-gallery-track]');
const mmGallery = gsap.matchMedia();
mmGallery.add('(min-width: 721px) and (prefers-reduced-motion: no-preference)', () => {
  const dist = () => gTrack.scrollWidth - window.innerWidth;
  const strip = gsap.to(gTrack, {
    x: () => -dist(), ease: 'none',
    scrollTrigger: { trigger: '[data-gallery]', pin: '[data-gallery-pin]', start: 'top top', end: () => `+=${dist()}`, scrub: 0.6, invalidateOnRefresh: true },
  });
  // each photo drifts inside its frame for depth, and cards tilt in as they enter
  $$('.g-card', gTrack).forEach((card) => {
    gsap.fromTo($('img', card), { xPercent: -10 }, { xPercent: 10, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: strip, start: 'left right', end: 'right left', scrub: true } });
    gsap.from(card, { rotate: 4, y: 60, opacity: 0.3, ease: 'power2.out', scrollTrigger: { trigger: card, containerAnimation: strip, start: 'left 95%', end: 'left 55%', scrub: true } });
  });
});
if (!reduced) {
  gsap.from('.gallery-head > *', { y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '[data-gallery]', start: 'top 80%' } });
}

/* ---------------- Location cards: reveal follows the pointer ---------------- */
$$('.loc').forEach((c) => c.addEventListener('pointermove', (e) => {
  const r = c.getBoundingClientRect();
  c.style.setProperty('--mx', `${e.clientX - r.left}px`);
  c.style.setProperty('--my', `${e.clientY - r.top}px`);
}));

/* ---------------- Videos: only play when visible ---------------- */
const vio = new IntersectionObserver((entries) => entries.forEach((en) => {
  const v = en.target;
  if (en.isIntersecting && !reduced) v.play().catch(() => {}); else v.pause();
}), { threshold: 0.05 });
$$('.hero-video, .reel video').forEach((v) => { if (reduced) v.removeAttribute('autoplay'); vio.observe(v); });

/* ---------------- 3D pole ---------------- */
// three.js is loaded only when the pole section gets close, keeping the first load light
const stage = $('[data-pole-stage]');
const poleIO = new IntersectionObserver(([en]) => {
  if (!en.isIntersecting) return;
  poleIO.disconnect();
  import('./pole3d.js').then(({ initPole }) => initPole(stage, $('[data-pole-canvas]'), { reducedMotion: reduced }));
}, { rootMargin: '600px' });
poleIO.observe(stage);

/* ---------------- Newsletter ---------------- */
$('[data-newsletter]').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = $('#nl-email'), msg = $('[data-nl-msg]');
  if (!input.checkValidity()) { msg.textContent = 'Please enter a valid email address.'; input.focus(); return; }
  msg.textContent = "You're on the list. Fresh deals coming your way.";
  input.value = '';
});

/* ---------------- Booking: 3-step funnel ---------------- */
const state = { service: null, shop: null, day: null, time: null, step: 1 };
const choice = (label, sub, attrs = '') => `<button type="button" class="choice" aria-pressed="false" ${attrs}><strong>${label}</strong>${sub ? `<small>${sub}</small>` : ''}</button>`;
$('[data-choices="service"]').innerHTML = SERVICES.map((s) => choice(s.name, `${s.price} &middot; ${s.mins} min`, `data-v="${s.name}"`)).join('');
$('[data-choices="shop"]').innerHTML = SHOPS.map((s) => choice(s.name, s.address, `data-v="${s.name}"`)).join('');
const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d; });
$('[data-days]').innerHTML = days.map((d, i) => choice(i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' }), d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), `data-v="${d.toDateString()}"`)).join('');
const times = ['9:00 AM', '10:30 AM', '12:00 PM', '1:30 PM', '3:00 PM', '4:30 PM', '6:00 PM', '7:30 PM'];
function renderTimes(dayIdx) {
  // deterministic "taken" slots per day so it feels real
  $('[data-choices="time"]').innerHTML = times.map((t, i) => ((i * 7 + dayIdx * 3) % 5 === 0
    ? `<button type="button" class="choice" disabled style="opacity:.35;cursor:not-allowed"><strong>${t}</strong></button>`
    : choice(t, '', `data-v="${t}"`))).join('');
}
renderTimes(0);

function pick(group, btn) {
  $$('.choice', group).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
}
function updateNext() {
  const ok = { 1: state.service, 2: state.shop, 3: state.day && state.time }[state.step];
  const next = $('[data-next]');
  next.disabled = !ok;
  next.textContent = state.step === 3 ? 'Confirm booking' : state.step === 4 ? 'Done' : 'Next';
  next.disabled = state.step === 4 ? false : !ok;
  $('[data-back]').hidden = state.step === 1 || state.step === 4;
}
function go(step) {
  state.step = step;
  $$('[data-step]', dlg).forEach((f) => { f.hidden = +f.dataset.step !== step; });
  $$('[data-step-dot]', dlg).forEach((d) => d.classList.toggle('active', +d.dataset.stepDot <= step));
  if (step === 4) $('[data-summary]').textContent = `${state.service} at ${state.shop}, ${state.day === new Date().toDateString() ? 'today' : new Date(state.day).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at ${state.time}.`;
  const first = $(`[data-step="${step}"] .choice:not([disabled])`, dlg);
  updateNext();
  if (!reduced) gsap.from(`[data-step="${step}"]`, { x: 24, opacity: 0, duration: 0.4, ease: 'power3.out' });
  (step === 4 ? $('[data-next]') : first)?.focus();
}
dlg.addEventListener('click', (e) => {
  const c = e.target.closest('.choice');
  if (c && !c.disabled) {
    const group = c.parentElement;
    pick(group, c);
    if (group.matches('[data-choices="service"]')) state.service = c.dataset.v;
    if (group.matches('[data-choices="shop"]')) state.shop = c.dataset.v;
    if (group.matches('[data-days]')) { state.day = c.dataset.v; state.time = null; renderTimes($$('.choice', group).indexOf(c)); }
    if (group.matches('[data-choices="time"]')) state.time = c.dataset.v;
    updateNext();
  }
  if (e.target === dlg) closeBooking(); // backdrop click
});
$('[data-next]').addEventListener('click', () => (state.step === 4 ? closeBooking() : go(state.step + 1)));
$('[data-back]').addEventListener('click', () => go(state.step - 1));
$('[data-close]').addEventListener('click', closeBooking);
dlg.addEventListener('close', () => lenis?.start());
function closeBooking() { dlg.close(); }

function openBooking(preset = {}) {
  Object.assign(state, { service: null, shop: null, day: null, time: null });
  $$('.choice', dlg).forEach((b) => b.setAttribute('aria-pressed', 'false'));
  let step = 1;
  if (preset.service) { state.service = preset.service; pick($('[data-choices="service"]'), $(`[data-choices="service"] [data-v="${preset.service}"]`)); step = 2; }
  if (preset.shop) { state.shop = preset.shop; pick($('[data-choices="shop"]'), $(`[data-choices="shop"] [data-v="${preset.shop}"]`)); if (!preset.service) step = 1; }
  closeMenu();
  lenis?.stop();
  dlg.showModal();
  go(step);
}
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-book]');
  if (!t) return;
  e.preventDefault();
  openBooking({ service: t.dataset.service, shop: t.dataset.shop });
});

window.addEventListener('load', () => ScrollTrigger.refresh());
