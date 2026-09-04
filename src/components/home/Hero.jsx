import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const HERO_IMG = 'https://media.base44.com/images/public/6a59c835542617752331b47a/12ec593cd_generated_1c34ba63.png';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden grain">
      <div className="absolute inset-0">
        <img
          src={HERO_IMG}
          alt="Taco al pastor macro cinematográfico"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-32 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 border border-ember/30 bg-ember/10 rounded-full px-4 py-1.5 mb-8">
            <Flame size={14} className="text-ember" />
            <span className="text-ember text-xs font-mono tracking-widest uppercase">A la brasa · Desde el carbón</span>
          </div>

          <h1 className="font-display font-black text-bone leading-[0.95] tracking-tight text-6xl sm:text-7xl md:text-8xl">
            Confiesa
            <br />
            tu <span className="text-ember ember-text-glow italic">antojo</span>
          </h1>

          <p className="text-bone/60 text-lg sm:text-xl mt-8 max-w-lg leading-relaxed">
            Tacos artesanales a la brasa, donde el carbón confiesa cada sabor.
            El ritual nocturno entregado en tu puerta.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Link
              to="/pedido"
              className="group inline-flex items-center justify-center gap-3 bg-ember hover:bg-ember-dark text-obsidian font-bold text-base px-8 py-4 rounded-full transition-all ember-pulse focus-ember"
            >
              Cometer el Pecado
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
            </Link>
            <Link
              to="/menu"
              className="inline-flex items-center justify-center gap-3 border border-bone/20 hover:border-ember hover:text-ember text-bone font-semibold text-base px-8 py-4 rounded-full transition-all focus-ember"
            >
              Ver el Códex
            </Link>
          </div>

          <div className="flex items-center gap-8 mt-14">
            <div>
              <div className="font-display font-black text-bone text-3xl">12+</div>
              <div className="text-bone/40 text-xs font-mono uppercase tracking-wider mt-1">Guisos</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div>
              <div className="font-display font-black text-bone text-3xl">30'</div>
              <div className="text-bone/40 text-xs font-mono uppercase tracking-wider mt-1">Entrega</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div>
              <div className="font-display font-black text-ember text-3xl">100%</div>
              <div className="text-bone/40 text-xs font-mono uppercase tracking-wider mt-1">Al carbón</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2">
        <span className="text-bone/30 text-[10px] font-mono tracking-widest uppercase">Desliza</span>
        <div className="w-px h-10 bg-gradient-to-b from-ember to-transparent" />
      </div>
    </section>
  );
}
