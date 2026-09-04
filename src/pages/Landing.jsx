import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, MapPin } from 'lucide-react';
import { SITE_IMAGES } from '@/lib/siteContent';

export default function Landing() {
  return (
    <div className="bg-obsidian text-bone">
      <section className="relative min-h-[100svh] overflow-hidden flex items-end">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={SITE_IMAGES.heroBg}
            alt="Tacos El Pecado preparados al fuego"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/65 to-obsidian/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/35" />
        </motion.div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 pb-20 sm:pb-24 pt-36">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="max-w-3xl"
          >
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.32em] text-gold mb-5">
              Cocina nocturna · fuego · Guadalajara
            </p>
            <h1 className="font-heading uppercase text-[clamp(3.8rem,11vw,8.8rem)] leading-[0.82] tracking-[-0.035em] text-bone">
              El pecado
              <span className="block text-ember">se sirve aquí.</span>
            </h1>
            <p className="mt-7 text-base sm:text-xl text-bone/68 max-w-xl leading-relaxed">
              Tacos al fuego, sabor sin pretensiones y una noche que empieza con el primer bocado.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3 sm:items-center">
              <Link
                to="/menu"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-ember px-7 py-4 text-sm font-bold uppercase tracking-[0.13em] text-white transition-all hover:bg-bone hover:text-obsidian focus-ember"
              >
                Ver el menú
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/pedido"
                className="inline-flex items-center justify-center rounded-full border border-white/25 bg-black/10 px-7 py-4 text-sm font-semibold uppercase tracking-[0.13em] text-bone backdrop-blur-sm transition-colors hover:border-white/60 hover:bg-white/10 focus-ember"
              >
                Ordenar ahora
              </Link>
            </div>
          </motion.div>

          <a
            href="#elige"
            className="absolute bottom-7 right-5 sm:right-8 hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-bone/45 hover:text-bone transition-colors"
          >
            Descubre
            <ChevronDown size={15} />
          </a>
        </div>
      </section>

      <section id="elige" className="px-5 sm:px-8 py-20 sm:py-28 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold">A tu manera</p>
              <h2 className="font-heading uppercase text-4xl sm:text-6xl leading-[0.95] mt-4">
                Elige cómo<br />vivirlo.
              </h2>
            </div>

            <div className="divide-y divide-white/10 border-y border-white/10">
              <Link to="/ordenar?channel=comer_en_lugar" className="group flex items-center justify-between py-6">
                <div>
                  <p className="text-xl sm:text-2xl font-semibold">Comer aquí</p>
                  <p className="text-sm text-bone/45 mt-1">Lo preparamos para cuando llegues.</p>
                </div>
                <ArrowRight className="text-ember transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/ordenar?channel=para_llevar" className="group flex items-center justify-between py-6">
                <div>
                  <p className="text-xl sm:text-2xl font-semibold">Para llevar</p>
                  <p className="text-sm text-bone/45 mt-1">Pide ahora y pasa por tu orden.</p>
                </div>
                <ArrowRight className="text-ember transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=20.6677408,-103.4272548"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between py-6"
              >
                <div>
                  <p className="text-xl sm:text-2xl font-semibold">Visítanos</p>
                  <p className="text-sm text-bone/45 mt-1">C. Velázquez 445, La Estancia, Zapopan.</p>
                </div>
                <MapPin className="text-ember transition-transform group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
