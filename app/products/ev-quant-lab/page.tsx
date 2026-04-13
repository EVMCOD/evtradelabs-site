import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EV Quant Lab — Plataforma de trading cuantitativo | EV Trading Labs",
  description: "Construye, valida y optimiza estrategias de trading. Backtesting con tick data, Walk-Forward Analysis, ML Lab y ejecución en vivo. 100% local.",
};

const FEATURES = [
  { icon: "⚡", name: "Visual Strategy Builder", desc: "Construye estrategias con bloques visuales sin escribir código. Conecta condiciones, filtros y salidas con drag & drop.", color: "#a78bfa" },
  { icon: "📊", name: "Backtest Engine", desc: "Backtesting de alta fidelidad con tick data real. Modela el spread, slippage y comisiones con precisión milimétrica.", color: "#60a5fa" },
  { icon: "🧬", name: "Genetic Algorithm", desc: "Optimización automática de parámetros por algoritmo genético. Encuentra las configuraciones óptimas sin fuerza bruta.", color: "#4ade80" },
  { icon: "🔄", name: "Walk-Forward Analysis", desc: "Valida la robustez de tu estrategia con análisis walk-forward. Detecta overfitting antes de poner dinero real.", color: "#f59e0b" },
  { icon: "📦", name: "Portfolio Lab", desc: "Combina múltiples estrategias en un portfolio optimizado. Correlación, diversificación y análisis de drawdown conjunto.", color: "#f472b6" },
  { icon: "🤖", name: "ML Lab", desc: "Integra modelos de machine learning en tu pipeline de trading. Clasificación, regresión y señales predictivas.", color: "#38bdf8" },
  { icon: "🎯", name: "Advanced Execution", desc: "Órdenes TWAP, VWAP, iceberg y participación de volumen. Ejecuta como un fondo, no como un retail.", color: "#a78bfa" },
  { icon: "🔗", name: "Live Trading", desc: "Conecta con Oanda, Interactive Brokers, Alpaca y Binance. De la investigación al mercado real con un click.", color: "#4ade80" },
];

const WORKFLOW = [
  { step: "01", title: "Investiga", desc: "Importa datos históricos, analiza el mercado y genera hipótesis basadas en datos.", color: "#60a5fa" },
  { step: "02", title: "Construye", desc: "Diseña tu estrategia con el builder visual o en código Python/Pine.", color: "#a78bfa" },
  { step: "03", title: "Valida", desc: "Backtest con tick data, Walk-Forward Analysis y Monte Carlo para garantizar robustez.", color: "#4ade80" },
  { step: "04", title: "Optimiza", desc: "Algoritmo genético + análisis de sensibilidad para los parámetros óptimos.", color: "#f59e0b" },
  { step: "05", title: "Despliega", desc: "Live trading directo desde la plataforma. Sin dependencias de terceros.", color: "#f472b6" },
];

