import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Utensils, Bike } from 'lucide-react';

export default function ClosedPanel({ comandas }) {
  const [filter, setFilter] = useState('todos');
  const closed = comandas.filter(c => c.status === 'cerrada');
  const filtered = filter === 'todos' ? closed : closed.filter(c => c.order_type === filter);
  const totalRevenue = closed.reduce((sum, c) => sum + (c.total || 0), 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-black text-bone text-3xl">Comandas Cerradas</h2>
          <p className="text-bone/50 text-sm mt-1">{closed.length} comandas · ${totalRevenue} en total</p>
        </div>
        <div className="flex gap-2">
          {['todos', 'mesa', 'domicilio'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                filter === f ? 'bg-ember text-obsidian' : 'bg-card text-bone/60 border border-white/5'
              }`}
            >
              {f === 'todos' ? 'Todos' : f === 'mesa' ? 'Mesas' : 'Domicilio'}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-card rounded-2xl border border-white/5 p-12 text-center">
          <CheckCircle size={32} className="text-bone/20 mx-auto mb-4" />
          <p className="text-bone/40">No hay comandas cerradas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card rounded-2xl border border-white/5 p-5 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                {c.order_type === 'domicilio'
                  ? <Bike size={20} className="text-emerald-400" />
                  : <Utensils size={20} className="text-emerald-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display font-black text-bone">
                    {c.order_type === 'domicilio' ? c.customer_name : `Mesa ${c.table_number}`}
                  </h3>
                  <span className="text-bone/30 text-xs">·</span>
                  <span className="text-bone/40 text-sm">{c.waiter_name || 'Sin mesero'}</span>
                </div>
                <p className="text-bone/40 text-sm mt-1 truncate">
                  {c.items?.map(i => `${i.quantity}× ${i.name}`).join(', ') || 'Sin items'}
                </p>
                {c.closed_at && (
                  <p className="text-bone/30 text-xs mt-1">
                    {new Date(c.closed_at).toLocaleString('es-MX')}
                  </p>
                )}
              </div>
              <span className="font-display font-black text-ember text-2xl shrink-0">${c.total}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
