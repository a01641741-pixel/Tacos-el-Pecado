import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Minus, X, Send, Bell, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

const STATUS_FLOW = {
  abierta: { next: 'en_cocina', label: 'Enviar a cocina', icon: Send, color: 'bg-ember hover:bg-ember-dark text-obsidian' },
  en_cocina: { next: 'lista', label: 'Marcar lista', icon: Bell, color: 'bg-amber-500 hover:bg-amber-600 text-obsidian' },
  lista: { next: 'servida', label: 'Marcar servida', icon: Check, color: 'bg-emerald-500 hover:bg-emerald-600 text-obsidian' },
  servida: { next: 'cerrada', label: 'Cerrar comanda', icon: X, color: 'bg-card border-2 border-ember/40 text-bone hover:border-ember' },
};

const STATUS_LABELS = {
  abierta: { label: 'Abierta', cls: 'bg-ember/15 text-ember' },
  en_cocina: { label: 'En cocina', cls: 'bg-amber-500/15 text-amber-400' },
  lista: { label: 'Lista', cls: 'bg-emerald-500/15 text-emerald-400' },
  servida: { label: 'Servida', cls: 'bg-blue-500/15 text-blue-400' },
  cerrada: { label: 'Cerrada', cls: 'bg-bone/10 text-bone/50' },
};

