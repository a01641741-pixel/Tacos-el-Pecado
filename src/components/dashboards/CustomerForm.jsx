import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Phone, Mail, MapPin, UserPlus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

export default function CustomerForm({ onClose, onSaved }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const canSubmit = form.name.trim() && form.phone.trim();

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSaving(true);
    try {
      await base44.entities.Customer.create({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        address: form.address.trim() || undefined,
        total_orders: 0,
        total_spent: 0,
        loyalty_tier: 'novato',
      });
      toast({ title: 'Cliente registrado', description: `${form.name} agregado al libro` });
      onSaved();
    } catch (e) {
      toast({ title: 'Error', description: 'No se pudo registrar el cliente', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-obsidian/80 backdrop-blur-sm flex items-center justify-center p-5"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-white/10 rounded-3xl w-full max-w-md p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-ember/15 flex items-center justify-center">
              <UserPlus size={20} className="text-ember" />
            </div>
            <div>
              <h2 className="font-display font-black text-bone text-xl">Nuevo Cliente</h2>
              <p className="text-bone/40 text-xs">Alta manual en el libro de pecados</p>
            </div>
          </div>
          <button onClick={onClose} className="text-bone/40 hover:text-ember transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-bone/50 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1.5">
              <User size={12} /> Nombre completo *
            </label>
            <input
              value={form.name}
              onChange={set('name')}
              placeholder="Nombre del cliente"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone focus:outline-none focus:border-ember/50"
            />
          </div>
          <div>
            <label className="text-bone/50 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1.5">
              <Phone size={12} /> Teléfono *
            </label>
            <input
              value={form.phone}
              onChange={set('phone')}
              placeholder="33 2949 9486"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone focus:outline-none focus:border-ember/50"
            />
          </div>
          <div>
            <label className="text-bone/50 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1.5">
              <Mail size={12} /> Correo
            </label>
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="cliente@correo.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone focus:outline-none focus:border-ember/50"
            />
          </div>
          <div>
            <label className="text-bone/50 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1.5">
              <MapPin size={12} /> Dirección
            </label>
            <input
              value={form.address}
              onChange={set('address')}
              placeholder="Calle, número, colonia"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone focus:outline-none focus:border-ember/50"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-white/5 hover:bg-white/10 text-bone/70 font-bold py-3 rounded-full transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || saving}
            className="flex-1 bg-ember hover:bg-ember-dark text-obsidian font-bold py-3 rounded-full transition-all ember-glow disabled:opacity-40"
          >
            {saving ? 'Guardando...' : 'Registrar'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
