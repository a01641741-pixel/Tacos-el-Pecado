import React, { useState, useEffect, useCallback } from 'react';
import { Utensils, Bike, CheckCircle, Flame } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import TableGrid from '@/components/comandas/TableGrid';
import ComandaEditor from '@/components/comandas/ComandaEditor';
import DeliveryPanel from '@/components/comandas/DeliveryPanel';
import ClosedPanel from '@/components/comandas/ClosedPanel';

const TABS = [
  { id: 'mesas', label: 'Mesas', icon: Utensils },
  { id: 'domicilios', label: 'Domicilios', icon: Bike },
  { id: 'cerradas', label: 'Cerradas', icon: CheckCircle },
];

export default function Comandas() {
  const { toast } = useToast();
  const [tab, setTab] = useState('mesas');
  const [tables, setTables] = useState([]);
  const [comandas, setComandas] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [t, c, m] = await Promise.all([
        base44.entities.Table.list('number', 50),
        base44.entities.Comanda.list('-created_date', 200),
        base44.entities.MenuItem.list('order_index', 50),
      ]);
      setTables(t || []);
      setComandas(c || []);
      setMenuItems(m || []);
    } catch (e) {
      toast({ title: 'Error', description: 'No se pudieron cargar los datos', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    const unsub = base44.entities.Comanda.subscribe((event) => {
      if (event.type === 'create') {
        setComandas(prev => [event.data, ...prev.filter(c => c.id !== event.data.id)]);
        if (event.data.order_type === 'domicilio') {
          toast({ title: '🛵 Nuevo domicilio', description: event.data.customer_name || 'Cliente' });
        }
      } else if (event.type === 'update') {
        setComandas(prev => prev.map(c => c.id === event.data.id ? event.data : c));
      } else if (event.type === 'delete') {
        setComandas(prev => prev.filter(c => c.id !== event.data.id));
      }
    });
    return unsub;
  }, []);

  const activeComandas = comandas.filter(c => c.status !== 'cerrada');
  const deliveryComandas = comandas.filter(c => c.order_type === 'domicilio');

  const handleSelectTable = (table, comanda) => {
    setEditing(comanda
      ? { isNew: false, comanda, table }
      : { isNew: true, comanda: null, table });
  };

  const handleNewDelivery = () => {
    setEditing({ isNew: true, isDelivery: true, comanda: { order_type: 'domicilio' }, table: null });
  };

  const handleSelectDelivery = (comanda) => {
    setEditing({ isNew: false, comanda, table: null });
  };

  const handleSaved = () => {
    setEditing(null);
    loadData();
  };

  if (editing) {
    return (
      <ComandaEditor
        editing={editing}
        menuItems={menuItems}
        onClose={() => setEditing(null)}
        onSaved={handleSaved}
      />
    );
  }

  return (
    <div className="pt-28 pb-20 min-h-screen grain">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="mb-8">
          <span className="text-gold text-xs font-mono tracking-widest uppercase">Sistema de Comandas</span>
          <h1 className="font-display font-black text-bone text-5xl sm:text-6xl mt-2 tracking-tight">
            El <span className="text-ember italic">Altar</span>
          </h1>
          <p className="text-bone/50 text-lg mt-3">Gestiona mesas, pedidos y comandas en tiempo real.</p>
        </div>

        <div className="flex gap-1 sm:gap-2 mb-8 border-b border-white/5 overflow-x-auto">
          {TABS.map(t => {
            const count = t.id === 'mesas'
              ? tables.filter(tb => tb.status !== 'libre').length
              : t.id === 'domicilios'
                ? deliveryComandas.filter(c => c.status !== 'cerrada').length
                : comandas.filter(c => c.status === 'cerrada').length;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-3 font-heading text-sm uppercase tracking-wide transition-all border-b-2 whitespace-nowrap ${
                  tab === t.id ? 'border-ember text-ember' : 'border-transparent text-bone/40 hover:text-bone/70'
                }`}
              >
                <t.icon size={16} /> {t.label}
                {count > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${tab === t.id ? 'bg-ember/20 text-ember' : 'bg-white/5 text-bone/40'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <Flame size={32} className="text-ember mx-auto mb-4 ember-pulse" />
              <p className="text-bone/40 font-mono text-sm tracking-widest uppercase">Cargando comandas</p>
            </div>
          </div>
        ) : tab === 'mesas' ? (
          <TableGrid tables={tables} comandas={activeComandas} onSelect={handleSelectTable} />
        ) : tab === 'domicilios' ? (
          <DeliveryPanel comandas={deliveryComandas} onNew={handleNewDelivery} onSelect={handleSelectDelivery} />
        ) : (
          <ClosedPanel comandas={comandas} />
        )}
      </div>
    </div>
  );
}