export default function ComandaEditor({ editing, menuItems, onClose, onSaved }) {
  const { toast } = useToast();
  const isExisting = !editing.isNew;
  const isDelivery = editing.comanda?.order_type === 'domicilio' || editing.isDelivery;

  const [items, setItems] = useState(editing.comanda?.items || []);
  const [waiterName, setWaiterName] = useState(editing.comanda?.waiter_name || '');
  const [customerName, setCustomerName] = useState(editing.comanda?.customer_name || '');
  const [customerPhone, setCustomerPhone] = useState(editing.comanda?.customer_phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState(editing.comanda?.delivery_address || '');
  const [driverName, setDriverName] = useState(editing.comanda?.driver_name || '');
  const [notes, setNotes] = useState(editing.comanda?.notes || '');
  const [status, setStatus] = useState(editing.comanda?.status || 'abierta');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.auth.me()
      .then(user => { if (user.full_name && !waiterName) setWaiterName(user.full_name); })
      .catch(() => {});
  }, []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const addItem = (menuItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.name === menuItem.name);
      if (existing) {
        return prev.map(i => i.name === menuItem.name ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { name: menuItem.name, price: menuItem.price, quantity: 1 }];
    });
  };

  const changeQty = (name, delta) => {
    setItems(prev => prev
      .map(i => i.name === name ? { ...i, quantity: i.quantity + delta } : i)
      .filter(i => i.quantity > 0));
  };

  const removeItem = (name) => setItems(prev => prev.filter(i => i.name !== name));

  const validate = () => {
    if (items.length === 0) {
      toast({ title: 'Sin items', description: 'Agrega al menos un producto', variant: 'destructive' });
      return false;
    }
    if (isDelivery && (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim())) {
      toast({ title: 'Datos faltantes', description: 'Nombre, teléfono y dirección son obligatorios', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const data = {
        order_type: isDelivery ? 'domicilio' : 'mesa',
        waiter_name: waiterName,
        items,
        subtotal: total,
        total,
        status: 'abierta',
        notes,
      };
      if (!isDelivery && editing.table) data.table_number = editing.table.number;
      if (isDelivery) {
        data.customer_name = customerName;
        data.customer_phone = customerPhone;
        data.delivery_address = deliveryAddress;
        data.driver_name = driverName;
      }
      await base44.entities.Comanda.create(data);
      if (!isDelivery && editing.table) {
        await base44.entities.Table.update(editing.table.id, { status: 'ocupada' });
      }
      toast({ title: 'Comanda creada', description: isDelivery ? 'Pedido a domicilio registrado' : `Mesa ${editing.table.number} ocupada` });
      onSaved();
    } catch (e) {
      toast({ title: 'Error', description: 'No se pudo crear la comanda', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setSaving(true);
    try {
      const data = { status: newStatus, items, subtotal: total, total, notes, driver_name: driverName };
      if (newStatus === 'cerrada') data.closed_at = new Date().toISOString();
      await base44.entities.Comanda.update(editing.comanda.id, data);
      if (newStatus === 'cerrada' && editing.table) {
        await base44.entities.Table.update(editing.table.id, { status: 'libre' });
      }
      setStatus(newStatus);
      toast({ title: 'Estado actualizado', description: `Comanda: ${STATUS_LABELS[newStatus].label}` });
      if (newStatus === 'cerrada') { onSaved(); return; }
      onSaved();
    } catch (e) {
      toast({ title: 'Error', description: 'No se pudo actualizar', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const data = { items, subtotal: total, total, notes, waiter_name: waiterName };
      if (isDelivery) {
        data.customer_name = customerName;
        data.customer_phone = customerPhone;
        data.delivery_address = deliveryAddress;
        data.driver_name = driverName;
      }
      await base44.entities.Comanda.update(editing.comanda.id, data);
      toast({ title: 'Cambios guardados' });
      onSaved();
    } catch (e) {
      toast({ title: 'Error', description: 'No se pudo guardar', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const flow = STATUS_FLOW[status];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[60] bg-background overflow-y-auto">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="inline-flex items-center gap-2 text-bone/60 hover:text-ember transition-colors">
            <ArrowLeft size={20} /> Volver
          </button>
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${STATUS_LABELS[status].cls}`}>
            {STATUS_LABELS[status].label}
          </span>
        </div>

        <div className="mb-8">
          <h1 className="font-display font-black text-bone text-4xl sm:text-5xl tracking-tight">
            {isDelivery ? 'Pedido a Domicilio' : `Mesa ${editing.table?.number}`}
          </h1>
          <p className="text-bone/50 mt-2">
            {isExisting ? `Comanda #${(editing.comanda.id || '').slice(-6)}` : 'Nueva comanda'}
            {isExisting && editing.comanda.waiter_name && ` · ${editing.comanda.waiter_name}`}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <div className="bg-card rounded-2xl border border-white/5 p-5 mb-6">
              <h2 className="font-display font-black text-bone text-xl mb-4">Items de la comanda</h2>
              {items.length === 0 ? (
                <p className="text-bone/40 text-sm py-8 text-center">Agrega productos del menú →</p>
              ) : (
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.name} className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => changeQty(item.name, -1)} className="w-7 h-7 rounded-full bg-ember/20 text-ember flex items-center justify-center hover:bg-ember hover:text-obsidian transition-colors">
                          <Minus size={14} />
                        </button>
                        <span className="font-bold text-bone w-6 text-center">{item.quantity}</span>
                        <button onClick={() => changeQty(item.name, 1)} className="w-7 h-7 rounded-full bg-ember/20 text-ember flex items-center justify-center hover:bg-ember hover:text-obsidian transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="flex-1 text-bone text-sm">{item.name}</span>
                      <span className="text-ember font-bold text-sm">${item.price * item.quantity}</span>
                      <button onClick={() => removeItem(item.name)} className="text-bone/30 hover:text-ember transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {items.length > 0 && (
                <div className="border-t border-white/5 mt-4 pt-4 flex items-center justify-between">
                  <span className="text-bone/50 text-sm">Total</span>
                  <span className="font-display font-black text-ember text-3xl">${total}</span>
                </div>
              )}
            </div>

            <div className="bg-card rounded-2xl border border-white/5 p-5">
              <h2 className="font-display font-black text-bone text-xl mb-4">Agregar del menú</h2>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => addItem(item)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-ember/10 transition-colors text-left group"
                  >
                    <div className="w-8 h-8 rounded-full bg-ember/10 group-hover:bg-ember group-hover:text-obsidian text-ember flex items-center justify-center transition-colors shrink-0">
                      <Plus size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-bone text-sm font-medium">{item.name}</p>
                      <p className="text-bone/40 text-xs capitalize">{item.category}</p>
                    </div>
                    <span className="text-bone/60 font-bold text-sm shrink-0">${item.price}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-card rounded-2xl border border-white/5 p-5 mb-6">
              <h2 className="font-display font-black text-bone text-xl mb-4">Información</h2>

              {isDelivery && (
                <>
                  <div className="mb-4">
                    <label className="text-bone/50 text-xs uppercase tracking-wider font-semibold">Nombre completo *</label>
                    <input
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Nombre del cliente"
                      disabled={status === 'cerrada'}
                      className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone focus:outline-none focus:border-ember/50 disabled:opacity-50"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="text-bone/50 text-xs uppercase tracking-wider font-semibold">Teléfono *</label>
                    <input
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="55 5555 5555"
                      disabled={status === 'cerrada'}
                      className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone focus:outline-none focus:border-ember/50 disabled:opacity-50"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="text-bone/50 text-xs uppercase tracking-wider font-semibold">Dirección *</label>
                    <input
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Calle, número, referencias"
                      disabled={status === 'cerrada'}
                      className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone focus:outline-none focus:border-ember/50 disabled:opacity-50"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="text-bone/50 text-xs uppercase tracking-wider font-semibold">Repartidor</label>
                    <input
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      placeholder="Nombre del repartidor"
                      disabled={status === 'cerrada'}
                      className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone focus:outline-none focus:border-ember/50 disabled:opacity-50"
                    />
                  </div>
                </>
              )}

              <div className="mb-4">
                <label className="text-bone/50 text-xs uppercase tracking-wider font-semibold">Mesero</label>
                <input
                  value={waiterName}
                  onChange={(e) => setWaiterName(e.target.value)}
                  placeholder="Nombre del mesero"
                  disabled={status === 'cerrada'}
                  className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone focus:outline-none focus:border-ember/50 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-bone/50 text-xs uppercase tracking-wider font-semibold">Notas</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Sin cebolla, extra salsa, etc."
                  rows={3}
                  disabled={status === 'cerrada'}
                  className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone focus:outline-none focus:border-ember/50 resize-none disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-3">
              {!isExisting ? (
                <button
                  onClick={handleCreate}
                  disabled={saving}
                  className="w-full bg-ember hover:bg-ember-dark text-obsidian font-heading text-lg uppercase tracking-wide py-4 rounded-full transition-all ember-glow disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Crear comanda'}
                </button>
              ) : (
                <>
                  {status !== 'cerrada' && flow && (
                    <button
                      onClick={() => handleStatusUpdate(flow.next)}
                      disabled={saving}
                      className={`w-full ${flow.color} font-heading text-lg uppercase tracking-wide py-4 rounded-full transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
                    >
                      <flow.icon size={20} /> {flow.label}
                    </button>
                  )}
                  {status !== 'cerrada' && (
                    <button
                      onClick={handleSaveChanges}
                      disabled={saving}
                      className="w-full bg-card border border-white/10 hover:border-ember/40 text-bone font-bold py-3 rounded-full transition-all disabled:opacity-50"
                    >
                      Guardar cambios
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
