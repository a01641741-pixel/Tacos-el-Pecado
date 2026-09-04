import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, CreditCard, Clock, MapPin, Phone, ShoppingBag, Crown, CupSoda, Cookie } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { SITE_CONTENT } from '@/lib/siteContent';

const FALLBACK = [
  { name: 'Asada', price: 45, category: 'tacos', image_url: 'https://media.base44.com/images/public/6a59c835542617752331b47a/a9c50c285_generated_6fc530cf.png' },
  { name: 'Gaonera de Ribeye', price: 70, category: 'tacos', image_url: 'https://media.base44.com/images/public/6a59c835542617752331b47a/97c2f39a1_generated_image.png' },
  { name: 'Pastor', price: 40, category: 'tacos', image_url: 'https://media.base44.com/images/public/6a59c835542617752331b47a/8ad965e41_generated_96eca548.png' },
  { name: 'Trompo de Sirloin', price: 50, category: 'tacos', image_url: 'https://media.base44.com/images/public/6a59c835542617752331b47a/f6d1416bc_generated_28955fbc.png' },
  { name: 'Gringa', price: 65, category: 'especiales', image_url: 'https://media.base44.com/images/public/6a59c835542617752331b47a/97c2f39a1_generated_image.png' },
  { name: 'Coca Cola', price: 25, category: 'bebidas', image_url: 'https://media.base44.com/images/public/6a59c835542617752331b47a/f697f9502_generated_image.png' },
  { name: 'Sprite', price: 25, category: 'bebidas', image_url: 'https://media.base44.com/images/public/6a59c835542617752331b47a/f697f9502_generated_image.png' },
  { name: 'Fanta', price: 25, category: 'bebidas', image_url: 'https://media.base44.com/images/public/6a59c835542617752331b47a/f697f9502_generated_image.png' },
  { name: 'Tortilla de Maíz', price: 5, category: 'complementos', image_url: 'https://media.base44.com/images/public/6a59c835542617752331b47a/673292130_generated_image.png' },
  { name: 'Tortilla de Harina', price: 8, category: 'complementos', image_url: 'https://media.base44.com/images/public/6a59c835542617752331b47a/673292130_generated_image.png' },
];

const CATEGORY_LABELS = {
  tacos: 'Tacos',
  especiales: 'Especiales',
  bebidas: 'Bebidas',
  complementos: 'Complementos',
};

const CATEGORY_SIN = {
  tacos: 'La Tentación',
  especiales: 'El Pecado Original',
  bebidas: 'La Lujuria',
  complementos: 'La Avaricia',
};

const CATEGORY_MAP = {
  taco: 'tacos', tacos: 'tacos',
  especial: 'especiales', especiales: 'especiales',
  bebida: 'bebidas', bebidas: 'bebidas',
  complemento: 'complementos', complementos: 'complementos',
};

const CATEGORY_ICONS = {
  tacos: Flame,
  especiales: Crown,
  bebidas: CupSoda,
  complementos: Cookie,
};

