import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Cinematic scroll-driven 3D ember + smoke scene.
 * - 3 ember particle layers at different depths
 * - Volumetric smoke clouds (sprites that rise, expand, fade)
 * - Central glow sprite ("heart of the fire")
 * - Camera dollies forward, fog shifts color on scroll
 * - Smoke intensity increases with scroll progress
 */

function createGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,220,160,1)');
  g.addColorStop(0.15, 'rgba(255,140,60,0.7)');
  g.addColorStop(0.45, 'rgba(200,56,51,0.2)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function createSmokeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Main soft cloud body
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 120);
  g.addColorStop(0, 'rgba(210,195,175,0.5)');
  g.addColorStop(0.25, 'rgba(180,165,145,0.3)');
  g.addColorStop(0.55, 'rgba(130,110,95,0.12)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);

  // Cloud-like noise blobs for organic texture
  for (let i = 0; i < 25; i++) {
    const x = 50 + Math.random() * 156;
    const y = 50 + Math.random() * 156;
    const r = 15 + Math.random() * 45;
    const ng = ctx.createRadialGradient(x, y, 0, x, y, r);
    ng.addColorStop(0, `rgba(220,200,180,${0.08 + Math.random() * 0.12})`);
    ng.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = ng;
    ctx.fillRect(0, 0, 256, 256);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

const LAYER_CONFIGS = [
  { countM: 80, countD: 220, spread: 30, z: [-15, -5], size: 0.05, opacity: 0.4, speed: 0.002, colors: [0x3a2218, 0x4a2820, 0x2a1a15] },
  { countM: 50, countD: 150, spread: 22, z: [-8, 2], size: 0.12, opacity: 0.75, speed: 0.005, colors: [0xC83833, 0xE5C29C, 0xFF6B3D, 0x8B2B26] },
  { countM: 18, countD: 55, spread: 16, z: [-2, 6], size: 0.25, opacity: 0.9, speed: 0.009, colors: [0xFFD4A0, 0xE5C29C, 0xFF8855] },
];

function createLayer(cfg, isMobile, texture) {
  const count = isMobile ? cfg.countM : cfg.countD;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const colorObjs = cfg.colors.map(c => new THREE.Color(c));

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * cfg.spread;
    positions[i * 3 + 1] = (Math.random() - 0.5) * cfg.spread;
    positions[i * 3 + 2] = cfg.z[0] + Math.random() * (cfg.z[1] - cfg.z[0]);
    const c = colorObjs[Math.floor(Math.random() * colorObjs.length)];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
    phases[i] = Math.random() * Math.PI * 2;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: cfg.size,
    map: texture,
    vertexColors: true,
    transparent: true,
    opacity: cfg.opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  return { points: new THREE.Points(geometry, material), geometry, material, count, speed: cfg.speed, phases, baseOpacity: cfg.opacity };
}

function updateLayer(layer, time) {
  const { geometry, count, speed, phases } = layer;
  const pos = geometry.attributes.position.array;
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    pos[i3 + 1] += speed;
    pos[i3] += Math.sin(time * 0.5 + phases[i] + pos[i3 + 1] * 0.3) * 0.003;
    if (pos[i3 + 1] > 12) {
      pos[i3 + 1] = -12;
      pos[i3] = (Math.random() - 0.5) * 20;
    }
  }
  geometry.attributes.position.needsUpdate = true;
  layer.material.opacity = layer.baseOpacity * (0.85 + Math.sin(time * 0.8) * 0.15);
}

const FOG_PHASES = [
  { p: 0.0, c: new THREE.Color(0x0a0807) },
  { p: 0.25, c: new THREE.Color(0x180805) },
  { p: 0.5, c: new THREE.Color(0x1a0e08) },
  { p: 0.75, c: new THREE.Color(0x120806) },
  { p: 1.0, c: new THREE.Color(0x0a0807) },
];

function applyFogColor(progress, target) {
  for (let i = 0; i < FOG_PHASES.length - 1; i++) {
    const a = FOG_PHASES[i], b = FOG_PHASES[i + 1];
    if (progress >= a.p && progress <= b.p) {
      const t = (progress - a.p) / (b.p - a.p);
      target.copy(a.c).lerp(b.c, t);
      return;
    }
  }
  target.copy(FOG_PHASES[FOG_PHASES.length - 1].c);
}

export default function EmberScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0807, 0.025);

    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    mount.appendChild(renderer.domElement);

    const glowTexture = createGlowTexture();
    const smokeTexture = createSmokeTexture();

    // Ember particle layers
    const layers = LAYER_CONFIGS.map(cfg => createLayer(cfg, isMobile, glowTexture));
    layers.forEach(l => scene.add(l.points));

    // Central glow — "heart of the fire"
    const glowMat = new THREE.SpriteMaterial({
      map: glowTexture,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glowSprite = new THREE.Sprite(glowMat);
    glowSprite.scale.set(5, 5, 1);
    glowSprite.position.set(0, -2, -4);
    scene.add(glowSprite);

    // Volumetric smoke system
    const smokePuffs = [];
    const maxSmoke = isMobile ? 12 : 30;

    function spawnSmoke(scrollProgress) {
      const mat = new THREE.SpriteMaterial({
        map: smokeTexture,
        transparent: true,
        opacity: 0,
        blending: THREE.NormalBlending,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(mat);
      const startScale = 3 + Math.random() * 4;
      sprite.scale.set(startScale, startScale, 1);
      sprite.position.set(
        (Math.random() - 0.5) * 14,
        -8 - Math.random() * 3,
        -4 + Math.random() * 8
      );
      scene.add(sprite);
      smokePuffs.push({
        sprite,
        mat,
        vy: 0.01 + Math.random() * 0.018,
        vx: (Math.random() - 0.5) * 0.004,
        growth: 0.008 + Math.random() * 0.014,
        life: 0,
        maxLife: 350 + Math.random() * 250,
        baseOpacity: (0.15 + Math.random() * 0.12) * (1 + scrollProgress * 0.8),
        phase: Math.random() * Math.PI * 2,
      });
    }

    function updateSmoke(time, scrollProgress) {
      // Spawn rate increases with scroll
      const spawnRate = 0.05 + scrollProgress * 0.06;
      if (smokePuffs.length < maxSmoke && Math.random() < spawnRate) {
        spawnSmoke(scrollProgress);
      }

      for (let i = smokePuffs.length - 1; i >= 0; i--) {
        const p = smokePuffs[i];
        p.life++;

        p.sprite.position.y += p.vy;
        p.sprite.position.x += p.vx + Math.sin(time * 0.3 + p.phase + p.life * 0.015) * 0.003;

        const s = parseFloat(p.sprite.scale.x) + p.growth;
        p.sprite.scale.set(s, s, 1);

        // Fade in (0-20%), hold (20-70%), fade out (70-100%)
        const lifeRatio = p.life / p.maxLife;
        let alpha;
        if (lifeRatio < 0.2) {
          alpha = (lifeRatio / 0.2) * p.baseOpacity;
        } else if (lifeRatio > 0.7) {
          alpha = ((1 - lifeRatio) / 0.3) * p.baseOpacity;
        } else {
          alpha = p.baseOpacity;
        }
        p.mat.opacity = alpha;

        if (p.life >= p.maxLife || p.sprite.position.y > 12) {
          scene.remove(p.sprite);
          p.mat.dispose();
          smokePuffs.splice(i, 1);
        }
      }
    }

    // Scroll & mouse tracking
    let scrollProgress = 0, targetScroll = 0;
    let mouseX = 0, mouseY = 0, targetMouseX = 0, targetMouseY = 0;

    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      targetScroll = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (!isMobile) {
      const onMouse = (e) => {
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 0.4;
        targetMouseY = (e.clientY / window.innerHeight - 0.5) * 0.3;
      };
      window.addEventListener('mousemove', onMouse, { passive: true });
    }

    let raf;
    const clock = new THREE.Clock();
    let isVisible = true;
    const onVisibility = () => { isVisible = !document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);

    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!isVisible) return;

      const t = clock.getElapsedTime();

      // Smooth lerp
      scrollProgress += (targetScroll - scrollProgress) * 0.04;
      mouseX += (targetMouseX - mouseX) * 0.03;
      mouseY += (targetMouseY - mouseY) * 0.03;

      if (!prefersReducedMotion) {
        layers.forEach(l => updateLayer(l, t));
        updateSmoke(t, scrollProgress);

        // Camera dolly through the scene — more dramatic
        camera.position.z = 10 - scrollProgress * 5;
        camera.position.y = -scrollProgress * 2 + mouseY;
        camera.position.x = mouseX;
        camera.lookAt(0, -scrollProgress * 2, 0);

        // Central glow grows and intensifies with scroll
        glowSprite.position.y = -2 - scrollProgress * 2;
        const gs = 5 + scrollProgress * 8;
        glowSprite.scale.set(gs, gs, 1);
        glowMat.opacity = 0.15 + scrollProgress * 0.3;

        // Fog color shift
        applyFogColor(scrollProgress, scene.fog.color);
      }

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      layers.forEach(l => { l.geometry.dispose(); l.material.dispose(); });
      smokePuffs.forEach(p => { scene.remove(p.sprite); p.mat.dispose(); });
      glowTexture.dispose();
      smokeTexture.dispose();
      glowMat.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 pointer-events-none z-0" aria-hidden="true" />;
}
