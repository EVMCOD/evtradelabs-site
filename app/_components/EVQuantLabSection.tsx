'use client'

import { Card3DHover, ScrollReveal, MagneticButton } from "@/components/ui/premium-effects"
import Link from "next/link"

const features = [
  {
    icon: "🎨",
    title: "Visual Strategy Builder",
    desc: "Drag & drop blocks para construir estrategias sin código. Indicadores, price action, sesiones, filtros, riesgo y ejecución.",
  },
  {
    icon: "🔬",
    title: "Backtest Engine",
    desc: "Tick data nativo con auto-resample a cualquier timeframe. Métricas: Sharpe, CAGR, Max DD, Win Rate, VaR.",
  },
  {
    icon: "🧬",
    title: "Genetic Algorithm",
    desc: "Discovery automático de estrategias. 4 arquetipos, 14 genes por cromosoma, Hall of Fame con export a builder.",
  },
  {
    icon: "📊",
    title: "Walk-Forward Analysis",
    desc: "Validación robusta con métodos anchored, rolling y hybrid. Robustness score 0-100.",
  },
  {
    icon: "💼",
    title: "Portfolio Lab",
    desc: "Multi-estrategy backtesting. Weighting schemes: equal, risk parity, max sharpe, min variance.",
  },
  {
    icon: "🤖",
    title: "ML Lab",
    desc: "Auto-feature engineering (2000+ features), regime detection con HMM y K-means.",
  },
  {
    icon: "⚡",
    title: "Advanced Execution",
    desc: "Algoritmos: TWAP, VWAP, Iceberg, Adaptive. Smart order routing y post-trade TCA.",
  },
  {
    icon: "🛡️",
    title: "Risk Management",
    desc: "6 métodos de position sizing: fixed, Kelly, Optimal f, risk parity, vol targeting.",
  },
  {
    icon: "📡",
    title: "Live Trading",
    desc: "Brokers: Oanda, Interactive Brokers, Alpaca, Binance. Paper y Live modes.",
  },
]

const stats = [
  { value: "50+", label: "Estrategias built-in" },
  { value: "100%", label: "Local (tu máquina)" },
  { value: "2000+", label: "Features disponibles" },
  { value: "0€", label: "Coste de datos" },
]

export default function EVQuantLabSection() {
  return (
    <section id="ev-quant-lab" className="section-shell py-24 bg-transparent">
      <div className="w-full max-w-[1200px] mx-auto px-5">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-[#10b981] mb-4 px-4 py-1.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/20">
              Aplicación de escritorio
            </span>
            <h2 className="m-0 text-[clamp(2rem,4.5vw,3.2rem)] font-black leading-[1.02] tracking-[-0.05em] text-white text-balance max-w-[800px] mx-auto">
              EV Quant Lab — Tu estación de trading cuantitativo
            </h2>
            <p className="mt-6 text-[1rem] leading-[1.85] text-[#9fb2d4] max-w-[680px] mx-auto">
              Construye, valida y optimiza estrategias de trading como un profesional. 
              100% local en tu máquina — sin cloud, sin costes de datos, sin dependencias.
            </p>
          </div>
        </ScrollReveal>

        {/* Stats Bar */}
        <ScrollReveal animation="fadeInUp">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-16 py-6 px-8 rounded-2xl bg-[rgba(16,185,129,0.05)] border border-[#10b981]/20">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black text-[#10b981]">{stat.value}</div>
                <div className="text-xs text-[#8da0c2] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} animation="fadeInUp" delay={i * 50}>
              <Card3DHover intensity={4}>
                <div className="reveal-card p-6 h-full rounded-2xl border border-white/10 bg-[rgba(17,26,45,0.5)] backdrop-blur-sm transition-all duration-400 hover:bg-[rgba(17,26,45,0.7)] hover:border-[#10b981]/30">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-[1rem] font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-[0.88rem] leading-[1.75] text-[#8da0c2] m-0">{feature.desc}</p>
                </div>
              </Card3DHover>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA Section */}
        <ScrollReveal animation="scaleIn">
          <div className="mt-16 rounded-[28px] border border-[#10b981]/30 bg-gradient-to-br from-[#10b981]/10 to-transparent p-8 md:p-12 text-center">
            <h3 className="text-[clamp(1.5rem,3vw,2.2rem)] font-black tracking-[-0.04em] text-white mb-4">
              ¿Listo para operar con estructura?
            </h3>
            <p className="text-[0.95rem] leading-[1.8] text-[#9fb2d4] max-w-[560px] mx-auto mb-8">
              Descarga EV Quant Lab y empieza a construir estrategias robustas hoy. 
              Compatible con Windows y Mac.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticButton href="#contacto" variant="primary" size="lg">
                Descargar EV Quant Lab
              </MagneticButton>
              <MagneticButton href="#faq" variant="secondary" size="lg">
                Ver documentación
              </MagneticButton>
            </div>
          </div>
        </ScrollReveal>

        {/* Integration Note */}
        <ScrollReveal animation="fadeInUp">
          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
            <div className="text-[#8da0c2] text-sm">
              ¿Ya tienes estrategias en MT5? Conecta tu terminal:
            </div>
            <div className="flex gap-3">
              <Link 
                href="#metatrader" 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#667eea]/20 text-[#667eea] text-sm font-medium hover:bg-[#667eea]/30 transition-colors"
              >
                <span>MT5 Bridge</span>
              </Link>
              <Link 
                href="#comunidad" 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-[#8da0c2] text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Comunidad
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
