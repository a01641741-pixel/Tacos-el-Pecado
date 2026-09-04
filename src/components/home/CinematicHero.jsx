import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SITE_CONTENT } from '@/lib/siteContent';
import HeroKitchenScene from '@/components/home/HeroKitchenScene';
import { MaskLine } from '@/components/scene/ScrollReveal';

export default function CinematicHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const { hero } = SITE_CONTENT;

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      <HeroKitchenScene scrollYProgress={scrollYProgress} />

      <motion.div
        className="relative max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-32 w-full"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="inline-flex items-center gap-2 border border-ember/30 bg-ember/10 rounded-full px-4 py-1.5 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-ember animate-pulse" />
          <span className="text-ember text-xs font-mono tracking-[0.2em] uppercase">{hero.eyebrow}</span>
        </motion.div>

        <h1 className="font-display font-black text-bone leading-[0.9] tracking-tight text-5xl sm:text-7xl md:text-8xl">
          <MaskLine text={hero.titleLine1} delay={0.4} />
          <MaskLine delay={0.55}>
            {hero.titleLine2} <span className="text-ember italic text-glow-ember">{hero.titleAccent}</span>
          </MaskLine>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-bone/60 text-lg sm:text-xl mt-8 max-w-xl leading-relaxed"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 mt-10"
        >
          <Link
            to={hero.ctaPrimary.to}
            className="group inline-flex items-center justify-center gap-3 bg-ember hover:bg-ember-dark text-obsidian font-bold text-base px-8 py-4 rounded-full transition-all ember-glow"
          >
            {hero.ctaPrimary.label}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </Link>
          <Link
            to={hero.ctaSecondary.to}
            className="inline-flex items-center justify-center gap-3 border border-bone/20 hover:border-ember hover:text-ember text-bone font-semibold text-base px-8 py-4 rounded-full transition-all"
          >
            {hero.ctaSecondary.label}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="flex items-center gap-4 sm:gap-8 mt-10"
        >
          {hero.stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-4 sm:gap-8">
              {i > 0 && <div className="w-px h-8 sm:h-12 bg-white/10" />}
              <div>
                <div className="font-display font-black text-bone text-xl sm:text-3xl">{stat.value}</div>
                <div className="text-bone/40 text-[10px] sm:text-xs font-mono uppercase tracking-tight sm:tracking-wider mt-1">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: indicatorOpacity }}
      >
        <span className="text-bone/30 text-[10px] font-mono tracking-[0.3em] uppercase">Desliza</span>
        <div className="w-px h-12 bg-gradient-to-b from-ember to-transparent" />
      </motion.div>
    </section>
  );
}
