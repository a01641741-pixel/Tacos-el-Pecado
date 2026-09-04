import React from 'react';
import { Flame, Leaf, Clock, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const KITCHEN_IMG = 'https://media.base44.com/images/public/6a59c835542617752331b47a/b8932c5de_generated_3b2641d3.png';

const PILLARS = [
  { icon: Flame, title: 'Al Carbón', desc: 'Cada taco pasa por las brasas. El humo es sello de origen, no decoración.' },
  { icon: Leaf, title: 'Ingredientes Vivos', desc: 'Salsas molcadas a mano en metate, tortillas recién hechas, hierbas del día.' },
  { icon: Clock, title: 'Tiempos Lentos', desc: 'Marinados de 24 horas, carnitas confitadas toda la noche. La prisa arruina el ritual.' },
  { icon: Award, title: 'Receta Confesada', desc: 'Herencia de tres generaciones sobre el trompo. El secreto está en no tener miedo al sabor.' },
];

export default function Experience() {
  return (
    <section className="relative py-28 sm:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden ember-glow">
              <img src={KITCHEN_IMG} alt="Brasas y trompo de pastor en la oscuridad" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-obsidian border border-ember/30 rounded-2xl p-6 hidden sm:block">
              <div className="font-display font-black text-ember text-5xl">3°</div>
              <div className="text-bone/50 text-xs font-mono uppercase tracking-wider mt-1">Generación</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gold text-xs font-mono tracking-widest uppercase">El Ritual</span>
            <h2 className="font-display font-black text-bone text-5xl sm:text-6xl mt-3 tracking-tight leading-[0.95]">
              No es comida.
              <br />
              Es <span className="text-ember italic">tentación</span>.
            </h2>
            <p className="text-bone/50 text-lg mt-6 leading-relaxed">
              En Tacos El Pecado tratamos cada ingrediente como artefacto sagrado y cada pedido
              como una confesión de sabor. Olvídate de la prisa del fast food: aquí el carbón
              marca el ritmo.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mt-10">
              {PILLARS.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="border-l-2 border-ember/30 pl-5"
                >
                  <p.icon size={22} className="text-ember mb-3" />
                  <h4 className="font-display font-bold text-bone text-lg">{p.title}</h4>
                  <p className="text-bone/40 text-sm mt-1.5 leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
