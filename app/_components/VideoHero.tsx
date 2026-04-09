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
        <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] rounded-full bg-[#667eea]/15 blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-[#764ba2]/12 blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-[#667eea]/8 blur-[180px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      {/* Floating words */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { text: 'AUTOMATIZACIÓN', x: '10%', y: '20%', delay: '0s' },
          { text: 'MT5', x: '85%', y: '15%', delay: '0.5s' },
          { text: 'BACKTESTING', x: '5%', y: '70%', delay: '1s' },
          { text: 'TRADING', x: '80%', y: '75%', delay: '1.5s' },
          { text: 'ALGORITMOS', x: '70%', y: '35%', delay: '2s' },
          { text: 'METAQUOTES', x: '15%', y: '45%', delay: '2.5s' },
        ].map((word) => (
          <div
            key={word.text}
            className="absolute text-[0.65rem] font-black tracking-[0.3em] text-white/[0.04] select-none"
            style={{
              left: word.x,
              top: word.y,
              animation: `float ${6 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: word.delay,
            }}
          >
            {word.text}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-5 text-center">
        {/* Badge */}
        <div className="mb-8 animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards' }}>
          <span className="inline-flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.25em] uppercase text-[#667eea] px-5 py-2.5 rounded-full border border-[#667eea]/30 bg-[#667eea]/10 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Sistema activo
          </span>
        </div>

        {/* Headline with floating gradient */}
        <h1 className="text-[clamp(2.8rem,8vw,5.5rem)] font-black tracking-tight leading-[1.0] mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}>
          <span className="block bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
            Trading automatizado
          </span>
          <span className="block mt-2 bg-gradient-to-r from-[#667eea] via-[#8b7cf7] to-[#764ba2] bg-clip-text text-transparent">
            de siguiente nivel
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-[1.05rem] text-white/45 max-w-[580px] mx-auto mb-12 leading-relaxed animate-fade-in-up opacity-0" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
          Sistemas de trading, gestión del riesgo e infraestructura de ejecución para traders que operan con estructura y disciplina.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 animate-fade-in-up opacity-0" style={{ animationDelay: '450ms', animationFillMode: 'forwards' }}>
          <Link
            href="/products"
            className="px-10 py-4 rounded-xl bg-[#667eea] text-white font-bold text-[0.95rem] hover:bg-[#5a7fd8] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(102,126,234,0.35)]"
          >
            Ver productos
          </Link>
          <Link
            href="/dashboard"
            className="px-10 py-4 rounded-xl border border-white/15 text-white/75 font-semibold text-[0.95rem] hover:border-white/30 hover:text-white hover:bg-white/5 transition-all"
          >
            Dashboard
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-[500px] mx-auto animate-fade-in-up opacity-0" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
          {[
            { value: '5000+', label: 'Traders activos' },
            { value: '8', label: 'Estrategias' },
            { value: '24/7', label: 'Monitorización' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-[2.2rem] font-black text-white mb-1">{stat.value}</div>
              <div className="text-[0.75rem] text-white/35">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-[250px] bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/50 to-transparent" />
    </section>
  );
}
