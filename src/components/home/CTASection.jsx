import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const HERO_IMG = 'https://media.base44.com/images/public/6a59c835542617752331b47a/12ec593cd_generated_1c34ba63.png';

export default function CTASection() {
  return (
    <section className="relative py-28 sm:py-36 overflow-hidden grain">
      <div className="absolute inset-0">
        <img src={HERO_IMG} alt="" className="w-full h-full object-cover opacity-25 scale-110" />
        <div className="absolute inset-0 bg-obsidian/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-obsidian" />
      </div>

      <div className="relative max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Flame size={40} className="text-ember mx-auto mb-6 ember-pulse" />
          <h2 className="font-display font-black text-bone text-5xl sm:text-7xl tracking-tight leading-[0.95]">
            El carbón está
            <br />
            <span className="text-ember ember-text-glow italic">encendido</span>
          </h2>
          <p className="text-bone/60 text-lg sm:text-xl mt-8 max-w-xl mx-auto leading-relaxed">
            Tu antojo no espera. Pide ahora y recibe el ritual del sabor en tu puerta
            en menos de 30 minutos.
          </p>
          <Link
            to="/pedido"
            className="group inline-flex items-center justify-center gap-3 bg-ember hover:bg-bone text-obsidian font-bold text-lg px-10 py-5 rounded-full transition-all ember-pulse mt-10 focus-ember"
          >
            Cometer el Pecado
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
