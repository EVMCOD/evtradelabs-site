'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

function MatrixColumn({ x, charSize }: { x: number; charSize: number }) {
  const [chars, setChars] = useState<number[]>([]);
  const [head, setHead] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const length = 20 + Math.floor(Math.random() * 30);
    const initial = Array.from({ length }, () => Math.floor(Math.random() * 10));
    setChars(initial);

    const speed = 80 + Math.random() * 120;

    intervalRef.current = setInterval(() => {
      setHead((h) => {
        if (h >= length + 5) {
          clearInterval(intervalRef.current!);
          return h;
        }
        return h + 1;
      });
      setChars((c) => {
        const updated = [...c];
        if (head < length) {
          updated[head] = Math.floor(Math.random() * 10);
        }
        return updated;
      });
    }, speed);

    return () => clearInterval(intervalRef.current!);
  }, []);

  return (
    <div
      className="absolute top-0 flex flex-col"
      style={{
        left: `${x}%`,
        width: charSize,
        animation: `fadeIn 0.5s ease-out forwards`,
      }}
    >
      {chars.map((digit, i) => {
        const isHead = i === head;
        const isTrail = i > head && i <= head + 4;
        const isFaded = i < head;

        return (
          <span
            key={i}
            className={`${charSize > 14 ? 'text-[0.7rem]' : 'text-[0.6rem]'} font-mono tracking-wider`}
            style={{
              color: isHead
                ? '#ffffff'
                : isTrail
                ? `rgba(102, 126, 234, ${1 - (i - head) * 0.2})`
                : isFaded
                ? 'rgba(102, 126, 234, 0.15)'
                : 'rgba(102, 126, 234, 0.5)',
              textShadow: isHead ? '0 0 8px rgba(102,126,234,0.8)' : 'none',
              lineHeight: '1.4',
            }}
          >
            {digit}
          </span>
        );
      })}
    </div>
  );
}

export function VideoHero() {
  const [mounted, setMounted] = useState(false);
  const [columns, setColumns] = useState<{ x: number; charSize: number }[]>([]);

  useEffect(() => {
    setMounted(true);
    const generated = Array.from({ length: 35 }, (_, i) => ({
      x: (i / 35) * 100 + Math.random() * 2,
      charSize: 10 + Math.random() * 6,
    }));
    setColumns(generated);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0a0a0f]">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-[#667eea]/15 blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#764ba2]/12 blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#667eea]/8 blur-[180px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      {/* Matrix code falling — behind content */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.35] pointer-events-none select-none">
        {columns.map((col, i) => (
          <MatrixColumn key={i} x={col.x} charSize={col.charSize} />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-5 text-center">
        {/* Headline */}
        <h1 className="text-[clamp(2.8rem,8vw,5.5rem)] font-black tracking-tight leading-[1.0] mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}>
          <span className="block bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
            Trading automatizado
          </span>
          <span className="block mt-2 bg-gradient-to-r from-[#667eea] via-[#8b7cf7] to-[#764ba2] bg-clip-text text-transparent">
            de siguiente nivel
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-[1.05rem] text-white/45 max-w-[580px] mx-auto mb-12 leading-relaxed animate-fade-in-up opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
          Sistemas de trading, gestión del riesgo e infraestructura de ejecución para traders que operan con estructura y disciplina.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 animate-fade-in-up opacity-0" style={{ animationDelay: '550ms', animationFillMode: 'forwards' }}>
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
        <div className="grid grid-cols-3 gap-6 max-w-[500px] mx-auto animate-fade-in-up opacity-0" style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}>
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
