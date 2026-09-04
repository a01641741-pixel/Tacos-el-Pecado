import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Bike, Phone, MapPin, User, Clock, ChevronDown } from 'lucide-react';

const COLUMNS = [
  {
    id: 'preparacion',
    label: 'En Preparación',
    statuses: ['abierta', 'en_cocina'],
    dot: 'bg-ember',
    accent: 'text-ember',
    bg: 'bg-ember/5',
    border: 'border-ember/30',
  },
  {
    id: 'listo',
    label: 'Listo para Entregar',
    statuses: ['lista'],
    dot: 'bg-amber-400',
    accent: 'text-amber-400',
    bg: 'bg-amber-400/5',
    border: 'border-amber-400/30',
  },
  {
    id: 'enviado',
    label: 'Enviados',
    statuses: ['servida'],
    dot: 'bg-blue-400',
    accent: 'text-blue-400',
    bg: 'bg-blue-400/5',
    border: 'border-blue-400/30',
  },
];

const PAGE_SIZE = 5;

const fmtTime = (d) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }); }
  catch { return '—'; }
};

const shortId = (id) => (id || '').slice(-4).toUpperCase();

export default function DeliveryPanel({ comandas, onNew, onSelect }) {
  const [visibleCounts, setVisibleCounts] = useState({});

  const getColumnOrders = (col) =>
    comandas
      .filter(c => col.statuses.includes(c.status))
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

  const totalActive = comandas.filter(c => c.status !== 'cerrada').length;

  const showMore = (colId) =>
    setVisibleCounts(prev => ({ ...prev, [colId]: (prev[colId] || PAGE_SIZE) + PAGE_SIZE }));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-black text-bone text-3xl">Pedidos a Domicilio</h2>
          <p className="text-bone/50 text-sm mt-1">{totalActive} pedidos activos</p>
        </div>
        <button
          onClick={onNew}
          className="inline-flex items-center justify-center gap-2 bg-ember hover:bg-ember-dark text-obsidian font-bold px-5 py-3 rounded-full transition-all ember-glow"
        >
          <Plus size={18} /> Nuevo Pedido
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-3 lg:overflow-visible">
        {COLUMNS.map((col) => {
          const all = getColumnOrders(col);
          const count = visibleCounts[col.id] || PAGE_SIZE;
          const visible = all.slice(0, count);
          const hasMore = all.length > count;
          const hidden = all.length - count;

          return (
            <div key={col.id} className="min-w-[330px] lg:min-w-0 flex flex-col">
              <div className={`rounded-t-2xl ${col.bg} border-t border-x ${col.border} px-4 py-3 flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                  <span className={`font-heading text-sm uppercase tracking-wide ${col.accent}`}>{col.label}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.bg} ${col.accent}`}>{all.length}</span>
              </div>

              <div className={`flex-1 bg-card border-x border-b ${col.border} rounded-b-2xl min-h-[200px] flex flex-col`}>
                {visible.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-16">
                    <Bike size={24} className="text-bone/15 mb-2" />
                    <p className="text-bone/30 text-xs">Sin pedidos</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5 flex-1">
                    {visible.map((order, i) => (
                      <motion.button
                        key={order.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => onSelect(order)}
                        className="w-full text-left p-3 hover:bg-white/[0.03] transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-bone/40">#{shortId(order.id)}</span>
                            <span className="text-[10px] text-bone/30 flex items-center gap-0.5">
                              <Clock size={10} /> {fmtTime(order.created_date)}
                            </span>
                          </div>
                          <span className="font-display font-black text-ember text-base">${order.total || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <User size={11} className="text-bone/30 shrink-0" />
                          <span className="text-bone text-xs font-semibold truncate">{order.customer_name || '—'}</span>
                        </div>
                        <div className="flex items-start gap-1.5 mb-1">
                          <MapPin size={11} className="text-bone/30 shrink-0 mt-px" />
                          <span className="text-bone/50 text-[11px] line-clamp-1">{order.delivery_address || '—'}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1 text-bone/50 text-[11px]">
                            <Phone size={11} className="shrink-0" /> {order.customer_phone || '—'}
                          </span>
                          {order.driver_name ? (
                            <span className="flex items-center gap-1 text-bone/50 text-[11px]">
                              <Bike size={11} className="shrink-0" /> {order.driver_name}
                            </span>
                          ) : (
                            <span className="text-bone/20 text-[10px] italic">Sin repartidor</span>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {hasMore && (
                  <button
                    onClick={() => showMore(col.id)}
                    className="w-full py-2.5 text-center text-xs text-bone/40 hover:text-ember transition-colors border-t border-white/5 flex items-center justify-center gap-1"
                  >
                    <ChevronDown size={12} /> Mostrar más resultados ({hidden})
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
