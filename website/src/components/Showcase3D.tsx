import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

/* ------------------------------------------------------------------ */
/*  Chapters: the camera flies along these while the user scrolls      */
/* ------------------------------------------------------------------ */
interface Chapter {
  id: string;
  index: string;
  kicker: string;
  title: string;
  body: string;
  pos: [number, number, number];
  look: [number, number, number];
}

const CHAPTERS: Chapter[] = [
  {
    id: 'overview',
    index: '01',
    kicker: 'The Entrance Set',
    title: 'Four stands. One unforgettable arrival.',
    body: 'Hand-finished black acrylic, polished brass and a living flame. Each stand is placed to frame your wedding entrance in sacred Oud smoke.',
    pos: [3.0, 2.3, 7.6],
    look: [0.1, 1.1, -0.6],
  },
  {
    id: 'embers',
    index: '02',
    kicker: 'Live Brazier',
    title: 'Real charcoal. Real Oud.',
    body: 'Glowing embers carry hand-blended agarwood and ambergris. The smoke is slow, dense and never harsh — it rolls across the floor and greets every guest.',
    pos: [0.9, 2.8, 1.8],
    look: [0, 2.12, 0],
  },
  {
    id: 'emblem',
    index: '03',
    kicker: 'The Insignia',
    title: 'Signed in gold.',
    body: 'The Salman flame is set into the front of every stand in a mirror-gold finish — a signature your guests will remember.',
    pos: [0.2, 1.95, 2.5],
    look: [0, 1.83, 0],
  },
  {
    id: 'pillars',
    index: '04',
    kicker: 'Architecture',
    title: 'Brass columns, mirror-polished.',
    body: 'Twin brass columns lift the brazier above the crowd, rising from a weighted acrylic plinth that reflects the room around it.',
    pos: [-1.5, 0.7, 2.0],
    look: [0, 0.8, 0],
  },
  {
    id: 'attar',
    index: '05',
    kicker: 'Royal Attar',
    title: 'The crystal flacon.',
    body: 'Alcohol-free pure perfume oil in a faceted crystal decanter, applied to guests by our staff in traditional Arabic attire.',
    pos: [3.4, 1.15, 4.0],
    look: [1.9, 0.7, 0.2],
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
const smoothstep = (x: number) => x * x * (3 - 2 * x);

function makeSmokeTexture(): THREE.CanvasTexture {
  // Cloudy, noise-modulated puff so overlapping sprites read as volumetric smoke
  const s = 128;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const g = c.getContext('2d')!;
  const img = g.createImageData(s, s);
  const rnd = (x: number, y: number) => {
    const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return n - Math.floor(n);
  };
  const vnoise = (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    return (
      rnd(xi, yi) * (1 - u) * (1 - v) + rnd(xi + 1, yi) * u * (1 - v) +
      rnd(xi, yi + 1) * (1 - u) * v + rnd(xi + 1, yi + 1) * u * v
    );
  };
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      const dx = (x / s - 0.5) * 2, dy = (y / s - 0.5) * 2;
      const d = Math.sqrt(dx * dx + dy * dy);
      let n = 0, a = 0.5, f = 4;
      for (let o = 0; o < 4; o++) { n += a * vnoise(x / s * f, y / s * f); a *= 0.5; f *= 2; }
      const fall = Math.max(0, 1 - d);
      const alpha = Math.pow(fall, 1.6) * (0.35 + n * 0.9);
      const i = (y * s + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = 255;
      img.data[i + 3] = Math.min(255, alpha * 255);
    }
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeSparkTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.25, 'rgba(255,200,120,0.8)');
  gr.addColorStop(1, 'rgba(255,120,30,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

/** Rounded-rectangle frustum with bevelled edges: the real stand silhouette. */
function frustum(wTop: number, wBot: number, h: number, depthTopK = 1, depthBotK = 1, closedTop = true) {
  const g = new THREE.BufferGeometry();
  const t = wTop / 2, b = wBot / 2;
  const corners = [
    [-b, 0, -b * depthBotK], [b, 0, -b * depthBotK], [b, 0, b * depthBotK], [-b, 0, b * depthBotK],
    [-t, h, -t * depthTopK], [t, h, -t * depthTopK], [t, h, t * depthTopK], [-t, h, t * depthTopK],
  ];
  const faces = [
    [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7], [3, 2, 1, 0],
  ];
  if (closedTop) faces.push([4, 5, 6, 7]);
  const pos: number[] = [], uv: number[] = [], idx: number[] = [];
  const grp: { start: number; count: number; mat: number }[] = [];
  faces.forEach((f, fi) => {
    const base = pos.length / 3;
    f.forEach((vi) => pos.push(...corners[vi]));
    uv.push(0, 0, 1, 0, 1, 1, 0, 1);
    idx.push(base, base + 2, base + 1, base, base + 3, base + 2);
    grp.push({ start: fi * 6, count: 6, mat: fi });
  });
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  grp.forEach((x) => g.addGroup(x.start, x.count, x.mat));
  g.computeVertexNormals();
  return g;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export const Showcase3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const manual = useRef<{ idx: number | null }>({ idx: null });
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [mood, setMood] = useState<'gold' | 'midnight' | 'emerald'>('gold');
  const moodRef = useRef(mood);
  moodRef.current = mood;
  const [smoke, setSmoke] = useState(true);
  const smokeRef = useRef(smoke);
  smokeRef.current = smoke;

  /* Scroll → progress through the pinned track */
  useEffect(() => {
    const onScroll = () => {
      const el = trackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / total));
      progress.current = p;
      const idx = Math.min(CHAPTERS.length - 1, Math.round(p * (CHAPTERS.length - 1)));
      setActive((a) => (a === idx ? a : idx));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  /* Three.js scene */
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let w = container.clientWidth, h = container.clientHeight;
    const isMobile = w < 700;

    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(w, h);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030304);
    scene.fog = new THREE.FogExp2(0x030304, 0.045);

    // Studio-quality image based lighting, so metals and acrylic have something to reflect
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.3;

    const camera = new THREE.PerspectiveCamera(32, w / h, 0.1, 60);
    camera.position.set(...CHAPTERS[0].pos);

    /* ---- lights ---- */
    const key = new THREE.SpotLight(0xffe2b0, 90, 22, 0.42, 0.7, 1.6);
    key.position.set(3.2, 6.5, 3.8);
    key.target.position.set(0, 1, 0);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.bias = -0.0003;
    key.shadow.radius = 5;
    scene.add(key, key.target);

    const rimL = new THREE.SpotLight(0x8fb4ff, 18, 20, 0.5, 0.8, 1.6);
    rimL.position.set(-4.5, 3.2, -3.5);
    rimL.target.position.set(0, 1.1, 0);
    scene.add(rimL, rimL.target);

    const rimR = new THREE.SpotLight(0xffb060, 14, 18, 0.5, 0.8, 1.6);
    rimR.position.set(4.5, 2.5, -3.0);
    rimR.target.position.set(0, 1.1, 0);
    scene.add(rimR, rimR.target);

    const emberLight = new THREE.PointLight(0xff5a14, 6, 3.4, 1.8);
    emberLight.position.set(0, 1.95, 0);
    scene.add(emberLight);

    /* ---- floor: dark glossy stone with live reflections ---- */
    const mirror = new Reflector(new THREE.CircleGeometry(14, 64), {
      color: 0x555560,
      textureWidth: Math.floor(w * Math.min(window.devicePixelRatio, 1.5) * 0.5),
      textureHeight: Math.floor(h * Math.min(window.devicePixelRatio, 1.5) * 0.5),
      clipBias: 0.003,
    });
    mirror.rotation.x = -Math.PI / 2;
    scene.add(mirror);

    // dark veil on top of the mirror = glossy rather than perfect mirror, and a soft vignette pool of light
    const veilTex = (() => {
      const c = document.createElement('canvas');
      c.width = c.height = 512;
      const g = c.getContext('2d')!;
      const gr = g.createRadialGradient(256, 256, 10, 256, 256, 256);
      gr.addColorStop(0, 'rgba(3,3,4,0.80)');
      gr.addColorStop(0.3, 'rgba(3,3,4,0.88)');
      gr.addColorStop(0.7, 'rgba(3,3,4,0.98)');
      gr.addColorStop(1, 'rgba(3,3,4,1)');
      g.fillStyle = gr;
      g.fillRect(0, 0, 512, 512);
      return new THREE.CanvasTexture(c);
    })();
    const veil = new THREE.Mesh(
      new THREE.CircleGeometry(14, 64),
      new THREE.MeshBasicMaterial({ map: veilTex, transparent: true, depthWrite: false, fog: false }),
    );
    veil.rotation.x = -Math.PI / 2;
    veil.position.y = 0.002;
    scene.add(veil);

    // soft contact-shadow receiver (shadow-only material)
    const shadowCatcher = new THREE.Mesh(
      new THREE.CircleGeometry(8, 48),
      new THREE.ShadowMaterial({ opacity: 0.55 }),
    );
    shadowCatcher.rotation.x = -Math.PI / 2;
    shadowCatcher.position.y = 0.004;
    shadowCatcher.receiveShadow = true;
    scene.add(shadowCatcher);

    /* ---- materials ---- */
    const acrylic = new THREE.MeshPhysicalMaterial({
      color: 0x020203, metalness: 0.0, roughness: 0.14,
      clearcoat: 1, clearcoatRoughness: 0.14, reflectivity: 0.5,
      envMapIntensity: 0.45, specularIntensity: 0.45,
    });
    const brass = new THREE.MeshPhysicalMaterial({
      color: 0xd9a93a, metalness: 1, roughness: 0.16,
      clearcoat: 0.6, clearcoatRoughness: 0.1, envMapIntensity: 1.8,
    });
    const gold = new THREE.MeshPhysicalMaterial({
      color: 0xf0c352, metalness: 1, roughness: 0.1, envMapIntensity: 2,
    });
    const steel = new THREE.MeshStandardMaterial({ color: 0x8a8a90, metalness: 1, roughness: 0.32 });
    const ash = new THREE.MeshStandardMaterial({ color: 0x6b6764, roughness: 1, metalness: 0 });

    /* ---- logo decal (real Salman logo) ---- */
    const logoMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, transparent: true, roughness: 0.3, metalness: 0.6,
      emissive: 0xffffff, emissiveIntensity: 0.05, envMapIntensity: 2, depthWrite: false,
      polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4,
    });
    new THREE.TextureLoader().load('/assets/images/salman_logo_gold.png', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      logoMat.map = tex;
      logoMat.emissiveMap = tex;
      logoMat.needsUpdate = true;
    });

    /* ---- build ONE hero stand (true to the photos) ---- */
    const stand = new THREE.Group();
    scene.add(stand);

    const addShadows = (m: THREE.Mesh) => { m.castShadow = true; m.receiveShadow = true; return m; };

    // Base: truncated pyramid, wide at the floor
    const baseH = 0.62;
    const base = addShadows(new THREE.Mesh(frustum(0.36, 0.86, baseH), acrylic));
    stand.add(base);
    // thin gold keyline around the foot
    const foot = addShadows(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.012, 0.9), gold));
    foot.position.y = 0.006;
    stand.add(foot);
    // top plate of base
    const plate = addShadows(new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.03, 0.42), acrylic));
    plate.position.y = baseH + 0.015;
    stand.add(plate);

    // Brass columns (twin, like the real stand) with collars
    const colH = 0.82;
    [-0.075, 0.075].forEach((x) => {
      const col = addShadows(new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, colH, 40), brass));
      col.position.set(x, baseH + 0.03 + colH / 2, 0);
      stand.add(col);
      [0, 1].forEach((k) => {
        const collar = addShadows(new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.046, 0.03, 40), gold));
        collar.position.set(x, baseH + 0.04 + k * (colH - 0.02), 0);
        stand.add(collar);
      });
    });
    // second pair slightly behind (the photos show 3–4 tubes)
    [-0.075, 0.075].forEach((x) => {
      const col = addShadows(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, colH, 32), brass));
      col.position.set(x, baseH + 0.03 + colH / 2, -0.11);
      stand.add(col);
    });

    // Bowl: inverted frustum, wide at the top, open, logo on front
    const bowlY = baseH + 0.03 + colH;
    const bowlH = 0.7;
    const bowlMat = acrylic.clone();
    bowlMat.side = THREE.DoubleSide;
    const bowl = addShadows(new THREE.Mesh(frustum(0.98, 0.34, bowlH, 0.62, 0.62, false), bowlMat));
    bowl.position.y = bowlY;
    stand.add(bowl);

    // gold rim around the bowl top
    const rimGeoPts = [
      [-0.49, -0.306], [0.49, -0.306], [0.49, 0.306], [-0.49, 0.306],
    ];
    const rim = new THREE.Group();
    const rimTube = (a: number[], b: number[]) => {
      const dx = b[0] - a[0], dz = b[1] - a[1];
      const len = Math.hypot(dx, dz);
      const m = addShadows(new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, len, 16), gold));
      m.position.set((a[0] + b[0]) / 2, bowlY + bowlH, (a[1] + b[1]) / 2);
      m.rotation.z = Math.PI / 2;
      m.rotation.y = -Math.atan2(dz, dx);
      rim.add(m);
    };
    for (let i = 0; i < 4; i++) rimTube(rimGeoPts[i], rimGeoPts[(i + 1) % 4]);
    stand.add(rim);

    // Logo plane on the slanted front face
    const dzFront = ((0.98 - 0.34) / 2) * 0.62;
    const slant = Math.atan2(dzFront, bowlH);
    const zMid = ((0.98 + 0.34) / 4) * 0.62;
    const logo = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.2025), logoMat);
    logo.position.set(0, bowlY + bowlH * 0.5, zMid + 0.02 * Math.cos(slant));
    logo.position.y += 0.02 * Math.sin(slant);
    logo.rotation.x = -slant;
    stand.add(logo);

    // Brazier dish inside the bowl + charcoal
    const dish = addShadows(new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.2, 0.07, 48), steel));
    dish.position.y = bowlY + bowlH - 0.05;
    stand.add(dish);

    const coalMat = new THREE.MeshStandardMaterial({
      color: 0x0a0503, emissive: 0xff2a00, emissiveIntensity: 1.2, roughness: 0.95,
    });
    const coals: THREE.Mesh[] = [];
    const rng = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
    for (let i = 0; i < 9; i++) {
      const a = rng() * Math.PI * 2, r = Math.sqrt(rng()) * 0.17;
      const c = new THREE.Mesh(new THREE.DodecahedronGeometry(0.04 + rng() * 0.02, 1), coalMat.clone());
      c.position.set(Math.cos(a) * r, bowlY + bowlH - 0.005 + rng() * 0.03, Math.sin(a) * r);
      c.rotation.set(rng() * 3, rng() * 3, rng() * 3);
      c.scale.y = 0.65;
      stand.add(c);
      coals.push(c);
    }
    // ash dusting
    const ashDisk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.01, 32), ash);
    ashDisk.position.y = bowlY + bowlH - 0.02;
    stand.add(ashDisk);
    // oud chips
    const oudMat = new THREE.MeshStandardMaterial({ color: 0x2b170b, roughness: 0.75 });
    for (let i = 0; i < 7; i++) {
      const a = rng() * Math.PI * 2, r = rng() * 0.15;
      const chip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.015, 0.03), oudMat);
      chip.position.set(Math.cos(a) * r, bowlY + bowlH + 0.025 + rng() * 0.03, Math.sin(a) * r);
      chip.rotation.set(rng() * 0.6, rng() * 6, rng() * 0.6);
      stand.add(chip);
    }

    /* ---- crystal attar flacon ---- */
    const flacon = new THREE.Group();
    flacon.position.set(1.9, 0, 0.2);
    scene.add(flacon);

    const plinth = addShadows(new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.38, 0.08, 64), acrylic));
    plinth.position.y = 0.04;
    flacon.add(plinth);
    const plinthRing = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.008, 12, 96), gold);
    plinthRing.rotation.x = Math.PI / 2;
    plinthRing.position.y = 0.085;
    flacon.add(plinthRing);

    const flaconGlow = new THREE.PointLight(0xffc266, 5, 3.5, 1.6);
    flaconGlow.position.set(1.9, 0.9, -0.9);
    scene.add(flaconGlow);
    const flaconFill = new THREE.PointLight(0xfff0d8, 3, 3, 1.8);
    flaconFill.position.set(2.8, 1.2, 1.4);
    scene.add(flaconFill);

    // faceted body via lathe w/ 10 segments = cut-glass look
    const bodyProfile = [
      [0.0, 0.0], [0.26, 0.0], [0.30, 0.04], [0.31, 0.5], [0.27, 0.7], [0.14, 0.82], [0.1, 0.9], [0.0, 0.9],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, metalness: 0, roughness: 0.02,
      transmission: 0.96, thickness: 0.25, ior: 1.45,
      attenuationColor: new THREE.Color(0xffd89a), attenuationDistance: 1.6,
      clearcoat: 1, envMapIntensity: 2.2, specularIntensity: 1,
      flatShading: true,
    });
    const body = addShadows(new THREE.Mesh(new THREE.LatheGeometry(bodyProfile, 10), glassMat));
    body.position.y = 0.09;
    flacon.add(body);

    const oilMat = new THREE.MeshPhysicalMaterial({
      color: 0xc77a08, roughness: 0.25, metalness: 0.2, clearcoat: 1,
      emissive: 0xb86a00, emissiveIntensity: 0.9,
    });
    const oilProfile = [
      [0.0, 0.0], [0.22, 0.0], [0.26, 0.03], [0.27, 0.42], [0.0, 0.42],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const oil = new THREE.Mesh(new THREE.LatheGeometry(oilProfile, 32), oilMat);
    oil.position.y = 0.14;
    flacon.add(oil);

    const neck = addShadows(new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.1, 0.1, 40), gold));
    neck.position.y = 1.04;
    flacon.add(neck);
    const capProfile = [
      [0, 0], [0.09, 0.0], [0.13, 0.04], [0.14, 0.09], [0.1, 0.15], [0.05, 0.19], [0.015, 0.26], [0.0, 0.3],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const cap = addShadows(new THREE.Mesh(new THREE.LatheGeometry(capProfile, 48), gold));
    cap.position.y = 1.09;
    flacon.add(cap);
    const gem = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.035, 0),
      new THREE.MeshPhysicalMaterial({
        color: 0x10b981, metalness: 0, roughness: 0.02, transmission: 0.7, thickness: 0.2,
        ior: 2.2, emissive: 0x04803a, emissiveIntensity: 0.9,
      }),
    );
    gem.position.y = 1.42;
    gem.scale.y = 1.5;
    flacon.add(gem);

    // ---- supporting stands in the background (the “four” in the set) ----
    const makeMini = (x: number, z: number, rotY: number, s: number) => {
      const g = stand.clone(true);
      g.position.set(x, 0, z);
      g.rotation.y = rotY;
      g.scale.setScalar(s);
      scene.add(g);
      return g;
    };
    makeMini(-1.8, -1.5, -0.55, 1);
    makeMini(1.5, -2.3, -0.3, 1);
    makeMini(-3.3, -3.4, 0.5, 1);

    /* ---- Smoke (3 layers of soft, noise-textured sprites) ---- */
    const smokeTex = makeSmokeTexture();
    interface Puff { s: THREE.Sprite; t: number; life: number; vx: number; vz: number; vy: number; spin: number; r0: number; ox: number; oz: number; }
    const puffs: Puff[] = [];
    const puffCount = isMobile ? 38 : 70;
    const smokeOrigins: [number, number][] = [[0, 0], [-1.8, -1.5], [1.5, -2.3]];
    const smokeGroup = new THREE.Group();
    scene.add(smokeGroup);
    for (let i = 0; i < puffCount; i++) {
      const mat = new THREE.SpriteMaterial({
        map: smokeTex, color: 0xe8e0d2, transparent: true, opacity: 0,
        depthWrite: false, blending: THREE.NormalBlending,
      });
      const s = new THREE.Sprite(mat);
      const o = smokeOrigins[i % (isMobile ? 1 : 3)];
      smokeGroup.add(s);
      puffs.push({
        s, t: Math.random(), life: 5 + Math.random() * 3,
        vx: (Math.random() - 0.5) * 0.12, vz: (Math.random() - 0.5) * 0.12,
        vy: 0.22 + Math.random() * 0.16, spin: (Math.random() - 0.5) * 0.4,
        r0: 0.1 + Math.random() * 0.1, ox: o[0], oz: o[1],
      });
    }

    /* Rising sparks from the coals */
    const sparkN = 40;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(sparkN * 3);
    const sparkMeta = Array.from({ length: sparkN }, () => ({
      t: Math.random(), life: 1.2 + Math.random() * 2, vx: 0, vz: 0, vy: 0,
    }));
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    const sparks = new THREE.Points(
      sparkGeo,
      new THREE.PointsMaterial({
        size: 0.05, map: makeSparkTexture(), transparent: true, depthWrite: false,
        blending: THREE.AdditiveBlending, color: 0xffa050, opacity: 0.95, sizeAttenuation: true,
      }),
    );
    scene.add(sparks);
    const resetSpark = (m: typeof sparkMeta[number], i: number) => {
      const a = Math.random() * Math.PI * 2, r = Math.random() * 0.16;
      sparkPos[i * 3] = Math.cos(a) * r;
      sparkPos[i * 3 + 1] = bowlY + bowlH;
      sparkPos[i * 3 + 2] = Math.sin(a) * r;
      m.t = 0; m.life = 1.2 + Math.random() * 2;
      m.vx = (Math.random() - 0.5) * 0.12; m.vz = (Math.random() - 0.5) * 0.12; m.vy = 0.25 + Math.random() * 0.35;
    };
    sparkMeta.forEach((m, i) => { resetSpark(m, i); m.t = Math.random(); });

    /* Floating gold dust in the light beam */
    const dustN = isMobile ? 60 : 160;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustN * 3);
    for (let i = 0; i < dustN; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 9;
      dustPos[i * 3 + 1] = Math.random() * 4.5;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 9;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({
        size: 0.022, map: makeSparkTexture(), transparent: true, depthWrite: false,
        blending: THREE.AdditiveBlending, color: 0xffe2a8, opacity: 0.55,
      }),
    );
    scene.add(dust);

    /* ---- post: bloom + vignette/grain + output ---- */
    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(renderer.getPixelRatio());
    composer.setSize(w, h);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.45, 0.6, 0.95);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
    const grade = new ShaderPass({
      uniforms: { tDiffuse: { value: null }, uTime: { value: 0 } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
      fragmentShader: `
        uniform sampler2D tDiffuse; uniform float uTime; varying vec2 vUv;
        float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
        void main(){
          vec2 uv = vUv;
          vec2 d = uv - .5;
          float vig = smoothstep(.95, .25, length(d * vec2(1.0, 1.15)));
          // subtle chromatic aberration toward edges
          float ca = .0016 * dot(d, d) * 4.;
          vec3 c;
          c.r = texture2D(tDiffuse, uv + d * ca).r;
          c.g = texture2D(tDiffuse, uv).g;
          c.b = texture2D(tDiffuse, uv - d * ca).b;
          c *= mix(.35, 1., vig);
          c += (hash(uv * 1000. + uTime) - .5) * .028;
          gl_FragColor = vec4(c, 1.);
        }`,
    });
    composer.addPass(grade);

    /* ---- mood presets ---- */
    const moods = {
      gold: { key: 0xffe2b0, rimA: 0x8fb4ff, rimB: 0xffb060, bg: 0x030304, env: 0.55 },
      midnight: { key: 0xbfd4ff, rimA: 0x4466ff, rimB: 0x88a8ff, bg: 0x02030a, env: 0.4 },
      emerald: { key: 0xffe9b8, rimA: 0x10b981, rimB: 0x34d399, bg: 0x020806, env: 0.5 },
    };
    const tmpC = new THREE.Color();
    let lastMood = 'gold';

    /* ---- interaction: pointer parallax ---- */
    const pointer = new THREE.Vector2();
    const onMove = (e: PointerEvent) => {
      const r = container.getBoundingClientRect();
      pointer.set(((e.clientX - r.left) / r.width - 0.5) * 2, ((e.clientY - r.top) / r.height - 0.5) * 2);
    };
    container.addEventListener('pointermove', onMove);

    /* ---- camera path: Catmull-Rom through the chapters ---- */
    const posCurve = new THREE.CatmullRomCurve3(CHAPTERS.map((c) => new THREE.Vector3(...c.pos)), false, 'catmullrom', 0.4);
    const lookCurve = new THREE.CatmullRomCurve3(CHAPTERS.map((c) => new THREE.Vector3(...c.look)), false, 'catmullrom', 0.4);

    const camPos = new THREE.Vector3().copy(posCurve.getPoint(0));
    const camLook = new THREE.Vector3().copy(lookCurve.getPoint(0));
    const tp = new THREE.Vector3(), tl = new THREE.Vector3();
    let p = 0;
    let intro = 0; // fly-in
    const clock = new THREE.Clock();
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(container);

    const flick = coals.map(() => Math.random() * 10);

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible) { clock.getDelta(); return; }
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      // chapter jump or scroll
      const target = manual.current.idx !== null
        ? manual.current.idx / (CHAPTERS.length - 1)
        : progress.current;
      p += (target - p) * Math.min(1, dt * 3.2);
      intro = Math.min(1, intro + dt * 0.45);
      const ie = 1 - Math.pow(1 - intro, 3);

      posCurve.getPoint(p, tp);
      lookCurve.getPoint(p, tl);
      // intro dolly: start further and higher, ease in
      tp.multiplyScalar(1).add(new THREE.Vector3(0, (1 - ie) * 1.2, (1 - ie) * 3.5));
      // breathing + pointer parallax
      tp.x += Math.sin(t * 0.35) * 0.06 + pointer.x * 0.18;
      tp.y += Math.cos(t * 0.3) * 0.04 - pointer.y * 0.1;
      camPos.lerp(tp, 1 - Math.pow(0.0005, dt));
      camLook.lerp(tl, 1 - Math.pow(0.0005, dt));
      camera.position.copy(camPos);
      camera.lookAt(camLook);

      // idle motion on hero objects
      flacon.rotation.y = t * 0.25;
      gem.rotation.y = t * 0.9;
      gem.position.y = 1.42 + Math.sin(t * 1.4) * 0.012;

      // embers
      coals.forEach((c, i) => {
        const f = 0.65 + 0.35 * Math.sin(t * (2.2 + i * 0.37) + flick[i]) * Math.sin(t * 5.1 + i);
        (c.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.7 + f * 1.3;
      });
      emberLight.intensity = 5 + Math.sin(t * 9) * 1.2 + Math.sin(t * 23) * 0.8 + Math.random() * 0.6;

      // smoke
      smokeGroup.visible = smokeRef.current;
      if (smokeRef.current) {
        for (const q of puffs) {
          q.t += dt / q.life;
          if (q.t >= 1) {
            q.t = 0;
            q.life = 5 + Math.random() * 3;
            q.vx = (Math.random() - 0.5) * 0.12;
            q.vz = (Math.random() - 0.5) * 0.12;
          }
          const k = q.t;
          const age = k * q.life;
          const wob = Math.sin(age * 1.3 + q.r0 * 40) * 0.12 * k;
          const wob2 = Math.cos(age * 1.1 + q.r0 * 30) * 0.12 * k;
          q.s.position.set(
            q.ox + q.vx * age * 1.4 + wob + 0.25 * k * k,
            bowlY + bowlH + 0.04 + q.vy * age * (1 - 0.35 * k),
            q.oz + q.vz * age * 1.4 + wob2,
          );
          const size = 0.2 + q.r0 * 1.2 + k * 1.5;
          q.s.scale.set(size, size, 1);
          (q.s.material as THREE.SpriteMaterial).rotation += q.spin * dt;
          const fadeIn = smoothstep(Math.min(1, k / 0.12));
          const fadeOut = 1 - smoothstep(Math.min(1, Math.max(0, (k - 0.35) / 0.65)));
          (q.s.material as THREE.SpriteMaterial).opacity = fadeIn * fadeOut * 0.1;
        }
      }
      // sparks
      const sp = sparkGeo.attributes.position as THREE.BufferAttribute;
      sparkMeta.forEach((m, i) => {
        m.t += dt / m.life;
        if (m.t >= 1) resetSpark(m, i);
        sparkPos[i * 3] += (m.vx + Math.sin(t * 3 + i) * 0.05) * dt;
        sparkPos[i * 3 + 1] += m.vy * dt;
        sparkPos[i * 3 + 2] += (m.vz + Math.cos(t * 2.6 + i) * 0.05) * dt;
      });
      sp.needsUpdate = true;
      (sparks.material as THREE.PointsMaterial).opacity = smokeRef.current ? 0.95 : 0.3;

      // dust drift
      const dp = dustGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < dustN; i++) {
        dustPos[i * 3 + 1] += dt * (0.02 + (i % 7) * 0.006);
        dustPos[i * 3] += Math.sin(t * 0.2 + i) * dt * 0.01;
        if (dustPos[i * 3 + 1] > 4.5) dustPos[i * 3 + 1] = 0;
      }
      dp.needsUpdate = true;

      // mood
      if (lastMood !== moodRef.current) {
        lastMood = moodRef.current;
      }
      const m = moods[moodRef.current];
      key.color.lerp(tmpC.setHex(m.key), 0.06);
      rimL.color.lerp(tmpC.setHex(m.rimA), 0.06);
      rimR.color.lerp(tmpC.setHex(m.rimB), 0.06);
      (scene.background as THREE.Color).lerp(tmpC.setHex(m.bg), 0.06);
      (scene.fog as THREE.FogExp2).color.copy(scene.background as THREE.Color);
      scene.environmentIntensity += (m.env - scene.environmentIntensity) * 0.06;

      grade.uniforms.uTime.value = t;
      composer.render();
      if (!ready) setReady(true);
    };
    frame();

    const onResize = () => {
      w = container.clientWidth; h = container.clientHeight;
      camera.aspect = w / h;
      // portrait screens need a wider vertical FOV so the whole set stays in frame
      camera.fov = w / h < 0.9 ? 52 : 32;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };
    onResize();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', onResize);
      container.removeEventListener('pointermove', onMove);
      composer.dispose();
      renderer.dispose();
      pmrem.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
      });
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jump = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (i / (CHAPTERS.length - 1)) * total, behavior: 'smooth' });
  };

  const ch = CHAPTERS[active];

  return (
    <section id="3d-model" ref={trackRef} className="relative" style={{ height: `${CHAPTERS.length * 90 + 60}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#030304]">
        <div ref={mountRef} className="absolute inset-0" />

        {/* loading veil */}
        <div className={`pointer-events-none absolute inset-0 grid place-items-center bg-[#030304] transition-opacity duration-1000 ${ready ? 'opacity-0' : 'opacity-100'}`}>
          <span className="eyebrow animate-pulse">Lighting the brazier</span>
        </div>

        {/* top-left section label */}
        <div className="pointer-events-none absolute left-6 top-24 sm:left-12">
          <span className="eyebrow">3D Showcase</span>
        </div>

        {/* chapter copy */}
        <div className="pointer-events-none absolute bottom-28 left-6 right-6 sm:bottom-20 sm:left-12 sm:max-w-[30rem]">
          <div key={ch.id} className="animate-chapter">
            <div className="mb-4 flex items-center gap-4">
              <span className="font-serif text-5xl font-light text-gold-300/90 sm:text-6xl">{ch.index}</span>
              <span className="h-px w-10 bg-gold-300/50" />
              <span className="eyebrow">{ch.kicker}</span>
            </div>
            <h3 className="font-serif text-3xl font-light leading-[1.05] text-ivory sm:text-5xl">{ch.title}</h3>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/65">{ch.body}</p>
          </div>
        </div>

        {/* chapter rail */}
        <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-5 sm:flex sm:right-10">
          {CHAPTERS.map((c, i) => (
            <button key={c.id} onClick={() => jump(i)} className="group flex items-center gap-3" aria-label={c.kicker}>
              <span className={`text-[10px] uppercase tracking-[0.25em] transition-all ${i === active ? 'translate-x-0 text-gold-300 opacity-100' : 'translate-x-2 text-ivory/50 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}>
                {c.kicker}
              </span>
              <span className={`block h-px transition-all duration-500 ${i === active ? 'w-12 bg-gold-300' : 'w-5 bg-ivory/30 group-hover:w-8 group-hover:bg-ivory/60'}`} />
            </button>
          ))}
        </div>

        {/* bottom controls */}
        <div className="absolute bottom-6 right-6 flex items-center gap-2 sm:right-12">
          <div className="flex overflow-hidden border border-ivory/15 bg-black/40 backdrop-blur">
            {(['gold', 'midnight', 'emerald'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`px-3 py-2 text-[10px] uppercase tracking-[0.22em] transition-colors ${mood === m ? 'bg-gold-300 text-black' : 'text-ivory/60 hover:text-ivory'}`}
              >
                {m}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSmoke((s) => !s)}
            className={`border px-3 py-2 text-[10px] uppercase tracking-[0.22em] backdrop-blur transition-colors ${smoke ? 'border-gold-300/60 bg-gold-300/10 text-gold-300' : 'border-ivory/15 bg-black/40 text-ivory/60'}`}
          >
            Smoke {smoke ? 'on' : 'off'}
          </button>
        </div>

        {/* scroll cue */}
        <div className={`pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-500 sm:flex ${active === 0 ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-[9px] uppercase tracking-[0.35em] text-ivory/50">Scroll to explore</span>
          <span className="h-8 w-px animate-pulse bg-gradient-to-b from-gold-300 to-transparent" />
        </div>
      </div>
    </section>
  );
};
