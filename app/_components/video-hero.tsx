'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export function VideoHero() {
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background layers */}
      <div className="absolute inset-0 bg-[#0a0a0f]">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#667eea]/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#764ba2]/15 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#667eea]/10 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[#667eea]/50"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
                transform: `translateY(${scrollY * 0.02 * (i % 3 + 1)}px)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-5 text-center">
        {/* Badge */}
        <div className="mb-8 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 text-[0.72rem] font-bold tracking-[0.2em] uppercase text-[#667eea] px-5 py-2.5 rounded-full border border-[#667eea]/30 bg-[#667eea]/10 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Sistema activo
          </span>
        </div>

        {/* Headline */}
        <h1 
          className="text-[clamp(2.8rem,7vw,5rem)] font-black tracking-tight leading-[1.05] mb-6 animate-fade-in-up delay-100"
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}
        >
          <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
            Trading automatizado
          </span>
          <br />
          <span className="bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            de siguiente nivel
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-[1.1rem] text-white/50 max-w-[640px] mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
          Sistemas de trading, gestión del riesgo e infraestructura de ejecución para traders que operan con estructura y disciplina.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up delay-300">
          <Link
            href="/products"
            className="group px-8 py-4 rounded-xl bg-[#667eea] text-white font-bold text-[0.95rem] hover:bg-[#5a7fd8] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(102,126,234,0.4)]"
          >
            Ver productos
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-4 rounded-xl border border-white/20 text-white/80 font-semibold text-[0.95rem] hover:border-white/40 hover:text-white transition-all hover:bg-white/5"
          >
            Acceder al dashboard
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-[600px] mx-auto animate-fade-in-up delay-400">
          {[
            { value: '5000+', label: 'Traders activos' },
            { value: '8', label: 'Estrategias' },
            { value: '24/7', label: 'Monitorización' },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center">
              <div className="text-[2.5rem] font-black text-white mb-1">{stat.value}</div>
              <div className="text-[0.8rem] text-white/40">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-white/40 animate-pulse" />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-[#0a0a0f] to-transparent" />
    </section>
  );
}
