import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SITE_CONTENT } from '@/lib/siteContent';
import { Eyebrow } from '@/components/scene/ScrollReveal';
import { Image } from '@/components/ui/image';

const SPAN_CLASS = {
  wide: 'sm:col-span-2',
  tall: 'sm:row-span-2',
  normal: '',
};

export default function GallerySection() {
  const [lightbox, setLightbox] = useState(null);
  const { gallery } = SITE_CONTENT;

  const next = () => setLightbox(p => (p + 1) % gallery.images.length);
  const prev = () => setLightbox(p => (p - 1 + gallery.images.length) % gallery.images.length);

  return (
    <section className="relative py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-12">
        <Eyebrow>{gallery.eyebrow}</Eyebrow>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-black text-bone text-4xl sm:text-6xl md:text-7xl mt-4 tracking-tight"
        >
          {gallery.title}
          <br />
          <span className="text-ember italic">{gallery.titleAccent}</span>
        </motion.h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-7xl mx-auto px-5 sm:px-8 auto-rows-[140px] sm:auto-rows-[200px]">
        {gallery.images.map((img, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            onClick={() => setLightbox(i)}
            className={`group relative overflow-hidden rounded-2xl h-full ${SPAN_CLASS[img.span] || ''}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover brightness-90 sm:brightness-60 group-hover:brightness-100 group-hover:scale-110 transition-all duration-700"
              fittingType="fill"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-obsidian/95 backdrop-blur-md flex items-center justify-center p-5"
            onClick={() => setLightbox(null)}
          >
            <button onClick={() => setLightbox(null)} className="absolute top-5 right-5 text-bone/60 hover:text-ember transition-colors z-10 p-2">
              <X size={28} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-3 sm:left-5 text-bone/60 hover:text-ember transition-colors z-10 p-2">
              <ChevronLeft size={32} />
            </button>
            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={gallery.images[lightbox].src.replace('w=600', 'w=1200').replace('w=900', 'w=1200')}
              alt={gallery.images[lightbox].alt}
              className="max-w-full max-h-[80vh] sm:max-h-[85vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-3 sm:right-5 text-bone/60 hover:text-ember transition-colors z-10 p-2">
              <ChevronRight size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
