'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function VideoHero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0a0a0f]">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#667eea]/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#764ba2]/15 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#667eea]/10 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-5 text-center">
        <div className="mb-8 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 text-[0.72rem] font-bold tracking-[0.2em] uppercase text-[#667eea] px-5 py-2.5 rounded-full border border-[#667eea]/30 bg-[#667eea]/10">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Sistema activo
          </span>
        </div>

        <h1 className="text-[clamp(2.8rem,7vw,5rem)] font-black tracking-tight leading-[1.05] mb-6 animate-fade-in-up delay-100">
          <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Trading automatizado
          </span>
          <br />
          <span className="bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            de siguiente nivel
          </span>
        </h1>

        <p className="text-[1.1rem] text-white/50 max-w-[640px] mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
          Sistemas de trading, gestión del riesgo e infraestructura de ejecución para traders que operan con estructura y disciplina.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up delay-300">
          <Link href="/products" className="px-8 py-4 rounded-xl bg-[#667eea] text-white font-bold text-[0.95rem] hover:bg-[#5a7fd8] transition-all hover:scale-105">
            Ver productos
          </Link>
          <Link href="/dashboard" className="px-8 py-4 rounded-xl border border-white/20 text-white/80 font-semibold text-[0.95rem] hover:border-white/40 hover:text-white transition-all">
            Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-[600px] mx-auto animate-fade-in-up delay-400">
          {[
            { value: '5000+', label: 'Traders activos' },
            { value: '8', label: 'Estrategias' },
            { value: '24/7', label: 'Monitorización' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-[2.5rem] font-black text-white mb-1">{stat.value}</div>
              <div className="text-[0.8rem] text-white/40">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-[#0a0a0f] to-transparent" />
    </section>
  );
}
