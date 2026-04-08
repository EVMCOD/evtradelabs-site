'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Completa todos los campos');
      return;
    }
    setLoading(true);
    setError('');
    
    // Demo mode — simulates login
    setTimeout(() => {
      if (email.includes('@') && password.length >= 4) {
        window.location.href = '/account';
      } else {
        setError('Email o contraseña incorrectos');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <main className="shell">
      <div className="wrap stack page-gap-lg max-w-[400px] mx-auto py-12">
        <div className="text-center">
          <h1 className="h1">Iniciar sesión</h1>
          <p className="p text-white/50 mt-2">
            Accede a tu cuenta y gestiona tus licencias.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card card-strong space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[0.88rem]">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[0.82rem] font-semibold text-white/70 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white text-[0.95rem] placeholder:text-white/25 focus:border-[#667eea] focus:outline-none focus:ring-1 focus:ring-[#667eea]/50 transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[0.82rem] font-semibold text-white/70">Contraseña</label>
              <Link href="/forgot-password" className="text-[0.78rem] text-[#667eea] hover:underline">
                ¿Olvidaste la contraseña?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white text-[0.95rem] placeholder:text-white/25 focus:border-[#667eea] focus:outline-none focus:ring-1 focus:ring-[#667eea]/50 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#667eea] text-white font-bold text-[0.95rem] hover:bg-[#5a7fd8] transition-colors disabled:opacity-60"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="text-center text-[0.88rem] text-white/50">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-[#667eea] font-semibold hover:underline">
            Regístrate
          </Link>
        </p>

        <div className="text-center p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <p className="text-[0.78rem] text-white/30">
            Demo: usa cualquier email válido y contraseña de 4+ caracteres
          </p>
        </div>
      </div>
    </main>
  );
}
