import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame } from 'lucide-react';

export default function ComingSoonBanner({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-obsidian/90 backdrop-blur-md flex items-center justify-center p-5"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-sm w-full rounded-3xl overflow-hidden border border-ember/30 ember-glow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80"
                alt="Carne a la brasa"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
              <Flame className="text-ember mx-auto mb-3" size={28} />
              <h3 className="font-display font-black text-bone text-3xl tracking-tight">
                Espéranos <span className="text-ember italic">pronto</span>
              </h3>
              <p className="text-bone/60 text-sm mt-2">
                Estamos encendiendo las brasas de nuestras redes sociales.
              </p>
              <button
                onClick={onClose}
                className="mt-5 inline-flex items-center gap-2 bg-ember hover:bg-ember-dark text-obsidian font-bold px-6 py-2.5 rounded-full transition-all"
              >
                Cerrar
              </button>
            </div>
            <button onClick={onClose} className="absolute top-3 right-3 text-bone/60 hover:text-ember transition-colors p-2 z-10">
              <X size={22} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
