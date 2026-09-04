import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowLeft, Flame, ShoppingBag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useCart } from '@/lib/cartContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';

const SPICE_LABELS = {
  suave: { label: 'Suave', color: 'text-green-400' },
  medio: { label: 'Medio', color: 'text-gold' },
  intenso: { label: 'Intenso', color: 'text-orange-400' },
  infierno: { label: 'Infierno', color: 'text-red-500' },
};

const FALLBACK = [
  { name: 'Asada', description: 'Bistec de res asado a las brasas con cebolla, cilantro y limón.', price: 45, category: 'tacos', image_url: 'https://media.base44.com/images/public/6a59c835542617752331b47a/a9c50c285_generated_6fc530cf.png', ingredients: ['Bistec de res','Cebolla','Cilantro','Limón','Salsa de árbol'], spice_level: 'intenso', is_signature: true, order_index: 1 },
  { name: 'Gaonera de Ribeye', description: 'Ribeye cortado fino, fundido con queso Oaxaca en tortilla de harina.', price: 70, category: 'tacos', image_url: 'https://media.base44.com/images/public/6a59c835542617752331b47a/97c2f39a1_generated_image.png', ingredients: ['Ribeye','Queso Oaxaca','Tortilla de harina'], spice_level: 'suave', is_signature: true, order_index: 2 },
  { name: 'Pastor', description: 'Cerdo marinado en achiote al trompo, con piña tatemada.', price: 40, category: 'tacos', image_url: 'https://media.base44.com/images/public/6a59c835542617752331b47a/8ad965e41_generated_96eca548.png', ingredients: ['Cerdo marinado','Piña tatemada','Cebolla','Cilantro','Salsa de árbol'], spice_level: 'medio', is_signature: true, order_index: 3 },
  { name: 'Trompo de Sirloin', description: 'Sirloin marinado al trompo con cebolla, cilantro y salsas de la casa.', price: 50, category: 'tacos', image_url: 'https://media.base44.com/images/public/6a59c835542617752331b47a/f6d1416bc_generated_28955fbc.png', ingredients: ['Sirloin marinado','Cebolla','Cilantro','Salsas de la casa'], spice_level: 'medio', order_index: 4 },
  { name: 'Gringa', description: 'Tu taco favorito en tortilla de harina, fundido con queso Oaxaca. Pídelo con cualquier carne.', price: 65, category: 'especiales', image_url: 'https://media.base44.com/images/public/6a59c835542617752331b47a/97c2f39a1_generated_image.png', ingredients: ['Carne al gusto','Queso Oaxaca','Tortilla de harina'], spice_level: 'medio', is_signature: true, order_index: 5 },
  { name: 'Coca Cola', description: 'Refresco Coca Cola 600ml, bien frío.', price: 25, category: 'bebidas', image_url: 'https://media.base44.com/images/public/6a59c835542617752331b47a/f697f9502_generated_image.png', ingredients: ['600ml'], spice_level: 'suave', order_index: 6 },
  { name: 'Sprite', description: 'Refresco de limón 600ml.', price: 25, category: 'bebidas', image_url: 'https://media.base44.com/images/public/6a59c835542617752331b47a/f697f9502_generated_image.png', ingredients: ['600ml'], spice_level: 'suave', order_index: 7 },
  { name: 'Fanta', description: 'Refresco de naranja 600ml.', price: 25, category: 'bebidas', image_url: 'https://media.base44.com/images/public/6a59c835542617752331b47a/f697f9502_generated_image.png', ingredients: ['600ml'], spice_level: 'suave', order_index: 8 },
  { name: 'Tortilla de Maíz', description: 'Tortilla extra de maíz artesanal.', price: 5, category: 'complementos', image_url: 'https://media.base44.com/images/public/6a59c835542617752331b47a/673292130_generated_image.png', ingredients: ['Maíz'], spice_level: 'suave', order_index: 9 },
  { name: 'Tortilla de Harina', description: 'Tortilla extra de harina de trigo.', price: 8, category: 'complementos', image_url: 'https://media.base44.com/images/public/6a59c835542617752331b47a/673292130_generated_image.png', ingredients: ['Harina de trigo'], spice_level: 'suave', order_index: 10 },
];

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('todos');
  const { addItem, count, subtotal } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    base44.entities.MenuItem.list('order_index', 50)
      .then((data) => { setItems(data && data.length ? data : FALLBACK); })
      .catch(() => setItems(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = (item) => {
    addItem({ name: item.name, price: item.price, image_url: item.image_url });
    toast({ title: 'Añadido a la canasta', description: item.name });
  };

  const categories = ['todos', 'tacos', 'especiales', 'bebidas', 'complementos'];
  const filtered = filter === 'todos' ? items : items.filter((i) => i.category === filter);

  return (
    <div className="pt-28 pb-20 min-h-screen grain">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-bone/50 hover:text-ember transition-colors text-sm mb-8">
          <ArrowLeft size={16} /> Volver al inicio
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-gold text-xs font-mono tracking-widest uppercase">El Códex de Sabor</span>
            <h1 className="font-display font-black text-bone text-4xl sm:text-6xl mt-3 tracking-tight">El <span className="text-ember italic">Menú</span></h1>
            <p className="text-bone/50 text-lg mt-4 max-w-lg">Cada taco, un capítulo. Cada bocado, una confesión.</p>
          </div>
          <Link to="/pedido">
            <Button className="bg-ember hover:bg-ember-dark text-obsidian font-bold rounded-full px-6 ember-glow">
              <ShoppingBag size={18} className="mr-2" />
              Canasta ({count}) · ${subtotal}
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all focus-ember ${
                filter === c ? 'bg-ember text-obsidian' : 'bg-card text-bone/60 hover:text-ember border border-white/5'
              }`}
            >
              {c === 'todos' ? 'Todos' : c}
            </button>
          ))}
        </div>

        <div className="bg-ember/5 border border-ember/20 rounded-2xl p-5 mb-10 flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-ember/20 flex items-center justify-center shrink-0">
            <Flame size={20} className="text-ember" />
          </div>
          <div>
            <p className="text-bone font-semibold text-sm">Elige tu tortilla: maíz o harina</p>
            <p className="text-bone/50 text-sm">Pídelo en gringa con queso Oaxaca fundido · Disponible con cualquier carne</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <Flame size={32} className="text-ember mx-auto mb-4 ember-pulse" />
              <p className="text-bone/40 font-mono text-sm tracking-widest uppercase flicker-neon">Preparando tu pecado</p>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
              <motion.div
                key={item.name + i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group relative bg-card rounded-2xl overflow-hidden border border-white/5 hover:border-ember/40 transition-all cursor-pointer"
                onClick={() => setSelected(item)}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={item.image_url} alt={item.name} className="block w-full h-full transition-all duration-700 group-hover:scale-110 group-hover:brightness-125" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                  {item.is_signature && (
                    <span className="absolute top-3 left-3 bg-ember text-obsidian text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">Obra Maestra</span>
                  )}
                  {item.spice_level && SPICE_LABELS[item.spice_level] && (
                    <span className={`absolute top-3 right-3 bg-obsidian/80 backdrop-blur ${SPICE_LABELS[item.spice_level].color} text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1`}>
                      <Flame size={10} /> {SPICE_LABELS[item.spice_level].label}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display font-black text-bone text-xl tracking-tight">{item.name}</h3>
                    <span className="font-display font-black text-ember text-2xl shrink-0">${item.price}</span>
                  </div>
                  <p className="text-bone/50 text-sm mt-2 leading-relaxed line-clamp-2">{item.description}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAdd(item); }}
                    aria-label={`Añadir ${item.name} a tu pedido`}
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-ember/10 hover:bg-ember text-ember hover:text-obsidian font-semibold text-sm py-3 rounded-xl transition-all focus-ember"
                  >
                    <Plus size={18} strokeWidth={2.5} /> Añadir a la canasta
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-obsidian/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-ember/30 rounded-2xl max-w-3xl w-full overflow-hidden grid md:grid-cols-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-square md:aspect-auto">
                <Image src={selected.image_url} alt={selected.name} className="block w-full h-full" />
              </div>
              <div className="p-8 flex flex-col">
                <button onClick={() => setSelected(null)} className="self-end text-bone/40 hover:text-ember mb-2"><X size={22} /></button>
                {selected.is_signature && <span className="text-ember text-xs font-mono uppercase tracking-widest mb-2">Obra Maestra</span>}
                <h2 className="font-display font-black text-bone text-4xl tracking-tight">{selected.name}</h2>
                <span className="font-display font-black text-ember text-3xl mt-2">${selected.price}</span>
                <p className="text-bone/60 text-base mt-4 leading-relaxed">{selected.description}</p>
                {selected.ingredients && (
                  <div className="mt-6">
                    <h4 className="text-gold text-xs font-mono uppercase tracking-widest mb-3">Blueprint de Ingredientes</h4>
                    <div className="flex flex-wrap gap-2">
                      {selected.ingredients.map((ing) => (
                        <span key={ing} className="bg-white/5 border border-white/10 text-bone/70 text-xs px-3 py-1.5 rounded-full">{ing}</span>
                      ))}
                    </div>
                  </div>
                )}
                <button
                  onClick={() => { handleAdd(selected); setSelected(null); }}
                  className="mt-auto w-full flex items-center justify-center gap-2 bg-ember hover:bg-bone text-obsidian font-bold py-4 rounded-full transition-all ember-glow"
                >
                  <Plus size={20} strokeWidth={2.5} /> Añadir a la canasta
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
