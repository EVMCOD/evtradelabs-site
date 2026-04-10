'use client';

import { useState } from 'react';
import Navbar from '../../_components/Navbar';

export default function ConnectMT5Page() {
  const [form, setForm] = useState({
    broker: '',
    server: '',
    login: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/mt5/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al conectar');
        return;
      }

      setSuccess(true);
      setForm({ broker: '', server: '', login: '', password: '' });
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0d1117 100%)' }}>
      <Navbar />
      
      <div className="max-w-xl mx-auto px-5 pt-32 pb-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Conectar cuenta MT5</h1>
          <p className="text-white/40"> vincula tu cuenta de MetaTrader 5 para ver estadísticas en tu dashboard</p>
        </div>

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e]">
            ✅ Cuenta conectada correctamente
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-white/60 text-sm mb-2">Broker</label>
            <input
              type="text"
              value={form.broker}
              onChange={(e) => setForm({ ...form, broker: e.target.value })}
              placeholder="ej: IC Markets, XM, FBS"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#a78bfa]/50 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-2">Servidor</label>
            <input
              type="text"
              value={form.server}
              onChange={(e) => setForm({ ...form, server: e.target.value })}
              placeholder="ej: ICMarketsSC-Demo, RoboForex-Demo"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#a78bfa]/50 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-2">Login (ID de cuenta)</label>
            <input
              type="text"
              value={form.login}
              onChange={(e) => setForm({ ...form, login: e.target.value })}
              placeholder="Tu número de cuenta MT5"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#a78bfa]/50 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-2">Contraseña</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Contraseña de tu cuenta MT5"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#a78bfa]/50 transition-colors"
              required
            />
            <p className="text-white/30 text-xs mt-2">
              🔒 Tu contraseña se almacena encriptada. Solo tu la conoces.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-[#a78bfa] text-white font-semibold hover:bg-[#8b7cf7] transition-colors disabled:opacity-50"
          >
            {loading ? 'Conectando...' : 'Conectar cuenta'}
          </button>
        </form>

        <div className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <h3 className="text-white font-semibold mb-2">¿Cómo encontrar tus datos?</h3>
          <ol className="text-white/40 text-sm space-y-2">
            <li>1. Abre MetaTrader 5</li>
            <li>2. Ve a Archivo → Abrir cuenta</li>
            <li>3. Busca el nombre del broker y servidor</li>
            <li>4. Tu login es tu número de cuenta</li>
            <li>5. La contraseña es la que usas para acceder a la cuenta</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
