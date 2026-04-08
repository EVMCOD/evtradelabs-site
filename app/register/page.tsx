'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Completa todos los campos');
      return;
    }
    if (!acceptTerms) {
      setError('Debes aceptar los términos');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    setError('');

    // Demo mode
    setTimeout(() => {
      window.location.href = '/account';
    }, 800);
  };

  return (
    <main className="shell">
      <div className="wrap stack page-gap-lg max-w-[400px] mx-auto py-12">
        <div className="text-center">
          <h1 className="h1">Crear cuenta</h1>
          <p className="p text-white/50 mt-2">
            Regístrate para acceder a licencias y descargas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card card-strong space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[0.88rem]">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[0.82rem] font-semibold text-white/70 mb-2">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white text-[0.95rem] placeholder:text-white/25 focus:border-[#667eea] focus:outline-none focus:ring-1 focus:ring-[#667eea]/50 transition-all"
            />
          </div>

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
            <label className="block text-[0.82rem] font-semibold text-white/70 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white text-[0.95rem] placeholder:text-white/25 focus:border-[#667eea] focus:outline-none focus:ring-1 focus:ring-[#667eea]/50 transition-all"
            />
          </div>

          <div>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/[0.05] text-[#667eea] cursor-pointer"
              />
              <span className="text-[0.82rem] text-white/60 leading-relaxed">
                Acepto los{' '}
                <Link href="/terms" className="text-[#667eea] hover:underline">términos y condiciones</Link>
                {' '}y la{' '}
                <Link href="/privacy" className="text-[#667eea] hover:underline">política de privacidad</Link>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#667eea] text-white font-bold text-[0.95rem] hover:bg-[#5a7fd8] transition-colors disabled:opacity-60"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-[0.88rem] text-white/50">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-[#667eea] font-semibold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