export default function EVQuantLabPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">

      {/* Hero */}
      <section className="pt-32 pb-20 px-5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[500px] h-[400px] rounded-full opacity-10"
            style={{ background: "radial-gradient(ellipse, #60a5fa 0%, transparent 70%)", filter: "blur(80px)" }} />
          <div className="absolute top-10 right-1/4 w-[400px] h-[300px] rounded-full opacity-8"
            style={{ background: "radial-gradient(ellipse, #a78bfa 0%, transparent 70%)", filter: "blur(80px)" }} />
        </div>
        <div className="max-w-[1100px] mx-auto relative">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Link href="/products" className="text-white/40 text-sm hover:text-white transition-colors">← Productos</Link>
            <span className="text-white/20">·</span>
            <span className="px-3 py-1 rounded-full text-[0.7rem] font-bold tracking-widest uppercase text-[#60a5fa] border border-[#60a5fa]/30 bg-[#60a5fa]/10">QUANT RESEARCH</span>
          </div>

          <div className="max-w-[700px] mb-12">
            <h1 className="text-[clamp(2.4rem,5vw,3.8rem)] font-black tracking-tight leading-[1.05] mb-5">
              EV Quant Lab
              <br />
              <span style={{ background: "linear-gradient(135deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Tu estación cuantitativa
              </span>
            </h1>
            <p className="text-white/55 text-[1.05rem] leading-relaxed mb-8">
              Todo lo que un quant trader necesita en una sola plataforma. Investigación, backtesting de alta fidelidad, optimización y ejecución en vivo. 100% local. Sin coste de datos.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/checkout?product=ev-quant-lab"
                className="px-7 py-3.5 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #60a5fa, #a78bfa)", boxShadow: "0 8px 30px rgba(96,165,250,0.3)" }}>
                Suscribirse — €99.99/mes
              </Link>
              <Link href="/local-app"
                className="px-7 py-3.5 rounded-xl font-bold text-white/70 border border-white/10 hover:border-white/25 hover:text-white transition-all flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v8M3 5l4 4 4-4M1 11h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Descargar gratis
              </Link>
              <Link href="/checkout?product=ev-quant-lab&plan=lifetime"
                className="px-7 py-3.5 rounded-xl font-bold text-white/60 hover:text-white transition-all text-sm">
                Lifetime — €399
              </Link>
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-4">
            {[
              { label: "100% Local", icon: "🔒" },
              { label: "Sin coste de datos", icon: "📡" },
              { label: "Windows · macOS · Linux", icon: "💻" },
              { label: "8+ fuentes de datos", icon: "📊" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 px-4 py-2 rounded-xl text-[0.82rem] text-white/50"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="py-20 px-5">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-14">
            <span className="text-[0.7rem] font-bold tracking-[0.25em] uppercase text-[#667eea] mb-3 block">Workflow</span>
            <h2 className="text-[2rem] font-black tracking-tight">Del dato a la ejecución</h2>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-[1px]"
              style={{ background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.3), rgba(96,165,250,0.3), transparent)" }} />

            <div className="grid md:grid-cols-5 gap-4">
              {WORKFLOW.map((w) => (
                <div key={w.step} className="relative text-center">
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-lg font-black relative z-10"
                    style={{ background: `${w.color}15`, border: `1px solid ${w.color}35`, color: w.color }}>
                    {w.step}
                  </div>
                  <h3 className="font-bold text-white text-[0.95rem] mb-2">{w.title}</h3>
                  <p className="text-white/40 text-[0.78rem] leading-relaxed">{w.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-5">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-14">
            <span className="text-[0.7rem] font-bold tracking-[0.25em] uppercase text-[#667eea] mb-3 block">Funcionalidades</span>
            <h2 className="text-[2rem] font-black tracking-tight">Todo lo que necesitas</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <div key={f.name} className="group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="text-2xl mb-4">{f.icon}</div>
                <div className="w-8 h-[3px] rounded-full mb-3 transition-all duration-300 group-hover:w-12"
                  style={{ background: f.color }} />
                <h3 className="font-bold text-white text-[0.92rem] mb-2">{f.name}</h3>
                <p className="text-white/40 text-[0.78rem] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local first */}
      <section className="py-20 px-5">
        <div className="max-w-[1100px] mx-auto">
          <div className="rounded-2xl p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div>
              <span className="text-[0.7rem] font-bold tracking-[0.25em] uppercase text-[#60a5fa] mb-3 block">Local First</span>
              <h2 className="text-[1.8rem] font-black tracking-tight mb-5">Tus datos. Tu máquina. Tu control.</h2>
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                EV Quant Lab corre 100% en local. No hay servers externos con tus estrategias. No hay suscripciones a proveedores de datos. Descarga datos históricos una vez y úsalos para siempre.
              </p>
              <div className="space-y-3">
                {[
                  "Datos históricos en local (Dukascopy, Yahoo, IBKR...)",
                  "Estrategias almacenadas solo en tu máquina",
                  "Sin latencia de red en backtesting",
                  "Exporta resultados a CSV/Excel",
                  "API abierta para integraciones propias",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm text-white/65">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#60a5fa", boxShadow: "0 0 6px rgba(96,165,250,0.6)" }} />
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl p-6" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "monospace" }}>
              <div className="flex gap-1.5 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              {[
                { text: "$ ev-quant run --strategy momentum_v3", color: "#e2e8f0" },
                { text: "  ✓ Loading tick data... 2.4M bars", color: "#4ade80" },
                { text: "  ✓ Running backtest... 100%", color: "#4ade80" },
                { text: "  ─────────────────────────────", color: "#4b5563" },
                { text: "  Net Profit:    +$12,847.30", color: "#4ade80" },
                { text: "  Win Rate:       68.4%", color: "#4ade80" },
                { text: "  Profit Factor:  2.31", color: "#4ade80" },
                { text: "  Max Drawdown:  -8.32%", color: "#f87171" },
                { text: "  Sharpe Ratio:   2.87", color: "#60a5fa" },
              ].map((line, i) => (
                <div key={i} className="text-[0.75rem] leading-relaxed" style={{ color: line.color }}>{line.text}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-5">
        <div className="max-w-[700px] mx-auto text-center">
          <h2 className="text-[2rem] font-black tracking-tight mb-12">Elige tu plan</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                name: "Mensual",
                price: "€99.99",
                period: "/mes",
                desc: "Acceso completo a todas las funcionalidades. Cancela cuando quieras.",
                features: ["Todas las funcionalidades", "Actualizaciones continuas", "Soporte prioritario", "Descarga ilimitada de datos"],
                cta: "Suscribirse",
                href: "/checkout?product=ev-quant-lab",
                highlight: false,
              },
              {
                name: "Lifetime",
                price: "€399",
                period: " pago único",
                desc: "Acceso de por vida. Sin pagos recurrentes.",
                features: ["Todo lo del plan mensual", "Licencia permanente", "Actualizaciones de por vida", "Acceso anticipado a nuevas features"],
                cta: "Comprar Lifetime",
                href: "/checkout?product=ev-quant-lab&plan=lifetime",
                highlight: true,
              },
            ].map((plan) => (
              <div key={plan.name} className="rounded-2xl p-7 text-left relative"
                style={{
                  background: plan.highlight ? "linear-gradient(135deg, rgba(96,165,250,0.12), rgba(167,139,250,0.06))" : "rgba(255,255,255,0.03)",
                  border: plan.highlight ? "1px solid rgba(96,165,250,0.3)" : "1px solid rgba(255,255,255,0.07)",
                }}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[0.65rem] font-black uppercase tracking-wider text-white"
                    style={{ background: "linear-gradient(135deg, #60a5fa, #a78bfa)" }}>
                    Mejor valor
                  </div>
                )}
                <div className="mb-5">
                  <div className="text-[0.75rem] text-white/40 uppercase tracking-wider mb-1">{plan.name}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[2.2rem] font-black text-white">{plan.price}</span>
                    <span className="text-white/40 text-sm">{plan.period}</span>
                  </div>
                  <p className="text-white/40 text-[0.8rem] mt-2 leading-relaxed">{plan.desc}</p>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[0.82rem] text-white/65">
                      <span className="text-[#4ade80] text-xs">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}
                  className="block w-full text-center py-3 rounded-xl font-bold text-sm transition-all"
                  style={plan.highlight
                    ? { background: "linear-gradient(135deg, #60a5fa, #a78bfa)", color: "#fff", boxShadow: "0 6px 24px rgba(96,165,250,0.3)" }
                    : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }
                  }>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
