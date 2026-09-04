import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2, ArrowRight, ArrowLeft, Check, Flame, MapPin, User, CreditCard, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useCart } from '@/lib/cartContext';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';

const DELIVERY_FEE = 25;
const STEPS = ['La Canasta', 'Tu Confesión', 'El Pago'];

export default function Order() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, count, channel, etaMinutes, arrivalStatus } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_address: '',
    neighborhood: '',
    payment_method: 'efectivo',
    notes: '',
  });

  const isDelivery = !channel || channel === 'domicilio';
  const deliveryFee = isDelivery ? DELIVERY_FEE : 0;
  const total = subtotal + (subtotal > 0 ? deliveryFee : 0);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const canProceed = () => {
    if (step === 0) return count > 0;
    if (step === 1) return isDelivery ? (form.customer_name && form.customer_phone && form.delivery_address) : (form.customer_name && form.customer_phone);
    return true;
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const orderItems = items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity }));
      const orderData = {
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        customer_phone: form.customer_phone,
        address: isDelivery ? form.delivery_address : undefined,
        channel: channel || 'domicilio',
        eta_minutes: isDelivery ? undefined : etaMinutes,
        arrival_status: isDelivery ? undefined : arrivalStatus,
        items: orderItems,
        subtotal,
        delivery_fee: deliveryFee,
        total,
        status: 'pendiente',
        notes: form.notes,
      };
      await base44.entities.Order.create(orderData);

      // Upsert customer
      try {
        const existing = await base44.entities.Customer.filter({ phone: form.customer_phone });
        if (existing && existing.length > 0) {
          const cust = existing[0];
          const newTotal = (cust.total_orders || 0) + 1;
          const newSpent = (cust.total_spent || 0) + total;
          const tier = newTotal >= 20 ? 'pecador_legendario' : newTotal >= 10 ? 'fieles' : newTotal >= 3 ? 'fieles' : 'nuevo';
          await base44.entities.Customer.update(cust.id, {
            total_orders: newTotal,
            total_spent: newSpent,
            last_order_date: new Date().toISOString(),
            loyalty_tier: tier,
            address: form.delivery_address,
            email: form.customer_email || cust.email,
          });
        } else {
          await base44.entities.Customer.create({
            name: form.customer_name,
            email: form.customer_email,
            phone: form.customer_phone,
            address: form.delivery_address,
            total_orders: 1,
            total_spent: total,
            last_order_date: new Date().toISOString(),
            loyalty_tier: 'nuevo',
          });
        }
      } catch (e) {
        // customer upsert is secondary; order already saved
      }

      clearCart();
      setDone(true);
      toast({ title: 'Pecado confesado', description: 'Tu pedido está en preparación.' });
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo registrar el pedido. Intenta de nuevo.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 pt-28 pb-20 grain">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-ember/10 border-2 border-ember flex items-center justify-center mx-auto mb-8 ember-pulse">
            <Check size={40} className="text-ember" strokeWidth={3} />
          </div>
          <h1 className="font-display font-black text-bone text-5xl tracking-tight">Pecado <span className="text-ember italic">confesado</span></h1>
          <p className="text-bone/60 text-lg mt-6 leading-relaxed">
            Tu ritual está en preparación. Las brasas están encendidas. Recibirás tu pedido en aproximadamente 30 minutos.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/menu"><Button className="bg-ember hover:bg-ember-dark text-obsidian font-bold rounded-full px-6">Seguir pecando</Button></Link>
            <Link to="/"><Button variant="outline" className="border-white/20 text-bone hover:text-ember rounded-full px-6">Volver al inicio</Button></Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 min-h-screen grain">
      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        <Link to="/menu" className="inline-flex items-center gap-2 text-bone/50 hover:text-ember transition-colors text-sm mb-8">
          <ArrowLeft size={16} /> Seguir en el códex
        </Link>

        <span className="text-gold text-xs font-mono tracking-widest uppercase">El Ritual</span>
        <h1 className="font-display font-black text-bone text-4xl sm:text-5xl mt-3 tracking-tight">Confiesa tu <span className="text-ember italic">pecado</span></h1>

        {/* Fuse progress bar */}
        <div className="mt-6 mb-8">
          <div className="flex justify-between mb-3">
            {STEPS.map((s, i) => (
              <span key={s} className={`text-[10px] sm:text-xs font-mono uppercase tracking-tight transition-colors ${i <= step ? 'text-ember' : 'text-bone/30'}`}>{s}</span>
            ))}
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full fuse-bar"
              initial={{ width: '10%' }}
              animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="cart" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {items.length === 0 ? (
                <div className="text-center py-20">
                  <Flame size={40} className="text-bone/20 mx-auto mb-4" />
                  <p className="text-bone/40 text-lg">Tu canasta está vacía</p>
                  <Link to="/menu"><Button className="mt-6 bg-ember hover:bg-ember-dark text-obsidian font-bold rounded-full px-6">Explorar el códex</Button></Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.name} className="flex items-center gap-4 bg-card border border-white/5 rounded-2xl p-4">
                      <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1">
                        <h3 className="font-display font-bold text-bone">{item.name}</h3>
                        <span className="text-ember font-bold">${item.price}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => updateQuantity(item.name, -1)} aria-label="Reducir cantidad" className="w-8 h-8 rounded-full bg-white/5 hover:bg-ember text-bone hover:text-obsidian flex items-center justify-center transition-colors"><Minus size={16} /></button>
                        <span className="font-mono font-bold text-bone w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.name, 1)} aria-label="Aumentar cantidad" className="w-8 h-8 rounded-full bg-white/5 hover:bg-ember text-bone hover:text-obsidian flex items-center justify-center transition-colors"><Plus size={16} /></button>
                        <button onClick={() => removeItem(item.name)} aria-label="Eliminar" className="w-8 h-8 rounded-full bg-white/5 hover:bg-destructive text-bone/60 hover:text-white flex items-center justify-center transition-colors ml-2"><Trash2 size={15} /></button>
                      </div>
                    </div>
                  ))}
                  <div className="bg-card border border-white/5 rounded-2xl p-5 mt-6 space-y-2">
                    <div className="flex justify-between text-bone/60 text-sm"><span>Subtotal</span><span>${subtotal}</span></div>
                    {isDelivery && <div className="flex justify-between text-bone/60 text-sm"><span>Entrega</span><span>${deliveryFee}</span></div>}
                    <div className="flex justify-between font-display font-black text-bone text-xl pt-2 border-t border-white/5"><span>Total</span><span className="text-ember">${total}</span></div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              {!user && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                  <div>
                    <p className="text-bone font-semibold">¿Ya has pedido antes?</p>
                    <p className="text-bone/45 text-sm mt-1">Inicia sesión si quieres guardar tus datos, o continúa como invitado.</p>
                  </div>
                  <Link
                    to="/login?returnTo=/pedido"
                    className="shrink-0 inline-flex items-center justify-center rounded-full border border-ember/50 px-5 py-2.5 text-sm font-semibold text-ember hover:bg-ember hover:text-white transition-colors"
                  >
                    Iniciar sesión
                  </Link>
                </div>
              )}
              <div className="flex items-center gap-2 text-bone/40 text-sm mb-2"><User size={16} /> {user ? 'Confirma tus datos' : 'Tus datos para el pedido'}</div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-bone/50 text-xs font-mono uppercase tracking-wider mb-2 block">Nombre *</label>
                  <Input value={form.customer_name} onChange={set('customer_name')} placeholder="Tu nombre" className="bg-card border-white/10 text-bone focus-ember" />
                </div>
                <div>
                  <label className="text-bone/50 text-xs font-mono uppercase tracking-wider mb-2 block">Teléfono *</label>
                  <Input value={form.customer_phone} onChange={set('customer_phone')} placeholder="55 5555 5555" className="bg-card border-white/10 text-bone focus-ember" />
                </div>
              </div>
              <div>
                <label className="text-bone/50 text-xs font-mono uppercase tracking-wider mb-2 block">Correo</label>
                <Input type="email" value={form.customer_email} onChange={set('customer_email')} placeholder="tu@correo.com" className="bg-card border-white/10 text-bone focus-ember" />
              </div>
              {!isDelivery && (
                <div className="bg-ember/5 border border-ember/20 rounded-xl p-4 flex items-center gap-3 mb-4">
                  <Clock size={16} className="text-ember shrink-0" />
                  <p className="text-bone/50 text-sm">
                    {arrivalStatus === 'ya_estoy_aqui'
                      ? '¡Estás aquí! Tu pedido se prepara de inmediato.'
                      : `Llegas en aproximadamente ${etaMinutes} minutos. Lo tendremos listo.`}
                  </p>
                </div>
              )}
              {isDelivery && (
                <>
                  <div className="bg-ember/5 border border-ember/20 rounded-xl p-4 flex items-center gap-3 mb-4">
                    <MapPin size={16} className="text-ember shrink-0" />
                    <p className="text-bone/50 text-sm">Zona de entrega desde: <span className="text-bone font-medium">C. Velázquez 445, La Estancia, Zapopan</span></p>
                  </div>
                  <div className="flex items-center gap-2 text-bone/40 text-sm mb-2"><MapPin size={16} /> Destino del pecado</div>
                  <div>
                    <label className="text-bone/50 text-xs font-mono uppercase tracking-wider mb-2 block">Dirección *</label>
                    <Input value={form.delivery_address} onChange={set('delivery_address')} placeholder="Calle, número, referencias" className="bg-card border-white/10 text-bone focus-ember" />
                  </div>
                  <div>
                    <label className="text-bone/50 text-xs font-mono uppercase tracking-wider mb-2 block">Colonia</label>
                    <Input value={form.neighborhood} onChange={set('neighborhood')} placeholder="Tu colonia" className="bg-card border-white/10 text-bone focus-ember" />
                  </div>
                </>
              )}
              <div>
                <label className="text-bone/50 text-xs font-mono uppercase tracking-wider mb-2 block">Notas</label>
                <Textarea value={form.notes} onChange={set('notes')} placeholder="Sin cebolla, salsa extra, etc." className="bg-card border-white/10 text-bone focus-ember" />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="pay" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="flex items-center gap-2 text-bone/40 text-sm mb-2"><CreditCard size={16} /> Método de pago</div>
              <div className="grid grid-cols-2 gap-4">
                {['efectivo', 'tarjeta'].map((m) => (
                  <button key={m} onClick={() => setForm((f) => ({ ...f, payment_method: m }))}
                    className={`py-6 rounded-2xl border-2 font-display font-bold text-lg capitalize transition-all focus-ember ${form.payment_method === m ? 'border-ember bg-ember/10 text-ember' : 'border-white/10 text-bone/50 hover:border-white/30'}`}>
                    {m}
                  </button>
                ))}
              </div>
              <div className="bg-card border border-white/5 rounded-2xl p-6 space-y-3">
                <h3 className="font-display font-bold text-bone mb-2">Resumen del pecado</h3>
                {items.map((i) => (
                  <div key={i.name} className="flex justify-between text-bone/60 text-sm">
                    <span>{i.quantity}× {i.name}</span><span>${i.price * i.quantity}</span>
                  </div>
                ))}
                {isDelivery && <div className="flex justify-between text-bone/60 text-sm pt-2 border-t border-white/5"><span>Entrega</span><span>${deliveryFee}</span></div>}
                <div className="flex justify-between font-display font-black text-bone text-xl pt-2 border-t border-white/5"><span>Total</span><span className="text-ember">${total}</span></div>
              </div>
              <div className="bg-ember/5 border border-ember/20 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <Flame size={18} className="text-ember mt-0.5 shrink-0" />
                  <p className="text-bone/60 text-sm">Al confirmar, tu pedido pasa directo al carbón. {isDelivery ? 'Tiempo estimado: ' : ''}<span className="text-ember font-semibold">{isDelivery ? '30 minutos' : arrivalStatus === 'ya_estoy_aqui' ? '¡De inmediato!' : `${etaMinutes} minutos`}</span>.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {count > 0 && !done && (
          <div className="flex justify-between gap-4 mt-10">
            {step > 0 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="border-white/20 text-bone hover:text-ember rounded-full px-6">
                <ArrowLeft size={18} className="mr-2" /> Atrás
              </Button>
            ) : <div />}
            {step < 2 ? (
              <Button onClick={() => canProceed() && setStep(step + 1)} disabled={!canProceed()} className="bg-ember hover:bg-ember-dark text-obsidian font-bold rounded-full px-8 disabled:opacity-40">
                Continuar <ArrowRight size={18} className="ml-2" />
              </Button>
            ) : (
              <Button onClick={submit} disabled={submitting} className="bg-ember hover:bg-ember-dark text-obsidian font-bold rounded-full px-8 disabled:opacity-40">
                {submitting ? 'Confesando...' : 'Cometer el Pecado'} <Flame size={18} className="ml-2" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
