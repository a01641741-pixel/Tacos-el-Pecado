import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, MapPin, Phone, Clock } from 'lucide-react';
import ComingSoonBanner from '@/components/ComingSoonBanner';
import { SITE_CONTENT } from '@/lib/siteContent';

export default function Footer() {
  const [showComingSoon, setShowComingSoon] = useState(false);
  return (
    <footer className="bg-obsidian border-t border-white/5 grain">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <img
              src="https://media.base44.com/images/public/6a59c835542617752331b47a/5ac8d1df0_image.png"
              alt="Tacos El Pecado"
              className="h-16 w-auto rounded-lg mb-5"
            />
            <p className="text-bone/50 text-sm leading-relaxed max-w-md">
              El ritual del sabor nocturno. Tacos artesanales a la brasa, confesión de sabor
              entregada directamente en tu puerta. Cada taco, una tentación merecida.
            </p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowComingSoon(true)} aria-label="Instagram" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-bone/60 hover:text-ember hover:border-ember transition-colors focus-ember">
                <Instagram size={18} />
              </button>
              <button onClick={() => setShowComingSoon(true)} aria-label="Facebook" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-bone/60 hover:text-ember hover:border-ember transition-colors focus-ember">
                <Facebook size={18} />
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-gold text-sm uppercase tracking-widest mb-5">Navegación</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="text-bone/60 hover:text-ember transition-colors">Inicio</Link></li>
              <li><Link to="/menu" className="text-bone/60 hover:text-ember transition-colors">El Códex de Sabor</Link></li>
              <li><Link to="/pedido" className="text-bone/60 hover:text-ember transition-colors">Pedido a Domicilio</Link></li>
              <li><Link to="/panel" className="text-bone/60 hover:text-ember transition-colors">El Confesionario</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-gold text-sm uppercase tracking-widest mb-5">Contacto</h4>
            <ul className="space-y-4 text-sm text-bone/60">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-ember mt-0.5 shrink-0" />
                <a href="https://www.google.com/maps/dir/?api=1&destination=20.6677408,-103.4272548" target="_blank" rel="noopener noreferrer" className="hover:text-ember transition-colors leading-relaxed">
                  C. Velázquez 445, La Estancia<br />45030 Zapopan, Jal.
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-ember shrink-0" />
                <a href={`tel:+521${SITE_CONTENT.location.phone.replace(/\s/g, '')}`} className="hover:text-ember transition-colors">{SITE_CONTENT.location.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={16} className="text-ember shrink-0" />
                <span>Jue a Dom · 6pm – 3am</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-bone/30 text-xs font-mono tracking-wide">
            © {new Date().getFullYear()} Tacos El Pecado · Confiesa tu antojo
          </p>
          <p className="text-bone/30 text-xs font-mono tracking-wide">
            Diseñado en las sombras · Hecho con brasa
          </p>
        </div>
      </div>
      <ComingSoonBanner open={showComingSoon} onClose={() => setShowComingSoon(false)} />
    </footer>
  );
}