export default function QuickMenuModal({ open, onClose }) {
  const [items, setItems] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    base44.entities.MenuItem.list('order_index', 50)
      .then((data) => { if (data && data.length) setItems(data.filter((i) => i.is_available !== false)); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const grouped = ['tacos', 'especiales', 'bebidas', 'complementos']
    .map((cat) => ({ cat, items: items.filter((i) => (CATEGORY_MAP[i.category] || i.category) === cat) }))
    .filter((g) => g.items.length > 0);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-obsidian/92 backdrop-blur-md flex items-start sm:items-center justify-center p-3 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-gradient-to-b from-obsidian to-[#1a1614] w-full max-w-2xl sm:rounded-3xl rounded-2xl border border-ember/20 shadow-2xl my-0 sm:my-8 max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-b from-obsidian to-obsidian/95 backdrop-blur-sm border-b border-white/5 px-6 py-5 flex items-center justify-between sm:rounded-t-3xl">
              <div className="flex items-center gap-3">
                <img
                  src="https://media.base44.com/images/public/6a59c835542617752331b47a/5ac8d1df0_image.png"
                  alt="Tacos El Pecado"
                  className="h-10 w-auto rounded-lg"
                />
                <div>
                  <h2 className="font-display text-bone text-2xl leading-none">Tacos El Pecado</h2>
                  <p className="text-gold text-[10px] font-mono tracking-widest uppercase mt-1">La Carta del Pecado</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-bone/40 hover:text-ember p-2 rounded-full hover:bg-white/5 transition-colors"
                aria-label="Cerrar"
              >
                <X size={22} />
              </button>
            </div>

            <div className="px-6 py-6 space-y-8">
              {/* Brand summary */}
              <div className="bg-ember/5 border border-ember/15 rounded-2xl p-5">
                <p className="text-bone/80 text-sm leading-relaxed">
                  <span className="text-ember font-semibold">Carne, fuego y cero arrepentimiento.</span>{' '}
                  Tacos al carbón con marinados de 24 horas, salsas molcadas a mano en metate y tortillas recién hechas.
                  Pídelos en tortilla de <span className="text-bone font-medium">maíz o harina</span>, o en gringa con queso Oaxaca fundido.
                </p>
              </div>

              {/* Menu sections */}
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Flame size={28} className="text-ember ember-pulse" />
                </div>
              ) : (
                <div className="space-y-6">
                  {grouped.map(({ cat, items: catItems }) => {
                    const Icon = CATEGORY_ICONS[cat] || Flame;
                    return (
                      <div key={cat}>
                        <div className="flex items-center gap-2.5 mb-3">
                          <span className="w-7 h-7 rounded-lg bg-ember/15 border border-ember/25 flex items-center justify-center shrink-0">
                            <Icon size={14} className="text-ember" />
                          </span>
                          <h3 className="font-display text-bone text-lg tracking-tight">{CATEGORY_LABELS[cat]}</h3>
                          <span className="text-gold/50 text-[9px] font-mono tracking-widest uppercase">{CATEGORY_SIN[cat]}</span>
                          <div className="flex-1 h-px bg-white/5" />
                        </div>
                        <div className="space-y-1.5">
                          {catItems.map((item) => (
                            <div key={item.name} className="flex items-center gap-2.5 py-1 rounded-lg hover:bg-white/5 px-1.5 -mx-1.5 transition-colors">
                              {item.image_url && (
                                <div className="w-8 h-8 rounded-md overflow-hidden shrink-0 border border-white/10">
                                  <img src={item.image_url} alt={item.name} className="block w-full h-full object-cover" />
                                </div>
                              )}
                              <span className="text-bone/90 text-sm font-medium flex-1">{item.name}</span>
                              <span className="text-ember font-display font-black text-base">${item.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Payment methods */}
              <div className="bg-card border border-white/5 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard size={16} className="text-gold" />
                  <h4 className="text-bone font-semibold text-sm">Métodos de pago</h4>
                </div>
                <p className="text-bone/60 text-sm mb-3">Aceptamos todas las tarjetas de crédito y débito.</p>
                <div className="flex flex-wrap gap-2">
                  {['Visa', 'Mastercard', 'Amex', 'Carné', 'Débito', 'Crédito'].map((card) => (
                    <span key={card} className="bg-white/5 border border-white/10 text-bone/70 text-xs px-3 py-1.5 rounded-full font-medium">
                      {card}
                    </span>
                  ))}
                </div>
              </div>

              {/* Info footer */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-2.5">
                  <Clock size={16} className="text-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="text-bone/90 text-xs font-semibold uppercase tracking-wide">Horario</p>
                    <p className="text-bone/50 text-sm">{SITE_CONTENT.location.hours}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="text-bone/90 text-xs font-semibold uppercase tracking-wide">Ubicación</p>
                    <p className="text-bone/50 text-sm">{SITE_CONTENT.location.address}</p>
                  </div>
                </div>
                <a href={`tel:+521${SITE_CONTENT.location.phone.replace(/\s/g, '')}`} className="flex items-start gap-2.5 hover:text-ember transition-colors">
                  <Phone size={16} className="text-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="text-bone/90 text-xs font-semibold uppercase tracking-wide">Teléfono</p>
                    <p className="text-bone/50 text-sm hover:text-ember transition-colors">{SITE_CONTENT.location.phone}</p>
                  </div>
                </a>
                <div className="flex items-start gap-2.5">
                  <Flame size={16} className="text-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="text-bone/90 text-xs font-semibold uppercase tracking-wide">Estilo</p>
                    <p className="text-bone/50 text-sm">Al carbón · 100% al carbón</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Link
                to="/pedido"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 bg-ember hover:bg-ember-dark text-obsidian font-bold py-4 rounded-full transition-all ember-glow"
              >
                <ShoppingBag size={20} strokeWidth={2.5} />
                Cometer el Pecado
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
