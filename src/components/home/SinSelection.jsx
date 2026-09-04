import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { useToast } from '@/components/ui/use-toast';
import { SITE_CONTENT } from '@/lib/siteContent';
import { ScrollReveal, Eyebrow } from '@/components/scene/ScrollReveal';
import TiltCard from '@/components/scene/TiltCard';
import { Image } from '@/components/ui/image';

const FALLBACK = [
  { name: 'Asada', description: 'Bistec de res asado a las brasas con cebolla, cilantro y limón.', price: 45, image_url: 'https://media.base44.com/images/public/6a59c835542617752331b47a/a9c50c285_generated_6fc530cf.png', category: 'tacos' },
  { name: 'Gaonera de Ribeye', description: 'Ribeye cortado fino, fundido con queso Oaxaca en tortilla de harina.', price: 70, image_url: 'https://media.base44.com/images/public/6a59c835542617752331b47a/97c2f39a1_generated_image.png', category: 'especiales' },
  { name: 'Pastor', description: 'Cerdo marinado en achiote al trompo, con piña tatemada.', price: 40, image_url: 'https://media.base44.com/images/public/6a59c835542617752331b47a/8ad965e41_generated_96eca548.png', category: 'tacos' },
];

export default function SinSelection({ items }) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [hovered, setHovered] = useState(null);

  const { sins } = SITE_CONTENT;
  const available = items && items.length > 0 ? items.filter((i) => i.is_available !== false) : [];
  const display = available.length > 0 ? available.slice(0, 6) : FALLBACK;

  const handleAdd = (item) => {
    addItem({ id: item.id, name: item.name, price: item.price, image_url: item.image_url });
    toast({ title: 'Añadido a la canasta', description: item.name });
  };

  return (
    <section className="relative py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <Eyebrow>{sins.eyebrow}</Eyebrow>
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-black text-bone text-4xl sm:text-6xl md:text-7xl mt-4 tracking-tight leading-[0.95]"
            >
              {sins.title}{' '}
              <span className="text-ember italic">{sins.titleAccent}</span>
            </motion.h2>
          </div>
          <ScrollReveal delay={0.2}>
            <p className="text-bone/50 text-lg max-w-sm">{sins.subtitle}</p>
            <Link to="/menu" className="group inline-flex items-center gap-2 text-ember hover:text-gold transition-colors font-medium mt-4">
              Ver todos los pecados
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </ScrollReveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {display.map((item, i) => {
            const sinName = sins.sinNames[item.category] || 'La Tentación';
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setHovered(item.name)}
                onMouseLeave={() => setHovered(null)}
              >
                <TiltCard className="group relative bg-card rounded-3xl overflow-hidden border border-white/5 hover:border-ember/40 transition-all duration-500">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    className={`block w-full h-full transition-all duration-700 ${
                      hovered === item.name ? 'scale-110 brightness-110' : 'scale-100 brightness-90 sm:brightness-60'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 bg-obsidian/80 backdrop-blur-sm border border-ember/30 text-ember text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                      {sinName}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display font-black text-bone text-2xl tracking-tight">{item.name}</h3>
                    {item.description && (
                      <p className="text-bone/50 text-sm mt-2 leading-relaxed line-clamp-2 max-h-0 opacity-0 group-hover:max-h-16 group-hover:opacity-100 overflow-hidden transition-all duration-300">{item.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-5">
                      <span className="font-display font-black text-ember text-2xl">${item.price}</span>
                      <button
                        onClick={() => handleAdd(item)}
                        aria-label={`Añadir ${item.name} a tu pedido`}
                        className="w-11 h-11 rounded-full bg-ember hover:bg-bone text-obsidian flex items-center justify-center transition-all group-hover:scale-110 active:scale-95"
                      >
                        <Plus size={20} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
