import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Flame } from 'lucide-react';
import { SITE_CONTENT } from '@/lib/siteContent';
import { Eyebrow } from '@/components/scene/ScrollReveal';

export default function FinalCTA() {
  const { finalCta } = SITE_CONTENT;

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian" />

      <div className="relative max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Eyebrow className="justify-center mb-8">{finalCta.eyebrow}</Eyebrow>
          <Flame size={40} className="text-ember mx-auto mb-6 ember-pulse" />
          <h2 className="font-display font-black text-bone text-4xl sm:text-7xl md:text-8xl tracking-tight leading-[0.95]">
            {finalCta.title}
            <br />
            <span className="text-ember italic text-glow-ember">{finalCta.titleAccent}</span>
          </h2>
          <p className="text-bone/60 text-lg sm:text-xl mt-8 max-w-xl mx-auto leading-relaxed">
            {finalCta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              to={finalCta.cta.to}
              className="group inline-flex items-center justify-center gap-3 bg-ember hover:bg-ember-dark text-obsidian font-bold text-lg px-10 py-5 rounded-full transition-all ember-glow"
            >
              {finalCta.cta.label}
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
            </Link>
            <Link
              to={finalCta.ctaSecondary.to}
              className="inline-flex items-center justify-center gap-3 border border-bone/20 hover:border-ember hover:text-ember text-bone font-semibold text-lg px-10 py-5 rounded-full transition-all"
            >
              {finalCta.ctaSecondary.label}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
