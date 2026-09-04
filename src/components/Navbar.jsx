import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu as MenuIcon, X } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const isStaff = user && ['admin', 'mesero'].includes(user.role);
  const links = [
    { label: 'Inicio', to: '/' },
    { label: 'Menú', to: '/menu' },
    { label: 'Visítanos', to: '/experiencia' },
    ...(isStaff ? [{ label: 'Panel', to: '/panel' }, { label: 'Comandas', to: '/comandas' }] : []),
    ...(user?.email === 'a01641741@tec.mx' ? [{ label: 'Accesos', to: '/accesos' }] : []),
  ];

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-obsidian/85 backdrop-blur-xl border-b border-white/5 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center group" aria-label="Volver al inicio">
          <img
            src="https://media.base44.com/images/public/6a59c835542617752331b47a/5ac8d1df0_image.png"
            alt="Tacos El Pecado"
            className={`${scrolled ? 'h-9 sm:h-10' : 'h-11 sm:h-12'} w-auto rounded-lg object-cover transition-all duration-500 group-hover:scale-105`}
          />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-4 py-2 text-sm font-medium tracking-wide transition-colors hover:text-ember focus-ember rounded ${
                location.pathname === l.to ? 'text-ember' : 'text-bone/70'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <button
              onClick={() => logout()}
              className="text-bone/70 hover:text-ember text-sm font-medium px-3 py-2 transition-colors"
            >
              Salir
            </button>
          )}
          <Link
            to="/pedido"
            className="relative flex items-center gap-2 bg-ember hover:bg-ember-dark text-obsidian font-semibold text-sm px-4 py-2.5 rounded-full transition-all ember-glow focus-ember"
            aria-label="Ver canasta de pedidos"
          >
            <ShoppingBag size={16} strokeWidth={2.5} />
            <span className="hidden sm:inline">Canasta</span>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-bone text-obsidian text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-bone p-1 focus-ember rounded"
            aria-label="Abrir menú"
          >
            {open ? <X size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden bg-obsidian/95 backdrop-blur-xl border-t border-white/5 mt-3">
          <div className="flex flex-col p-5 gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                  location.pathname === l.to ? 'text-ember bg-ember/10' : 'text-bone/80 hover:bg-white/5'
                }`}
              >
                {l.label}
              </Link>
            ))}
            {user && (
              <button
                onClick={() => logout()}
                className="px-4 py-3 text-base font-medium rounded-lg text-bone/60 hover:bg-white/5 transition-colors text-left"
              >
                Salir
              </button>
            )}
          </div>
        </div>
      )}
    </header>

    </>
  );
}
