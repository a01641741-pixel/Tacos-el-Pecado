import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Navigation, MessageCircle } from 'lucide-react';
import { SITE_CONTENT } from '@/lib/siteContent';
import { Eyebrow } from '@/components/scene/ScrollReveal';

export default function LocationSection() {
  const { location, brand } = SITE_CONTENT;
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.coords.lat},${location.coords.lng}`;
  const embedUrl = `https://maps.google.com/maps?q=${location.coords.lat},${location.coords.lng}&z=16&output=embed`;
  const whatsappUrl = `https://wa.me/521${location.phone.replace(/\s/g, '')}?text=Hola%20Tacos%20El%20Pecado,%20quiero%20hacer%20un%20pedido`;
  const telUrl = `tel:+521${location.phone.replace(/\s/g, '')}`;

  return (
    <section className="relative py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-8">
          <Eyebrow className="justify-center mb-3">{location.eyebrow}</Eyebrow>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-black text-bone text-4xl sm:text-6xl md:text-7xl tracking-tight"
          >
            {location.title}
            <br />
            <span className="text-ember italic">{location.titleAccent}</span>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 relative rounded-3xl overflow-hidden border border-ember/20 ember-glow"
          >
            <div className="aspect-[16/10] sm:aspect-[16/9] w-full bg-card">
              <iframe
                src={embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(0.3) brightness(0.9) contrast(1.05)' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Tacos El Pecado"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="bg-card border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between"
          >
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-ember/20 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-ember" />
                </div>
                <div>
                  <p className="text-bone font-semibold">{brand.name}</p>
                  <p className="text-bone/50 text-sm leading-relaxed">{location.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-ember shrink-0" />
                <a href={telUrl} className="text-bone/60 hover:text-ember transition-colors text-sm">{location.phone}</a>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-ember shrink-0" />
                <span className="text-bone/60 text-sm">{location.hours}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-8">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-ember hover:bg-ember-dark text-obsidian font-bold px-5 py-3 rounded-full transition-all ember-glow"
              >
                <Navigation size={18} /> {location.ctaDirections}
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-card border border-ember/30 hover:border-ember hover:bg-ember/10 text-bone hover:text-ember font-bold px-5 py-3 rounded-full transition-all"
              >
                <MessageCircle size={18} /> {location.ctaWhatsApp}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
