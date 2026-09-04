import React, { useState } from "react";
import { useNavigate, Link, Navigate, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, Flame, User, ArrowRight } from "lucide-react";
import GoogleIcon from "@/components/GoogleIcon";
import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedReturn = searchParams.get("returnTo");
  const returnTo = requestedReturn?.startsWith("/") && !requestedReturn.startsWith("//") ? requestedReturn : "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!requestedReturn) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = returnTo;
    } catch (err) {
      setError(err.message || "Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    base44.auth.loginWithProvider("google", returnTo);
  };

  const handleGuest = () => {
    sessionStorage.setItem('guestMode', 'true');
    navigate(returnTo);
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-5 py-12 grain">
      <div className="absolute inset-0 z-0">
        <Image src="https://media.base44.com/images/public/6a59c835542617752331b47a/a673c5e72_generated_image.png" alt="" className="block w-full h-full object-cover" fittingType="fill" />
        <div className="absolute inset-0 bg-obsidian/85" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-10">
          <img
            src="https://media.base44.com/images/public/6a59c835542617752331b47a/5ac8d1df0_image.png"
            alt="Tacos El Pecado"
            className="h-16 w-auto rounded-xl mx-auto mb-4"
          />
          <h1 className="font-display text-bone text-3xl tracking-tight">El Pecado te espera</h1>
          <p className="text-bone/50 text-sm mt-2">Elige cómo quieres entrar</p>
        </div>

        <div className="space-y-4">
          {/* Invitado */}
          <button
            onClick={handleGuest}
            className="w-full flex items-center gap-3 bg-card/60 border border-white/10 hover:border-ember/40 rounded-2xl p-4 transition-all hover:scale-[1.02]"
          >
            <div className="w-10 h-10 rounded-xl bg-bone/10 flex items-center justify-center shrink-0">
              <User size={20} className="text-bone/70" />
            </div>
            <div className="text-left flex-1">
              <p className="text-bone font-semibold text-sm">Continuar como invitado</p>
              <p className="text-bone/40 text-xs">Solo explorar, sin guardar datos</p>
            </div>
            <ArrowRight size={18} className="text-bone/30" />
          </button>

          {/* Google */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center gap-3 bg-card/60 border border-white/10 hover:border-ember/40 rounded-2xl p-4 transition-all hover:scale-[1.02]"
          >
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
              <GoogleIcon className="w-5 h-5" />
            </div>
            <div className="text-left flex-1">
              <p className="text-bone font-semibold text-sm">Entrar con Google</p>
              <p className="text-bone/40 text-xs">Guardamos tus datos para próximos pedidos</p>
            </div>
            <ArrowRight size={18} className="text-bone/30" />
          </button>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-obsidian px-3 text-bone/30 text-xs font-mono tracking-widest uppercase">Personal del Pecado</span>
            </div>
          </div>

          {/* Email / contraseña */}
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive-foreground text-sm border border-destructive/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 bg-card/40 border border-white/5 rounded-2xl p-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-bone/70 text-xs">Correo</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bone/30" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-obsidian border-white/10 text-bone placeholder:text-bone/30"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-bone/70 text-xs">Contraseña</Label>
                <Link to="/forgot-password" className="text-xs text-ember hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bone/30" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 bg-obsidian border-white/10 text-bone placeholder:text-bone/30"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-ember hover:bg-ember-dark text-obsidian font-bold py-3 rounded-xl transition-all ember-glow disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <Flame size={18} />
                  Entrar al altar
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-bone/30 text-xs mt-8">
          ¿Eres nuevo?{" "}
          <Link to="/register" className="text-ember hover:underline font-medium">
            Crea tu cuenta
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
