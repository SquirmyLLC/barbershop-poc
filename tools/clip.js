import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { makePole } from '../src/pole.js';

// Deterministic scenes for the site's video loops. window.renderFrame(t) draws time t (seconds).
const params = new URLSearchParams(location.search);
const W = +params.get('w') || 1280, H = +params.get('h') || 720;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
document.body.appendChild(renderer.domElement);
const pmrem = new THREE.PMREMGenerator(renderer);
const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

function rng(seed) { return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646; }

function baseScene(bg = 0x0d0b0a) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(bg);
  scene.environment = env;
  scene.fog = new THREE.Fog(bg, 6, 16);
  const key = new THREE.SpotLight(0xffe2b8, 60, 20, 0.5, 0.6); key.position.set(4, 5, 4); scene.add(key);
  const rim = new THREE.PointLight(0xe63b2e, 25, 12); rim.position.set(-3, 1, -2); scene.add(rim);
  const fill = new THREE.PointLight(0x4d7cc9, 12, 12); fill.position.set(3, -2, -3); scene.add(fill);
  scene.add(new THREE.AmbientLight(0xffffff, 0.15));
  return scene;
}

function dust(scene, n = 500, spread = 9, color = 0xffe7c4) {
  const r = rng(7); const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { pos[i*3] = (r()-.5)*spread; pos[i*3+1] = (r()-.5)*spread*0.6; pos[i*3+2] = (r()-.5)*spread*0.6; }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const p = new THREE.Points(g, new THREE.PointsMaterial({ color, size: 0.02, transparent: true, opacity: 0.6 }));
  scene.add(p); return p;
}

// --- Scene: barber pole macro ---
function poleScene() {
  const scene = baseScene();
  const { group, stripes } = makePole();
  scene.add(group);
  const d = dust(scene);
  const cam = new THREE.PerspectiveCamera(32, W / H, 0.1, 50);
  return { scene, cam, frame(t, L) {
    const k = t / L;
    stripes.offset.y = -k * 1; // one full stripe cycle per loop -> seamless
    group.rotation.y = Math.sin(k * Math.PI * 2) * 0.15;
    const a = k * Math.PI * 2;
    cam.position.set(Math.sin(a) * 0.5 + 0.3, 0.4 + Math.sin(a) * 0.25, 7.4 + Math.cos(a) * 0.3);
    cam.lookAt(-1.5, 0.2, 0);
    d.rotation.y = Math.sin(a) * 0.2;
  }};
}

