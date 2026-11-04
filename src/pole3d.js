import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { makePole } from './pole.js';

// Interactive barber pole: drag (or swipe) to spin, eases back to a slow idle spin.
// One renderer for the page; pauses when offscreen (UI UX Pro Max Three.js guidance).
export function initPole(stage, canvas, { reducedMotion = false } = {}) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    stage.classList.add('no-webgl');
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.8;

  const key = new THREE.SpotLight(0xffe2b8, 50, 20, 0.6, 0.6); key.position.set(4, 5, 5); scene.add(key);
  const rim = new THREE.PointLight(0xe63b2e, 18, 12); rim.position.set(-3, 1, -2); scene.add(rim);
  const fill = new THREE.PointLight(0x4d7cc9, 10, 12); fill.position.set(3, -2, -3); scene.add(fill);

  const { group, stripes } = makePole();
  group.scale.setScalar(0.92);
  scene.add(group);

  // floating sparkles
  const n = 160, pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - 0.5) * 6; pos[i * 3 + 1] = (Math.random() - 0.5) * 6; pos[i * 3 + 2] = (Math.random() - 0.5) * 4; }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const sparkles = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xc8963e, size: 0.03, transparent: true, opacity: 0.7 }));
  scene.add(sparkles);

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 0.3, 8.6);

  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w / h < 1 ? 11 : 8.6;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage);
  resize();

  // drag-to-spin with inertia; mouse/touch/pen via pointer events
  let dragging = false, lastX = 0, velocity = 0, tiltTarget = 0, spin = 0;
  const idle = reducedMotion ? 0 : 0.006;
  stage.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; stage.setPointerCapture(e.pointerId); });
  stage.addEventListener('pointermove', (e) => {
    const r = stage.getBoundingClientRect();
    tiltTarget = ((e.clientY - r.top) / r.height - 0.5) * 0.35;
    if (!dragging) return;
    const dx = e.clientX - lastX; lastX = e.clientX;
    velocity = dx * 0.006;
  });
  const end = () => { dragging = false; };
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);
  stage.addEventListener('pointerleave', () => { tiltTarget = 0; });
  // keyboard: arrow keys spin it too
  stage.tabIndex = 0;
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') velocity -= 0.08;
    if (e.key === 'ArrowRight') velocity += 0.08;
  });

  let visible = false, raf = 0, last = performance.now();
  function tick(now) {
    const dt = Math.min((now - last) / 16.67, 3); last = now;
    if (!dragging) velocity *= Math.pow(0.95, dt);
    spin += (velocity + idle) * dt;
    group.rotation.y = spin;
    group.rotation.x += (tiltTarget - group.rotation.x) * 0.06 * dt;
    // stripes climb faster when spun harder
    stripes.offset.y -= (0.004 + Math.abs(velocity) * 0.05) * dt * (reducedMotion ? 0 : 1);
    sparkles.rotation.y -= 0.0015 * dt;
    renderer.render(scene, camera);
    raf = visible ? requestAnimationFrame(tick) : 0;
  }
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
  }, { rootMargin: '100px' }).observe(stage);
  renderer.render(scene, camera);
}
