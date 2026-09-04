import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Flame, Leaf, Clock, Award } from 'lucide-react';
import { SITE_CONTENT, SITE_IMAGES } from '@/lib/siteContent';
import { ScrollReveal, Eyebrow } from '@/components/scene/ScrollReveal';

const ICONS = { flame: Flame, leaf: Leaf, clock: Clock, award: Award };

export default function RitualSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  const { ritual } = SITE_CONTENT;

  return (
    <section ref={ref} className="relative py-16 sm:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 lg:gap-24 items-center">
          <div className="relative">
            <div className="relative aspect-[4/3] sm:aspect-[4/5] rounded-3xl overflow-hidden ember-glow">
              <motion.img
                src={SITE_IMAGES.ritualKitchen}
                alt="Brasas y trompo de pastor en la oscuridad"
                className="w-full h-full object-cover"
                style={{ y: imgY, scale: imgScale }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent" />
            </div>
          </div>

          <div>
            <Eyebrow>{ritual.eyebrow}</Eyebrow>
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-black text-bone text-4xl sm:text-6xl mt-4 tracking-tight leading-[0.95]"
            >
              {ritual.title}
              <br />
              <span className="text-ember italic">{ritual.titleAccent}</span>
            </motion.h2>
            <ScrollReveal delay={0.2}>
              <p className="text-bone/50 text-lg mt-6 leading-relaxed">{ritual.description}</p>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 gap-6 mt-10">
              {ritual.pillars.map((p, i) => {
                const Icon = ICONS[p.icon] || Flame;
                return (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="group/pillar border-l-2 border-ember/30 pl-5 hover:border-ember transition-colors cursor-default"
                  >
                    <Icon size={22} className="text-ember mb-3" />
                    <h4 className="font-display font-bold text-bone text-lg">{p.title}</h4>
                    <p className="text-bone/40 text-sm mt-1.5 leading-relaxed max-h-0 opacity-0 group-hover/pillar:max-h-20 group-hover/pillar:opacity-100 overflow-hidden transition-all duration-300">{p.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
