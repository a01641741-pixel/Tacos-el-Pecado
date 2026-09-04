import { useEffect, useRef } from 'react';
import { motion, useTransform } from 'framer-motion';
import { SITE_IMAGES } from '@/lib/siteContent';

/**
 * "La Cocina del Pecado" — multi-layer cinematic hero background.
 * Taco image as foreground subject (camera approaches on scroll),
 * Canvas 2D particle layers: ember glow with flicker, volumetric vapor,
 * occasional sparks. Mobile: reduced particles, no sparks.
 * Pauses when hero is scrolled past. Respects prefers-reduced-motion.
 */

function drawEmberGlow(ctx, w, h, intensity) {
  const glowY = h * 0.88;
  const glowR = Math.max(h * 0.45, 200);
  const grad = ctx.createRadialGradient(w / 2, glowY, 0, w / 2, glowY, glowR);
  grad.addColorStop(0, `rgba(255, 120, 40, ${intensity})`);
  grad.addColorStop(0.4, `rgba(200, 56, 51, ${intensity * 0.3})`);
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

export default function HeroKitchenScene({ scrollYProgress }) {
  const canvasRef = useRef(null);

  // Scroll-driven camera approach
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    let w = 0, h = 0;
    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const smoke = [];
    const sparks = [];
    const maxSmoke = isMobile ? 6 : 18;

    let scrollIntensity = 0;
    let targetScroll = 0;
    const onScroll = () => {
      const heroH = window.innerHeight;
      targetScroll = heroH > 0 ? Math.min(window.scrollY / heroH, 1) : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    let raf;
    let lastTime = 0;
    let lastSpark = 0;

    const animate = (time) => {
      raf = requestAnimationFrame(animate);

      // Pause when hero is out of viewport
      if (window.scrollY > window.innerHeight) return;

      const dt = Math.min((time - lastTime) / 16.67, 3);
      lastTime = time;

      scrollIntensity += (targetScroll - scrollIntensity) * 0.05;
      ctx.clearRect(0, 0, w, h);

      if (prefersReducedMotion) {
        drawEmberGlow(ctx, w, h, 0.12);
        return;
      }

      // 1. Ember glow — flickering background light from the brasas
      const flicker = Math.sin(time * 0.003) * 0.02 + Math.sin(time * 0.007) * 0.015;
      const glowIntensity = 0.1 + scrollIntensity * 0.18 + flicker;
      drawEmberGlow(ctx, w, h, glowIntensity);

      // 2. Vapor/smoke — volumetric particles rising from the taco
      const spawnRate = (isMobile ? 0.012 : 0.022) + scrollIntensity * 0.02;
      if (smoke.length < maxSmoke && Math.random() < spawnRate * dt) {
        smoke.push({
          x: w * 0.5 + (Math.random() - 0.5) * w * 0.15,
          y: h * 0.6,
          vx: (Math.random() - 0.5) * 0.2,
          vy: -(0.4 + Math.random() * 0.4) * (1 + scrollIntensity * 0.4),
          size: 15 + Math.random() * 25,
          growth: 0.15 + Math.random() * 0.1,
          life: 0,
          maxLife: 180 + Math.random() * 80,
        });
      }

      for (let i = smoke.length - 1; i >= 0; i--) {
        const s = smoke[i];
        s.x += s.vx * dt + Math.sin(time * 0.001 + s.life * 0.04) * 0.25 * dt;
        s.y += s.vy * dt;
        s.size += s.growth * dt;
        s.life += dt;

        if (s.life > s.maxLife || s.y < -50) {
          smoke.splice(i, 1);
          continue;
        }

        const alpha = (1 - s.life / s.maxLife) * 0.06;
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size);
        grad.addColorStop(0, `rgba(200, 180, 160, ${alpha})`);
        grad.addColorStop(1, 'rgba(200, 180, 160, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Occasional sparks — desktop only, very sparse
      if (!isMobile && time - lastSpark > 2500 + Math.random() * 3500) {
        lastSpark = time;
        sparks.push({
          x: w * 0.35 + Math.random() * w * 0.3,
          y: h * 0.82,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -(1.5 + Math.random() * 2),
          life: 0,
          maxLife: 50 + Math.random() * 30,
          size: 1 + Math.random() * 1.5,
        });
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vy += 0.03 * dt;
        s.life += dt;

        if (s.life > s.maxLife) {
          sparks.splice(i, 1);
          continue;
        }

        const alpha = 1 - s.life / s.maxLife;
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 5);
        grad.addColorStop(0, `rgba(255, 180, 80, ${alpha * 0.4})`);
        grad.addColorStop(1, 'rgba(255, 180, 80, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 220, 140, ${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Taco — main subject, camera approaches on scroll */}
      <motion.img
        src={SITE_IMAGES.heroBg}
        alt="La Cocina del Pecado"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ scale: imgScale, y: imgY }}
      />
      {/* Canvas particles — vapor, embers, sparks */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      {/* Dark overlays — text contrast, edge vignetting for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/80 to-obsidian/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/10 to-obsidian/50" />
    </div>
  );
}
