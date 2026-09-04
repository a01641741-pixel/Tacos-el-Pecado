import { useState } from 'react';
import { useNavigate, useSearchParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Flame, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { Button } from '@/components/ui/button';

const ETA_OPTIONS = [10, 15, 20, 30, 45];

export default function Ordenar() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setChannel, setEtaMinutes, setArrivalStatus } = useCart();
  const channel = params.get('channel');
  const [eta, setEta] = useState(null);
  const [alreadyHere, setAlreadyHere] = useState(false);

  if (!channel || !['comer_en_lugar', 'para_llevar'].includes(channel)) {
    return <Navigate to="/" replace />;
  }

  const title = channel === 'comer_en_lugar' ? 'Comer en el lugar' : 'Para llevar';

  const handleEta = (minutes) => {
    setEta(minutes);
    setAlreadyHere(false);
  };

  const handleAlreadyHere = () => {
    setAlreadyHere(true);
    setEta(null);
  };

  const handleContinue = () => {
    setChannel(channel);
    if (alreadyHere) {
      setArrivalStatus('ya_estoy_aqui');
      setEtaMinutes(null);
    } else if (eta) {
      setEtaMinutes(eta);
      setArrivalStatus(null);
    }
    navigate('/menu');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 pt-28 pb-20 grain">
      <div className="max-w-xl w-full">
        <Link to="/" className="inline-flex items-center gap-2 text-bone/50 hover:text-ember transition-colors text-sm mb-8">
          <ArrowLeft size={16} /> Volver
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-ember/15 flex items-center justify-center">
              <Clock className="w-5 h-5 text-ember" />
            </div>
            <span className="text-gold text-xs font-mono tracking-widest uppercase">{title}</span>
          </div>
          <h1 className="font-display font-black text-bone text-4xl sm:text-5xl tracking-tight">
            ¿En cuánto <span className="text-ember italic">llegas</span>?
          </h1>
          <p className="text-bone/50 text-lg mt-4">
            Para tener listo tu pedido a tiempo.
          </p>

          <div className="mt-10 space-y-4">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {ETA_OPTIONS.map((m) => (
                <button
                  key={m}
                  onClick={() => handleEta(m)}
                  className={`py-5 rounded-2xl border-2 font-display font-bold text-lg transition-all focus-ember ${
                    eta === m && !alreadyHere
                      ? 'border-ember bg-ember/10 text-ember'
                      : 'border-white/10 text-bone/60 hover:border-white/30'
                  }`}
                >
                  {m}
                  <span className="block text-xs font-mono font-normal mt-1">min</span>
                </button>
              ))}
            </div>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-4 text-bone/30 text-xs uppercase tracking-wider">o</span>
              </div>
            </div>

            <button
              onClick={handleAlreadyHere}
              className={`w-full py-5 rounded-2xl border-2 font-display font-bold text-lg transition-all focus-ember flex items-center justify-center gap-2 ${
                alreadyHere
                  ? 'border-ember bg-ember/10 text-ember'
                  : 'border-white/10 text-bone/60 hover:border-white/30'
              }`}
            >
              <Flame size={20} />
              Ya estoy aquí, ¡ordenar ya!
            </button>
          </div>

          <div className="mt-10">
            <Button
              onClick={handleContinue}
              disabled={!eta && !alreadyHere}
              className="w-full bg-ember hover:bg-ember-dark text-obsidian font-bold rounded-full py-6 text-lg disabled:opacity-40"
            >
              Elegir del menú <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
