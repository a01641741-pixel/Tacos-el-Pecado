import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

const STATUS_CONFIG = {
  libre: { label: 'Libre', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  ocupada: { label: 'Ocupada', bg: 'bg-ember/5', border: 'border-ember/30', text: 'text-ember', dot: 'bg-ember' },
  esperando_pago: { label: 'Por pagar', bg: 'bg-amber-500/5', border: 'border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-400' },
};

export default function TableGrid({ tables, comandas, onSelect }) {
  const getComanda = (num) =>
    comandas.find((c) => c.table_number === num && c.status !== 'cerrada');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-black text-bone text-3xl">Mesas</h2>
          <p className="text-bone/50 text-sm mt-1">
            {tables.filter(t => t.status === 'libre').length} libres · {tables.filter(t => t.status !== 'libre').length} ocupadas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {tables.map((table, i) => {
          const cfg = STATUS_CONFIG[table.status] || STATUS_CONFIG.libre;
          const comanda = getComanda(table.number);
          return (
            <motion.button
              key={table.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => onSelect(table, comanda)}
              className={`relative ${cfg.bg} ${cfg.border} border-2 rounded-2xl p-5 text-left transition-all hover:scale-[1.03] focus-ember`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-display font-black text-bone text-3xl">{table.number}</span>
                <span className={`w-3 h-3 rounded-full ${cfg.dot} ${table.status !== 'libre' ? 'animate-pulse' : ''}`} />
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider ${cfg.text}`}>{cfg.label}</span>
              <div className="flex items-center gap-1.5 text-bone/40 text-xs mt-2">
                <Users size={12} /> {table.capacity} · <span className="capitalize">{table.zone}</span>
              </div>
              {comanda && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-bone/50 text-xs truncate">{comanda.waiter_name || 'Sin mesero'}</p>
                  <p className="text-ember font-bold text-sm">${comanda.total}</p>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