// --- Scene: chrome scissors snipping, with falling hair ---
function scissorsScene() {
  const scene = baseScene(0x0b0a09);
  const chrome = new THREE.MeshStandardMaterial({ color: 0xe9e4dc, metalness: 1, roughness: 0.12 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.6, roughness: 0.35 });
  function half(sign) {
    const g = new THREE.Group();
    const s = new THREE.Shape();
    s.moveTo(0, 0); s.quadraticCurveTo(1.4, 0.16 * sign, 2.9, 0.02 * sign); s.lineTo(2.9, -0.02 * sign);
    s.quadraticCurveTo(1.4, -0.06 * sign, 0, -0.14 * sign); s.closePath();
    const blade = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.04, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 3 }), chrome);
    blade.position.z = sign * 0.03; g.add(blade);
    const shank = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.12, 0.05), chrome);
    shank.position.set(-0.55, -0.05 * sign, sign * 0.03); shank.rotation.z = 0.2 * sign; g.add(shank);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.06, 24, 64), chrome);
    ring.position.set(-1.35, -0.32 * sign, sign * 0.03); g.add(ring);
    const tang = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.5, 16), chrome);
    tang.position.set(-1.45, -0.75 * sign, sign * 0.03); tang.rotation.z = sign > 0 ? 0.3 : Math.PI - 0.3; if (sign > 0) g.add(tang);
    return g;
  }
  const sc = new THREE.Group(); const a = half(1), b = half(-1); sc.add(a, b);
  const pivot = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.16, 24), dark); pivot.rotation.x = Math.PI / 2; sc.add(pivot);
  scene.add(sc);
  // hair strands
  const r = rng(42); const strands = [];
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x2a1d14, roughness: 0.6 });
  for (let i = 0; i < 140; i++) {
    const pts = []; const len = 0.15 + r() * 0.35; const bend = (r() - .5) * 0.2;
    for (let j = 0; j < 6; j++) pts.push(new THREE.Vector3(j / 5 * len, Math.sin(j / 5 * Math.PI) * bend, 0));
    const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 8, 0.006, 4), hairMat);
    m.userData = { x: 1.4 + (r() - .5) * 2.2, z: (r() - .5) * 1.2, phase: r(), spin: (r() - .5) * 4, sway: r() * 6 };
    scene.add(m); strands.push(m);
  }
  dust(scene, 300);
  const cam = new THREE.PerspectiveCamera(30, W / H, 0.1, 50);
  return { scene, cam, frame(t, L) {
    const k = t / L, A = k * Math.PI * 2;
    const snip = Math.pow(Math.abs(Math.sin(k * Math.PI * 4)), 3); // 4 snips per loop
    a.rotation.z = 0.05 + (1 - snip) * 0.32; b.rotation.z = -a.rotation.z;
    sc.rotation.set(-0.35 + Math.sin(A) * 0.08, 0.5 + Math.sin(A) * 0.25, 0.15);
    sc.position.set(-0.3, 0.6, 0);
    for (const s of strands) {
      const u = s.userData; const ph = (u.phase + k) % 1;
      s.position.set(u.x + Math.sin(ph * u.sway) * 0.15, 1.2 - ph * 4.2, u.z);
      s.rotation.set(ph * u.spin, ph * u.spin * 0.7, ph * u.spin * 1.3);
    }
    cam.position.set(Math.sin(A) * 0.5 + 0.6, 0.4, 6.2); cam.lookAt(0.4, -0.1, 0);
  }};
}

// --- Scene: flowing hair strands / "fade" texture ---
function strandsScene() {
  const scene = baseScene(0x0c0a09);
  scene.fog = new THREE.Fog(0x0c0a09, 3, 10);
  const r = rng(99); const lines = [];
  const N = 170;
  scene.environmentIntensity = 0.35;
  for (let i = 0; i < N; i++) {
    const gold = r() < 0.12;
    const col = gold ? new THREE.Color(0xc8963e) : new THREE.Color().setHSL(0.07 + r() * 0.03, 0.45, 0.05 + r() * 0.12);
    const mat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.4, metalness: 0.3 });
    const curve = new THREE.CatmullRomCurve3(Array.from({ length: 8 }, (_, j) => new THREE.Vector3(j - 3.5, 0, 0)));
    const m = new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 0.012, 5), mat);
    m.userData = { y: (r() - .5) * 3, z: (r() - .5) * 3, ph: r() * Math.PI * 2, amp: 0.15 + r() * 0.3 };
    scene.add(m); lines.push(m);
  }
  const cam = new THREE.PerspectiveCamera(35, W / H, 0.1, 50);
  return { scene, cam, frame(t, L) {
    const A = (t / L) * Math.PI * 2;
    for (const m of lines) {
      const u = m.userData; const pts = [];
      for (let j = 0; j < 8; j++) { const x = (j - 3.5) * 1.2; pts.push(new THREE.Vector3(x, u.y * 0.9 + Math.sin(A + u.ph + j * 0.6) * u.amp, u.z + Math.cos(A + u.ph + j * 0.5) * u.amp * 0.6)); }
      m.geometry.dispose(); m.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.012, 5);
    }
    cam.position.set(Math.sin(A) * 0.6, 0.2 + Math.cos(A) * 0.2, 4.2); cam.lookAt(0, 0, 0);
  }};
}

const scenes = { pole: poleScene, scissors: scissorsScene, strands: strandsScene };
const s = scenes[params.get('scene') || 'pole']();
s.cam.aspect = W / H; s.cam.updateProjectionMatrix();
window.renderFrame = (t, L) => { s.frame(t, L); renderer.render(s.scene, s.cam); };
window.renderFrame(0, 1);
window.clipReady = true;
