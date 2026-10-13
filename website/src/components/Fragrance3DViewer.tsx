import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Flame, Wind, RotateCcw, Compass, Sun, Moon, Sparkles, Check, Droplets, Info, Eye } from 'lucide-react';

type LightingTheme = 'gold' | 'midnight' | 'emerald';
type HotspotId = 'overview' | 'embers' | 'emblem' | 'attar' | 'pillars';

export const Fragrance3DViewer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeHotspot, setActiveHotspot] = useState<HotspotId>('overview');
  const [lighting, setLighting] = useState<LightingTheme>('gold');
  const [smokeActive, setSmokeActive] = useState<boolean>(true);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [showNotes, setShowNotes] = useState<boolean>(true);

  // References
  const controlsRef = useRef<OrbitControls | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.8, 4.8));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.7, 0));
  const smokeParticlesRef = useRef<THREE.Points | null>(null);
  const emberLightRef = useRef<THREE.PointLight | null>(null);
  const dirLight1Ref = useRef<THREE.DirectionalLight | null>(null);
  const dirLight2Ref = useRef<THREE.DirectionalLight | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- 1. SCENE SETUP ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060609);
    scene.fog = new THREE.FogExp2(0x060609, 0.07);

    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 4.8);
    cameraRef.current = camera;

    // --- 2. RENDERER ---
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // --- 3. CONTROLS ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // prevent camera going under floor
    controls.minDistance = 1.8;
    controls.maxDistance = 7.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;
    controls.target.set(0, 0.7, 0);
    controlsRef.current = controls;

    // --- 4. LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xfff5e0, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffdf88, 3.2);
    dirLight1.position.set(4, 7, 5);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 1024;
    dirLight1.shadow.mapSize.height = 1024;
    scene.add(dirLight1);
    dirLight1Ref.current = dirLight1;

    const dirLight2 = new THREE.DirectionalLight(0x7590b0, 1.6);
    dirLight2.position.set(-5, 4, -4);
    scene.add(dirLight2);
    dirLight2Ref.current = dirLight2;

    // Charcoal ember flickering point light
    const emberLight = new THREE.PointLight(0xff4500, 3.8, 3.5);
    emberLight.position.set(-0.65, 1.5, 0);
    scene.add(emberLight);
    emberLightRef.current = emberLight;

    // Specular Rim Light for Crystal and Acrylic
    const rimLight = new THREE.PointLight(0xffd700, 2.2, 4.0);
    rimLight.position.set(1.2, 1.2, 0.8);
    scene.add(rimLight);

    // --- 5. MATERIALS ---
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.14,
    });

    const glossyBlackAcrylic = new THREE.MeshStandardMaterial({
      color: 0x07070a,
      roughness: 0.12,
      metalness: 0.9,
    });

    const polishedBrass = new THREE.MeshStandardMaterial({
      color: 0xe5c358,
      metalness: 0.96,
      roughness: 0.12,
    });

    // Mirror/Reflective Luxury Floor
    const floorGeo = new THREE.CylinderGeometry(3.0, 3.2, 0.15, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0c0d14,
      roughness: 0.25,
      metalness: 0.8,
    });
    const floorPedestal = new THREE.Mesh(floorGeo, floorMat);
    floorPedestal.position.y = -0.075;
    floorPedestal.receiveShadow = true;
    scene.add(floorPedestal);

    // Concentric Gold Filigree Rings on Floor
    const ringGeo1 = new THREE.TorusGeometry(3.02, 0.04, 16, 64);
    const ring1 = new THREE.Mesh(ringGeo1, goldMaterial);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = 0.01;
    scene.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(1.85, 0.02, 16, 64);
    const ring2 = new THREE.Mesh(ringGeo2, goldMaterial);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = 0.012;
    scene.add(ring2);

    // High-Resolution Salman Logo Canvas Texture
    const createLogoTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#08080c';
        ctx.fillRect(0, 0, 512, 512);

        // Gold Arabic Flame Calligraphy
        ctx.fillStyle = '#D4AF37';
        ctx.textAlign = 'center';
        ctx.font = 'bold 130px serif';
        ctx.fillText('ش', 256, 215);

        // Salman Perfumes Typography
        ctx.font = '700 38px Cinzel, serif';
        ctx.letterSpacing = '6px';
        ctx.fillText('SALMAN', 256, 305);

        ctx.font = '500 20px Montserrat, sans-serif';
        ctx.fillStyle = '#C59B27';
        ctx.fillText('PERFUMES', 256, 345);

        // Gold border frame
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 4;
        ctx.strokeRect(35, 35, 442, 442);
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      return tex;
    };
    const logoTexture = createLogoTexture();

    // --- 6. MODEL 1: SALMAN SIGNATURE MABKHARA BURNER STAND ---
    const standGroup = new THREE.Group();
    standGroup.position.set(-0.65, 0, 0);
    scene.add(standGroup);

    // A. Base Pedestal (Pyramidal trapezoid with beveled acrylic gloss)
    const baseGeo = new THREE.CylinderGeometry(0.38, 0.65, 0.55, 4);
    const baseMesh = new THREE.Mesh(baseGeo, glossyBlackAcrylic);
    baseMesh.position.y = 0.28;
    baseMesh.rotation.y = Math.PI / 4;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    standGroup.add(baseMesh);

    // Gold trim around base top
    const baseTrimGeo = new THREE.BoxGeometry(0.56, 0.03, 0.56);
    const baseTrim = new THREE.Mesh(baseTrimGeo, goldMaterial);
    baseTrim.position.y = 0.56;
    standGroup.add(baseTrim);

    // B. Quad Gold Pillar Columns
    const pillarPositions = [
      [-0.14, -0.14],
      [0.14, -0.14],
      [-0.14, 0.14],
      [0.14, 0.14],
    ];
    pillarPositions.forEach(([px, pz]) => {
      const pillarGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.55, 16);
      const pillarMesh = new THREE.Mesh(pillarGeo, polishedBrass);
      pillarMesh.position.set(px, 0.85, pz);
      pillarMesh.castShadow = true;
      standGroup.add(pillarMesh);

      // Gold accent rings on pillars
      const pRingGeo = new THREE.TorusGeometry(0.03, 0.008, 8, 16);
      const pRing1 = new THREE.Mesh(pRingGeo, goldMaterial);
      pRing1.rotation.x = Math.PI / 2;
      pRing1.position.set(px, 0.65, pz);
      standGroup.add(pRing1);

      const pRing2 = pRing1.clone();
      pRing2.position.set(px, 1.05, pz);
      standGroup.add(pRing2);
    });

    // C. Top Brazier Body (Inverted Flared Traditional Crown with 4 corners)
    const topBodyGeo = new THREE.CylinderGeometry(0.62, 0.35, 0.65, 4);
    const logoMat = new THREE.MeshStandardMaterial({
      map: logoTexture,
      roughness: 0.18,
      metalness: 0.8,
    });
    const topBodyMaterials = [
      logoMat, // front face shows Salman logo
      glossyBlackAcrylic,
      glossyBlackAcrylic,
      glossyBlackAcrylic,
      goldMaterial,
      goldMaterial,
    ];
    const topBody = new THREE.Mesh(topBodyGeo, topBodyMaterials);
    topBody.position.y = 1.45;
    topBody.rotation.y = Math.PI / 4;
    topBody.castShadow = true;
    standGroup.add(topBody);

    // 4 Corner Gold finials on top rim
    const finialOffsets = [
      [-0.42, 0, 0],
      [0.42, 0, 0],
      [0, 0, -0.42],
      [0, 0, 0.42],
    ];
    finialOffsets.forEach(([fx, _, fz]) => {
      const tipGeo = new THREE.ConeGeometry(0.045, 0.12, 4);
      const tipMesh = new THREE.Mesh(tipGeo, goldMaterial);
      tipMesh.position.set(fx, 1.82, fz);
      standGroup.add(tipMesh);
    });

    // D. Metal Incense Burner Basin & Glowing Embers
    const basinGeo = new THREE.CylinderGeometry(0.28, 0.24, 0.1, 24);
    const basinMat = new THREE.MeshStandardMaterial({
      color: 0x909090,
      metalness: 0.95,
      roughness: 0.25,
    });
    const basin = new THREE.Mesh(basinGeo, basinMat);
    basin.position.y = 1.74;
    standGroup.add(basin);

    // Glowing Charcoal briquettes
    const emberMat = new THREE.MeshStandardMaterial({
      color: 0xff3b00,
      emissive: 0xff3300,
      emissiveIntensity: 2.5,
      roughness: 0.9,
    });
    const emberGeo = new THREE.DodecahedronGeometry(0.12, 1);
    const ember = new THREE.Mesh(emberGeo, emberMat);
    ember.position.set(0, 1.80, 0);
    standGroup.add(ember);

    // Small Natural Agarwood / Oud wood chips on charcoal
    const oudMat = new THREE.MeshStandardMaterial({
      color: 0x382012,
      roughness: 0.85,
      metalness: 0.1,
    });
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const chipGeo = new THREE.BoxGeometry(0.06, 0.04, 0.08);
      const chip = new THREE.Mesh(chipGeo, oudMat);
      chip.position.set(Math.cos(angle) * 0.11, 1.81, Math.sin(angle) * 0.11);
      chip.rotation.set(Math.random(), Math.random(), Math.random());
      standGroup.add(chip);
    }

    // --- 7. MODEL 2: ROYAL CRYSTAL ATTAR FLACON (PERFUME BOTTLE) ---
    const attarGroup = new THREE.Group();
    attarGroup.position.set(0.9, 0, 0);
    scene.add(attarGroup);

    // Bottle Base Plinth
    const bottlePlinthGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.1, 8);
    const bottlePlinth = new THREE.Mesh(bottlePlinthGeo, goldMaterial);
    bottlePlinth.position.y = 0.05;
    bottlePlinth.castShadow = true;
    attarGroup.add(bottlePlinth);

    // Faceted Crystal Flacon Body
    const crystalGeo = new THREE.CylinderGeometry(0.28, 0.32, 0.85, 8);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      opacity: 0.92,
      transparent: true,
      roughness: 0.06,
      ior: 1.55,
      reflectivity: 0.95,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
    const crystalBottle = new THREE.Mesh(crystalGeo, crystalMat);
    crystalBottle.position.y = 0.52;
    crystalBottle.castShadow = true;
    attarGroup.add(crystalBottle);

    // Liquid Attar volume
    const liquidGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.65, 8);
    const liquidMat = new THREE.MeshStandardMaterial({
      color: 0xe5a324,
      emissive: 0x6e4500,
      emissiveIntensity: 0.45,
      roughness: 0.2,
      metalness: 0.4,
      transparent: true,
      opacity: 0.88,
    });
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.position.y = 0.46;
    attarGroup.add(liquidMesh);

    // Gold Neck & Collar
    const collarGeo = new THREE.CylinderGeometry(0.16, 0.22, 0.14, 16);
    const collar = new THREE.Mesh(collarGeo, goldMaterial);
    collar.position.y = 1.0;
    attarGroup.add(collar);

    // Ornate Royal Dome Cap & Finial Spire
    const capGeo = new THREE.SphereGeometry(0.17, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.8);
    const cap = new THREE.Mesh(capGeo, goldMaterial);
    cap.position.y = 1.12;
    attarGroup.add(cap);

    const finialSpireGeo = new THREE.ConeGeometry(0.04, 0.22, 12);
    const finialSpire = new THREE.Mesh(finialSpireGeo, goldMaterial);
    finialSpire.position.y = 1.34;
    attarGroup.add(finialSpire);

    // Emerald Crown Gem
    const gemGeo = new THREE.OctahedronGeometry(0.05);
    const gemMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      metalness: 0.4,
      roughness: 0.1,
      emissive: 0x044e36,
      emissiveIntensity: 0.6,
    });
    const gem = new THREE.Mesh(gemGeo, gemMat);
    gem.position.y = 1.48;
    attarGroup.add(gem);

    // --- 8. VOLUMETRIC SMOKE PARTICLES ---
    const smokeCount = 180;
    const smokeGeo = new THREE.BufferGeometry();
    const smokePositions = new Float32Array(smokeCount * 3);
    const smokeVelocity: { x: number; y: number; z: number; life: number; maxLife: number }[] = [];

    for (let i = 0; i < smokeCount; i++) {
      const idx = i * 3;
      smokePositions[idx] = -0.65 + (Math.random() - 0.5) * 0.1;
      smokePositions[idx + 1] = 1.8 + Math.random() * 0.1;
      smokePositions[idx + 2] = (Math.random() - 0.5) * 0.1;

      smokeVelocity.push({
        x: (Math.random() - 0.5) * 0.006,
        y: 0.008 + Math.random() * 0.012,
        z: (Math.random() - 0.5) * 0.006,
        life: Math.random() * 120,
        maxLife: 90 + Math.random() * 60,
      });
    }

    smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePositions, 3));

    const createParticleTexture = () => {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const cCtx = c.getContext('2d');
      if (cCtx) {
        const grad = cCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 250, 240, 0.85)');
        grad.addColorStop(0.4, 'rgba(230, 215, 185, 0.45)');
        grad.addColorStop(1, 'rgba(200, 180, 150, 0)');
        cCtx.fillStyle = grad;
        cCtx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(c);
    };

    const smokeMat = new THREE.PointsMaterial({
      size: 0.38,
      map: createParticleTexture(),
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xf4eedb,
    });

    const smokePoints = new THREE.Points(smokeGeo, smokeMat);
    scene.add(smokePoints);
    smokeParticlesRef.current = smokePoints;

    // --- 9. RESIZE LISTENER ---
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // --- 10. ANIMATION LOOP ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      controls.update();

      // Camera lerp towards target
      camera.position.lerp(targetCamPos.current, 0.05);
      controls.target.lerp(targetLookAt.current, 0.05);

      // Charcoal ember pulsation
      if (emberLightRef.current) {
        emberLightRef.current.intensity = 3.0 + Math.sin(elapsedTime * 4.5) * 1.4;
      }

      // Smoke simulation
      if (smokePoints && smokeActive) {
        smokePoints.visible = true;
        const posAttr = smokeGeo.attributes.position as THREE.BufferAttribute;
        const positions = posAttr.array as Float32Array;

        for (let i = 0; i < smokeCount; i++) {
          const idx = i * 3;
          const v = smokeVelocity[i];
          v.life += 1;

          if (v.life > v.maxLife) {
            v.life = 0;
            positions[idx] = -0.65 + (Math.random() - 0.5) * 0.12;
            positions[idx + 1] = 1.8 + Math.random() * 0.08;
            positions[idx + 2] = (Math.random() - 0.5) * 0.12;
          } else {
            const progress = v.life / v.maxLife;
            const swirlX = Math.sin(elapsedTime * 2 + progress * 8) * 0.003;
            const swirlZ = Math.cos(elapsedTime * 2.2 + progress * 7) * 0.003;

            positions[idx] += v.x + swirlX;
            positions[idx + 1] += v.y;
            positions[idx + 2] += v.z + swirlZ;
          }
        }
        posAttr.needsUpdate = true;
      } else if (smokePoints) {
        smokePoints.visible = false;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [smokeActive]);

  // Handle Camera Hotspots Transitions
  useEffect(() => {
    if (!controlsRef.current) return;

    if (activeHotspot === 'overview') {
      targetCamPos.current.set(0, 1.8, 4.8);
      targetLookAt.current.set(0, 0.7, 0);
    } else if (activeHotspot === 'embers') {
      // Zoom into glowing charcoal and Oud smoke
      targetCamPos.current.set(-0.65, 2.2, 1.4);
      targetLookAt.current.set(-0.65, 1.8, 0);
    } else if (activeHotspot === 'emblem') {
      // Zoom into Salman golden emblem
      targetCamPos.current.set(-0.65, 1.45, 1.8);
      targetLookAt.current.set(-0.65, 1.45, 0);
    } else if (activeHotspot === 'pillars') {
      // Focus on brass pillars & stand structure
      targetCamPos.current.set(-0.65, 0.9, 2.0);
      targetLookAt.current.set(-0.65, 0.85, 0);
    } else if (activeHotspot === 'attar') {
      // Focus on crystal attar decanter
      targetCamPos.current.set(0.9, 1.1, 2.2);
      targetLookAt.current.set(0.9, 0.65, 0);
    }
  }, [activeHotspot]);

  // Handle Lighting Switch
  useEffect(() => {
    if (!dirLight1Ref.current || !dirLight2Ref.current || !sceneRef.current) return;

    if (lighting === 'gold') {
      sceneRef.current.background = new THREE.Color(0x060609);
      dirLight1Ref.current.color.setHex(0xffdf88);
      dirLight1Ref.current.intensity = 3.2;
      dirLight2Ref.current.color.setHex(0x7590b0);
      dirLight2Ref.current.intensity = 1.6;
    } else if (lighting === 'midnight') {
      sceneRef.current.background = new THREE.Color(0x040508);
      dirLight1Ref.current.color.setHex(0xd0e0ff);
      dirLight1Ref.current.intensity = 2.4;
      dirLight2Ref.current.color.setHex(0x354060);
      dirLight2Ref.current.intensity = 1.8;
    } else if (lighting === 'emerald') {
      sceneRef.current.background = new THREE.Color(0x03140e);
      dirLight1Ref.current.color.setHex(0xfad275);
      dirLight1Ref.current.intensity = 2.6;
      dirLight2Ref.current.color.setHex(0x10b981);
      dirLight2Ref.current.intensity = 2.2;
    }
  }, [lighting]);

  const toggleAutoRotate = () => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = !isAutoRotating;
      setIsAutoRotating(!isAutoRotating);
    }
  };

  const resetCamera = () => {
    setActiveHotspot('overview');
    if (controlsRef.current) {
      targetCamPos.current.set(0, 1.8, 4.8);
      targetLookAt.current.set(0, 0.7, 0);
      controlsRef.current.target.set(0, 0.7, 0);
    }
  };

  const hotspotDetails: Record<HotspotId, { title: string; subtitle: string; desc: string }> = {
    overview: {
      title: 'The 4 Signature Display Pedestals & Royal Attar Flacon',
      subtitle: 'Complete Entrance Setup',
      desc: 'High-gloss acrylic stands with brass support columns, burning natural Oud Bukhoor, and personalized attar decanting.',
    },
    embers: {
      title: 'Glowing Charcoal & Handcrafted Bukhoor',
      subtitle: 'Live Incense Brazier',
      desc: 'Simmering charcoal embers with genuine agarwood chips, emitting dense, fragrant clouds that greet arriving guests.',
    },
    emblem: {
      title: 'Salman Perfumes Royal Insignia',
      subtitle: 'Embossed Arabic Calligraphy',
      desc: 'Signature gold flame emblem adorned on every custom-fabricated pedestal, reflecting royal heritage.',
    },
    pillars: {
      title: 'Quad Brass Architectural Columns',
      subtitle: 'Polished Metallic Detailing',
      desc: 'Four vertical brass support columns linking the pyramidal base to the ceremonial brazier.',
    },
    attar: {
      title: 'Faceted Crystal Attar Decanter',
      subtitle: '24K Gold Embellished Spire',
      desc: 'Contains our curated alcohol-free pure perfume oil collection, respectfully applied to guests by Arabic-attired staff.',
    },
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden glass-panel border border-gold-500/30 shadow-2xl">
      {/* Top Bar: Hotspot Navigation Pills */}
      <div className="absolute top-0 left-0 right-0 z-20 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-black/80 backdrop-blur-md border-b border-gold-500/20">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span className="text-xs uppercase tracking-widest text-gold-300 font-display font-bold">
            Interactive Stand Inspector
          </span>
        </div>

        {/* Hotspots Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'overview' as HotspotId, label: 'Full View' },
            { id: 'embers' as HotspotId, label: '🔥 Charcoal Embers' },
            { id: 'emblem' as HotspotId, label: '👑 Gold Emblem' },
            { id: 'pillars' as HotspotId, label: '✨ Brass Columns' },
            { id: 'attar' as HotspotId, label: '💎 Attar Decanter' },
          ].map((h) => (
            <button
              key={h.id}
              onClick={() => setActiveHotspot(h.id)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium whitespace-nowrap transition-all ${
                activeHotspot === h.id
                  ? 'bg-gold-500 text-royal-black font-bold shadow-md scale-105'
                  : 'text-gray-300 hover:text-white bg-white/5 hover:bg-white/10'
              }`}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full h-[480px] sm:h-[580px] cursor-grab active:cursor-grabbing canvas-container relative"
      >
        {/* Floating Touch / Drag Guidance */}
        <div className="absolute bottom-20 left-4 z-10 pointer-events-none hidden sm:flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[11px] text-gray-300 font-mono">
          <Compass className="w-3.5 h-3.5 text-gold-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Rotate 360° • Pinch / scroll to zoom</span>
        </div>
      </div>

      {/* Dynamic Hotspot Information Card Overlay */}
      <div className="absolute bottom-16 sm:bottom-20 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-10 pointer-events-none">
        <div className="glass-panel-gold p-4 rounded-2xl shadow-2xl border border-gold-500/40 pointer-events-auto">
          <span className="text-[10px] uppercase font-mono tracking-widest text-gold-400 block mb-0.5">
            {hotspotDetails[activeHotspot].subtitle}
          </span>
          <h4 className="text-sm sm:text-base font-display font-bold text-white">
            {hotspotDetails[activeHotspot].title}
          </h4>
          <p className="text-xs text-gray-300 font-serif italic mt-1 leading-relaxed">
            {hotspotDetails[activeHotspot].desc}
          </p>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-black/85 backdrop-blur-md border-t border-gold-500/20">
        {/* Lighting Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-gray-400 font-medium hidden sm:inline mr-1">Lighting:</span>
          <button
            onClick={() => setLighting('gold')}
            className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1 transition-all ${
              lighting === 'gold'
                ? 'bg-gold-500/20 border-gold-500 text-gold-400'
                : 'bg-black/40 border-white/10 text-gray-400'
            }`}
          >
            <Sun className="w-3 h-3 text-gold-400" />
            <span className="text-[11px]">Royal Gold</span>
          </button>
          <button
            onClick={() => setLighting('midnight')}
            className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1 transition-all ${
              lighting === 'midnight'
                ? 'bg-blue-950/40 border-blue-400 text-blue-300'
                : 'bg-black/40 border-white/10 text-gray-400'
            }`}
          >
            <Moon className="w-3 h-3 text-blue-300" />
            <span className="text-[11px]">Midnight</span>
          </button>
          <button
            onClick={() => setLighting('emerald')}
            className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1 transition-all ${
              lighting === 'emerald'
                ? 'bg-emerald-950/40 border-emerald-400 text-emerald-300'
                : 'bg-black/40 border-white/10 text-gray-400'
            }`}
          >
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span className="text-[11px]">Emerald</span>
          </button>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-2">
          {/* Smoke Toggle */}
          <button
            onClick={() => setSmokeActive(!smokeActive)}
            className={`px-3 py-1 rounded-lg border text-xs flex items-center gap-1.5 transition-all ${
              smokeActive
                ? 'bg-gold-500/20 border-gold-500 text-gold-300'
                : 'bg-black/40 border-white/10 text-gray-400'
            }`}
          >
            <Wind className={`w-3.5 h-3.5 ${smokeActive ? 'text-gold-400' : 'text-gray-500'}`} />
            <span>Smoke {smokeActive ? 'ON' : 'OFF'}</span>
          </button>

          {/* Auto-Rotate Toggle */}
          <button
            onClick={toggleAutoRotate}
            className={`px-3 py-1 rounded-lg border text-xs flex items-center gap-1.5 transition-all ${
              isAutoRotating
                ? 'bg-gold-500/20 border-gold-500 text-gold-300'
                : 'bg-black/40 border-white/10 text-gray-400'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-gold-400" />
            <span className="hidden sm:inline">Orbit</span>
          </button>

          {/* Reset Camera */}
          <button
            onClick={resetCamera}
            className="p-1.5 rounded-lg border border-white/10 bg-black/40 text-gray-400 hover:text-white hover:border-gold-500/50"
            title="Reset Angle"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
