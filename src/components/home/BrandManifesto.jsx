import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SITE_CONTENT } from '@/lib/siteContent';
import { Eyebrow } from '@/components/scene/ScrollReveal';

export default function BrandManifesto() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const closingOpacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]);
  const closingY = useTransform(scrollYProgress, [0.7, 0.9], [20, 0]);

  const { manifesto } = SITE_CONTENT;

  return (
    <section ref={ref} className="relative min-h-[60vh] flex items-center justify-center py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <Eyebrow className="justify-center mb-10">{manifesto.eyebrow}</Eyebrow>

        <div className="space-y-6 sm:space-y-10">
          {manifesto.lines.map((line, i) => (
            <ManifestoLine
              key={i}
              progress={scrollYProgress}
              start={0.15 + i * 0.12}
              end={0.2 + i * 0.12}
              emphasis={line.emphasis}
            >
              {line.text}
            </ManifestoLine>
          ))}
        </div>

        <motion.div style={{ opacity: closingOpacity, y: closingY }} className="mt-12 sm:mt-20">
          <p className="font-display font-black text-ember text-4xl sm:text-6xl italic text-glow-ember">
            {manifesto.closing}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function ManifestoLine({ children, progress, start, end, emphasis }) {
  const opacity = useTransform(progress, [start, end], [0.12, 1]);
  const y = useTransform(progress, [start, end], [30, 0]);

  return (
    <motion.p
      style={{ opacity, y }}
      className={`font-display font-black tracking-tight leading-[1.1] ${
        emphasis
          ? 'text-ember italic text-3xl sm:text-5xl md:text-6xl'
          : 'text-bone/70 text-2xl sm:text-4xl md:text-5xl'
      }`}
    >
      {children}
    </motion.p>
  );
}
