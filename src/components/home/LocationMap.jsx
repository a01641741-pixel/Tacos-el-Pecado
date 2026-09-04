import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';

const ADDRESS = 'C. Velázquez 445, La Estancia, 45030 Zapopan, Jal.';
const LAT = 20.6677408;
const LNG = -103.4272548;
const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}`;
const EMBED_URL = `https://maps.google.com/maps?q=${LAT},${LNG}&z=16&output=embed`;

export default function LocationMap() {
  return (
    <section className="relative py-28 sm:py-36 grain">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-gold text-xs font-mono tracking-widest uppercase">El Santuario</span>
          <h2 className="font-display font-black text-bone text-5xl sm:text-6xl mt-3 tracking-tight">
            Encuéntranos en <span className="text-ember italic">Zapopan</span>
          </h2>
          <p className="text-bone/50 text-lg mt-4 max-w-xl mx-auto">{ADDRESS}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden border border-ember/20 ember-glow"
        >
          <div className="aspect-[16/9] sm:aspect-[21/9] w-full bg-card">
            <iframe
              src={EMBED_URL}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Tacos El Pecado en Zapopan"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-obsidian via-obsidian/80 to-transparent p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-ember/20 flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-ember" />
                </div>
                <div>
                  <p className="text-bone font-semibold">Tacos El Pecado</p>
                  <p className="text-bone/50 text-sm">{ADDRESS}</p>
                </div>
              </div>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-ember hover:bg-ember-dark text-obsidian font-bold px-6 py-3 rounded-full transition-all ember-glow shrink-0"
              >
                <Navigation size={18} /> Cómo llegar
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
