import * as THREE from 'three';

// Shared barber-pole builder used by the live 3D section and the rendered video clips.
export function makeStripeTexture({ colors = ['#e63b2e', '#f4ecdf', '#1d3557', '#f4ecdf'], size = 512 } = {}) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const band = size / colors.length;
  // diagonal stripes that tile seamlessly
  for (let i = -colors.length; i < colors.length * 2; i++) {
    g.fillStyle = colors[((i % colors.length) + colors.length) % colors.length];
    g.beginPath();
    g.moveTo(i * band, 0);
    g.lineTo(i * band + band, 0);
    g.lineTo(i * band + band + size, size);
    g.lineTo(i * band + size, size);
    g.closePath();
    g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 3);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export function makePole() {
  const group = new THREE.Group();
  const stripes = makeStripeTexture();
  const core = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.55, 3.2, 96, 1, true),
    new THREE.MeshStandardMaterial({ map: stripes, roughness: 0.35, metalness: 0.0, emissive: 0xffffff, emissiveMap: stripes, emissiveIntensity: 0.18 })
  );
  group.add(core);

  const glass = new THREE.Mesh(
    new THREE.CylinderGeometry(0.68, 0.68, 3.3, 96, 1, true),
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, metalness: 0, transmission: 0.92, thickness: 0.2, ior: 1.4, transparent: true, opacity: 0.35, clearcoat: 1 })
  );
  group.add(glass);

  const chrome = new THREE.MeshStandardMaterial({ color: 0xd9d4cc, metalness: 1, roughness: 0.18 });
  const brass = new THREE.MeshStandardMaterial({ color: 0xc8963e, metalness: 1, roughness: 0.28 });
  const capGeo = new THREE.CylinderGeometry(0.78, 0.78, 0.22, 64);
  const top = new THREE.Mesh(capGeo, chrome); top.position.y = 1.76; group.add(top);
  const bottom = top.clone(); bottom.position.y = -1.76; group.add(bottom);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.62, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2), chrome);
  dome.position.y = 1.86; group.add(dome);
  const finial = new THREE.Mesh(new THREE.SphereGeometry(0.16, 32, 16), brass);
  finial.position.y = 2.55; group.add(finial);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 0.3, 24), brass);
  neck.position.y = 2.38; group.add(neck);
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.62, 0.35, 64), chrome);
  foot.position.y = -2.04; group.add(foot);

  return { group, stripes, core };
}
