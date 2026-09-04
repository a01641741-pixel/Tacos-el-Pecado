import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, ShoppingBag, DollarSign, TrendingUp, Search, Flame, Crown, Phone, Mail, MapPin, Clock, ArrowUpRight, UserPlus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import CustomerForm from '@/components/dashboards/CustomerForm';

const TIER_CONFIG = {
  pecador_legendario: { label: 'Legendario', color: 'text-ember', bg: 'bg-ember/10 border-ember/30', icon: Crown },
  fieles: { label: 'Fiel', color: 'text-gold', bg: 'bg-gold/10 border-gold/30', icon: Flame },
  nuevo: { label: 'Novato', color: 'text-bone/50', bg: 'bg-white/5 border-white/10', icon: Users },
};

const STATUS_CONFIG = {
  pendiente: { label: 'Pendiente', color: '#C5A059' },
  preparando: { label: 'Preparando', color: '#FF4D00' },
  en_camino: { label: 'En Camino', color: '#3B82F6' },
  entregado: { label: 'Entregado', color: '#22C55E' },
  cancelado: { label: 'Cancelado', color: '#EF4444' },
};

const fmtMoney = (n) => `$${(n || 0).toLocaleString('es-MX')}`;
const fmtDate = (d) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }); }
  catch { return '—'; }
};

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('todos');
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([
      base44.entities.Order.list('-created_date', 100).catch(() => []),
      base44.entities.Customer.list('-last_order_date', 100).catch(() => []),
    ]).then(([o, c]) => {
      setOrders(o || []);
      setCustomers(c || []);
    }).finally(() => setLoading(false));

    const unsubOrders = base44.entities.Order.subscribe((event) => {
      if (event.type === 'create') {
        setOrders(prev => [event.data, ...prev.filter(o => o.id !== event.data.id)]);
        toast({ title: '🔥 Nuevo pedido', description: `${event.data.customer_name} — $${(event.data.total || 0).toLocaleString('es-MX')}` });
      } else if (event.type === 'update') {
        setOrders(prev => prev.map(o => o.id === event.data.id ? event.data : o));
      } else if (event.type === 'delete') {
        setOrders(prev => prev.filter(o => o.id !== event.data.id));
      }
    });
    const unsubCustomers = base44.entities.Customer.subscribe((event) => {
      if (event.type === 'create') {
        setCustomers(prev => [event.data, ...prev.filter(c => c.id !== event.data.id)]);
      } else if (event.type === 'update') {
        setCustomers(prev => prev.map(c => c.id === event.data.id ? event.data : c));
      } else if (event.type === 'delete') {
        setCustomers(prev => prev.filter(c => c.id !== event.data.id));
      }
    });
    return () => { unsubOrders(); unsubCustomers(); };
  }, []);

  const reloadCustomers = async () => {
    const c = await base44.entities.Customer.list('-last_order_date', 100).catch(() => []);
    setCustomers(c || []);
  };

  const stats = useMemo(() => {
    const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    const delivered = orders.filter((o) => o.status === 'entregado').length;
    const avgTicket = orders.length ? revenue / orders.length : 0;
    return { revenue, totalOrders: orders.length, totalCustomers: customers.length, avgTicket, delivered };
  }, [orders, customers]);

  const lastOrder = orders[0];

  const statusData = useMemo(() => {
    return Object.keys(STATUS_CONFIG).map((k) => ({
      status: STATUS_CONFIG[k].label,
      count: orders.filter((o) => o.status === k).length,
      fill: STATUS_CONFIG[k].color,
    }));
  }, [orders]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchSearch = !search ||
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search) ||
        c.email?.toLowerCase().includes(search.toLowerCase());
      const matchTier = tierFilter === 'todos' || c.loyalty_tier === tierFilter;
      return matchSearch && matchTier;
    });
  }, [customers, search, tierFilter]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <Flame size={32} className="text-ember mx-auto mb-4 ember-pulse" />
          <p className="text-bone/40 font-mono text-sm tracking-widest uppercase flicker-neon">Cargando el confesionario</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <span className="text-gold text-xs font-mono tracking-widest uppercase">El Confesionario</span>
            <h1 className="font-display font-black text-bone text-4xl sm:text-5xl mt-2 tracking-tight">Panel de <span className="text-ember italic">Control</span></h1>
          </div>
          <Link to="/pedido" className="text-sm text-bone/50 hover:text-ember transition-colors inline-flex items-center gap-1">
            Ver pedido <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: ShoppingBag, label: 'Pedidos Totales', value: stats.totalOrders, color: 'text-ember' },
            { icon: DollarSign, label: 'Ingresos', value: fmtMoney(stats.revenue), color: 'text-green-400' },
            { icon: Users, label: 'Clientes', value: stats.totalCustomers, color: 'text-gold' },
            { icon: TrendingUp, label: 'Ticket Promedio', value: fmtMoney(Math.round(stats.avgTicket)), color: 'text-blue-400' },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-card border border-white/5 rounded-2xl p-5">
              <kpi.icon size={20} className={`${kpi.color} mb-3`} />
              <div className="font-display font-black text-bone text-2xl sm:text-3xl">{kpi.value}</div>
              <div className="text-bone/40 text-xs font-mono uppercase tracking-wider mt-1">{kpi.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Last Sinner */}
          <div className="lg:col-span-1 bg-gradient-to-br from-ember/10 to-card border border-ember/30 rounded-2xl p-6 ember-glow">
            <div className="flex items-center gap-2 mb-5">
              <Flame size={18} className="text-ember" />
              <span className="text-ember text-xs font-mono tracking-widest uppercase">El Último Pecador</span>
            </div>
            {lastOrder ? (
              <>
                <h3 className="font-display font-black text-bone text-3xl tracking-tight">{lastOrder.customer_name}</h3>
                <div className="space-y-3 mt-5">
                  <div className="flex items-center gap-3 text-bone/60 text-sm"><Phone size={15} className="text-ember shrink-0" /> {lastOrder.customer_phone}</div>
                  {lastOrder.customer_email && <div className="flex items-center gap-3 text-bone/60 text-sm"><Mail size={15} className="text-ember shrink-0" /> {lastOrder.customer_email}</div>}
                  <div className="flex items-start gap-3 text-bone/60 text-sm"><MapPin size={15} className="text-ember shrink-0 mt-0.5" /> {lastOrder.address}</div>
                  <div className="flex items-center gap-3 text-bone/60 text-sm"><Clock size={15} className="text-ember shrink-0" /> {fmtDate(lastOrder.created_date)}</div>
                </div>
                <div className="mt-5 pt-5 border-t border-white/10">
                  <div className="text-bone/40 text-xs font-mono uppercase tracking-wider mb-2">Confesión</div>
                  {lastOrder.items && lastOrder.items.map((it, i) => (
                    <div key={i} className="flex justify-between text-bone/70 text-sm py-0.5">
                      <span>{it.quantity}× {it.name}</span><span>${it.price * it.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-display font-black text-ember text-xl mt-3 pt-2 border-t border-white/10">
                    <span>Total</span><span>{fmtMoney(lastOrder.total)}</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-bone/40 text-sm py-8 text-center">Aún no hay confesiones registradas.</p>
            )}
          </div>

          {/* Orders by status chart */}
          <div className="lg:col-span-2 bg-card border border-white/5 rounded-2xl p-6">
            <h3 className="font-display font-bold text-bone text-lg mb-1">Pedidos por Estado</h3>
            <p className="text-bone/40 text-xs font-mono uppercase tracking-wider mb-6">Distribución en tiempo real</p>
            {orders.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-bone/30 text-sm">Sin datos aún</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={statusData}>
                  <XAxis dataKey="status" tick={{ fill: '#F2F2F2', fontSize: 11, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#F2F2F2', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={{ background: '#0A0A0B', border: '1px solid rgba(255,77,0,0.3)', borderRadius: 12, color: '#F2F2F2' }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {statusData.map((entry, idx) => <Cell key={idx} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* CRM Table */}
        <div className="bg-card border border-white/5 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-display font-bold text-bone text-lg">El Libro de Pecados</h3>
              <p className="text-bone/40 text-xs font-mono uppercase tracking-wider mt-1">Base de clientes · CRM</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowCustomerForm(true)}
                className="inline-flex items-center justify-center gap-2 bg-ember hover:bg-ember-dark text-obsidian font-bold px-4 py-2 rounded-full transition-all ember-glow text-sm shrink-0"
              >
                <UserPlus size={16} /> Nuevo Cliente
              </button>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-bone/30" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar cliente..." className="bg-obsidian border-white/10 text-bone pl-9 focus-ember sm:w-56" />
              </div>
              <div className="flex gap-1.5">
                {['todos', 'pecador_legendario', 'fieles', 'nuevo'].map((t) => (
                  <button key={t} onClick={() => setTierFilter(t)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all focus-ember ${tierFilter === t ? 'bg-ember text-obsidian' : 'bg-white/5 text-bone/50 hover:text-ember'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredCustomers.length === 0 ? (
            <div className="text-center py-16">
              <Users size={32} className="text-bone/20 mx-auto mb-3" />
              <p className="text-bone/40 text-sm">{customers.length === 0 ? 'Aún no hay clientes en el libro.' : 'Sin resultados para tu búsqueda.'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-white/5 text-left">
                    <th className="text-bone/40 text-xs font-mono uppercase tracking-wider py-3 pr-4">Cliente</th>
                    <th className="text-bone/40 text-xs font-mono uppercase tracking-wider py-3 pr-4">Contacto</th>
                    <th className="text-bone/40 text-xs font-mono uppercase tracking-wider py-3 pr-4 text-center">Pedidos</th>
                    <th className="text-bone/40 text-xs font-mono uppercase tracking-wider py-3 pr-4 text-right">Gastado</th>
                    <th className="text-bone/40 text-xs font-mono uppercase tracking-wider py-3 pr-4">Lealtad</th>
                    <th className="text-bone/40 text-xs font-mono uppercase tracking-wider py-3">Último</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((c) => {
                    const tier = TIER_CONFIG[c.loyalty_tier] || TIER_CONFIG.novato;
                    return (
                      <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 pr-4">
                          <div className="font-display font-bold text-bone">{c.name}</div>
                          {c.neighborhood && <div className="text-bone/30 text-xs">{c.neighborhood}</div>}
                        </td>
                        <td className="py-4 pr-4">
                          <div className="text-bone/70 text-sm">{c.phone}</div>
                          {c.email && <div className="text-bone/30 text-xs">{c.email}</div>}
                        </td>
                        <td className="py-4 pr-4 text-center font-mono text-bone">{c.total_orders || 0}</td>
                        <td className="py-4 pr-4 text-right font-display font-bold text-ember">{fmtMoney(c.total_spent)}</td>
                        <td className="py-4 pr-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${tier.bg} ${tier.color}`}>
                            <tier.icon size={11} /> {tier.label}
                          </span>
                        </td>
                        <td className="py-4 text-bone/50 text-xs">{fmtDate(c.last_order_date)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showCustomerForm && (
          <CustomerForm
            onClose={() => setShowCustomerForm(false)}
            onSaved={() => { setShowCustomerForm(false); reloadCustomers(); }}
          />
        )}
      </div>
    </div>
  );
}
