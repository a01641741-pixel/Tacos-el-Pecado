import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/cartContext';
import { useToast } from '@/components/ui/use-toast';

const FALLBACK = [
  {
    name: 'Asada',
    description: 'Bistec de res asado a las brasas con cebolla, cilantro y limón.',
    price: 45,
    image_url: 'https://media.base44.com/images/public/6a59c835542617752331b47a/a9c50c285_generated_6fc530cf.png',
    is_signature: true,
  },
  {
    name: 'Gaonera de Ribeye',
    description: 'Ribeye cortado fino, fundido con queso Oaxaca en tortilla de harina.',
    price: 70,
    image_url: 'https://media.base44.com/images/public/6a59c835542617752331b47a/97c2f39a1_generated_image.png',
    is_signature: true,
  },
  {
    name: 'Pastor',
    description: 'Cerdo marinado en achiote al trompo, con piña tatemada.',
    price: 40,
    image_url: 'https://media.base44.com/images/public/6a59c835542617752331b47a/8ad965e41_generated_96eca548.png',
    is_signature: true,
  },
];

export default function MenuPreview({ items }) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [hovered, setHovered] = useState(null);
  const display = items && items.length > 0 ? items.slice(0, 3) : FALLBACK;

  const handleAdd = (item) => {
    addItem({ name: item.name, price: item.price });
    toast({ title: 'Añadido a la canasta', description: item.name });
  };

  return (
    <section className="relative py-28 sm:py-36 grain">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-gold text-xs font-mono tracking-widest uppercase">El Códex de Sabor</span>
            <h2 className="font-display font-black text-bone text-5xl sm:text-6xl mt-3 tracking-tight">
              Los <span className="text-ember italic">pecados</span> capitales
            </h2>
          </div>
          <Link to="/menu" className="group inline-flex items-center gap-2 text-bone/60 hover:text-ember transition-colors font-medium">
            Ver todos los tacos
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {display.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              onMouseEnter={() => setHovered(item.name)}
              onMouseLeave={() => setHovered(null)}
              className="group relative bg-card rounded-2xl overflow-hidden border border-white/5 hover:border-ember/40 transition-all duration-500"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    hovered === item.name ? 'scale-110 brightness-125' : 'scale-100 brightness-75'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
                {item.is_signature && (
                  <span className="absolute top-4 left-4 bg-ember text-obsidian text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    La obra maestra
                  </span>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display font-black text-bone text-2xl tracking-tight">{item.name}</h3>
                  <p className="text-bone/50 text-sm mt-2 leading-relaxed line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-display font-black text-ember text-2xl">${item.price}</span>
                    <button
                      onClick={() => handleAdd(item)}
                      aria-label={`Añadir ${item.name} a tu pedido`}
                      className="w-11 h-11 rounded-full bg-ember hover:bg-bone text-obsidian flex items-center justify-center transition-all focus-ember group-hover:scale-110"
                    >
                      <Plus size={20} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
