import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Replicador — Copy trading para MT5 | EV Trading Labs",
  description: "Replica operaciones de una cuenta master a múltiples followers en tiempo real. Control total de lotajes, riesgo y filtros con protección daily loss.",
};

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Conecta el Master",
    desc: "Instala el EA en tu cuenta master. Todas las operaciones que abras se transmiten en tiempo real.",
    color: "#a78bfa",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    step: "02",
    title: "Configura los Followers",
    desc: "Define el ratio de lotaje, límites de riesgo y filtros por símbolo para cada cuenta follower.",
    color: "#60a5fa",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="7" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="14" y="6" width="7" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    step: "03",
    title: "Opera con sincronía",
    desc: "Cada operación del master se replica instantáneamente en todos los followers con tu configuración de riesgo.",
    color: "#4ade80",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 4v16M4 8l8-4 8 4M4 12l8 4 8-4M4 16l8 4 8-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

const FEATURES = [
  { name: "Replicación en tiempo real", desc: "Latencia inferior a 50ms entre master y followers. Sin retrasos visibles.", color: "#4ade80" },
  { name: "Ratio de lotaje personalizable", desc: "Multiplica o divide el volumen por cuenta. Cada follower con su propio ratio.", color: "#a78bfa" },
  { name: "Risk profiles por cuenta", desc: "Define el riesgo máximo por operación y diario para cada follower de forma independiente.", color: "#60a5fa" },
  { name: "Protección daily loss", desc: "El replicador para de operar automáticamente si un follower alcanza su límite de pérdida diaria.", color: "#f87171" },
  { name: "Filtros por símbolo", desc: "Excluye o incluye símbolos específicos por follower. Replica solo lo que quieras.", color: "#f59e0b" },
  { name: "Soporte multi-broker", desc: "Master y followers pueden estar en brokers diferentes. Funciona con cualquier servidor MT5.", color: "#34d399" },
];

export default function ReplicadorPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">

      {/* Hero */}
      <section className="pt-32 pb-20 px-5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-1/3 w-[600px] h-[400px] rounded-full opacity-10"
            style={{ background: "radial-gradient(ellipse, #4ade80 0%, transparent 70%)", filter: "blur(80px)" }} />
        </div>
        <div className="max-w-[1100px] mx-auto relative">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Link href="/products" className="text-white/40 text-sm hover:text-white transition-colors">← Productos</Link>
            <span className="text-white/20">·</span>
            <span className="px-3 py-1 rounded-full text-[0.7rem] font-bold tracking-widest uppercase text-[#4ade80] border border-[#4ade80]/30 bg-[#4ade80]/10">COPY TRADING</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-[clamp(2.4rem,5vw,3.8rem)] font-black tracking-tight leading-[1.05] mb-5">
                Replicador
                <br />
                <span style={{ background: "linear-gradient(135deg, #4ade80, #34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Una cuenta. Múltiples cuentas.
                </span>
              </h1>
              <p className="text-white/55 text-[1.05rem] leading-relaxed mb-8 max-w-[480px]">
                Opera desde una cuenta master y replica cada movimiento a todas tus cuentas follower en tiempo real. Control total del riesgo en cada una.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/checkout?product=replicador"
                  className="px-7 py-3.5 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #4ade80, #22c55e)", color: "#0a0a0f", boxShadow: "0 8px 30px rgba(74,222,128,0.25)" }}>
                  Suscribirse — €18.99/mes
                </Link>
              </div>
            </div>

            {/* Visual: master → followers */}
            <div className="relative py-8">
              {/* Master */}
              <div className="flex justify-center mb-6">
                <div className="rounded-2xl px-6 py-4 text-center w-48"
                  style={{ background: "linear-gradient(135deg, rgba(74,222,128,0.15), rgba(34,197,94,0.05))", border: "1px solid rgba(74,222,128,0.3)" }}>
                  <div className="text-[0.65rem] text-[#4ade80] uppercase tracking-widest mb-1">MASTER</div>
                  <div className="font-black text-white text-sm">IC Markets #12345</div>
                  <div className="text-[#4ade80] text-xs mt-1 font-semibold">● Live</div>
                </div>
              </div>

              {/* Connector */}
              <div className="flex justify-center mb-6">
                <div className="flex flex-col items-center gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="w-[2px] h-3 rounded-full" style={{ background: `rgba(74,222,128,${0.8 - i * 0.15})` }} />
                  ))}
                  <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                    <path d="M8 10L0 0h16L8 10z" fill="rgba(74,222,128,0.5)" />
                  </svg>
                </div>
              </div>

              {/* Followers */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Follower 1", broker: "Vantage #87654", ratio: "×1.0", color: "#a78bfa" },
                  { label: "Follower 2", broker: "FTMO #11223", ratio: "×0.5", color: "#60a5fa" },
                  { label: "Follower 3", broker: "VT Markets #44567", ratio: "×2.0", color: "#f59e0b" },
                ].map((f) => (
                  <div key={f.label} className="rounded-xl p-3 text-center"
                    style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${f.color}25` }}>
                    <div className="text-[0.6rem] uppercase tracking-widest mb-1" style={{ color: f.color }}>{f.label}</div>
                    <div className="font-bold text-white text-[0.72rem] mb-1">{f.broker}</div>
                    <div className="text-[0.65rem] text-white/40">Ratio {f.ratio}</div>
                  </div>
                ))}
              </div>

              {/* Pulse */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-3 h-3 rounded-full animate-ping" style={{ background: "rgba(74,222,128,0.4)" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-5">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-14">
            <span className="text-[0.7rem] font-bold tracking-[0.25em] uppercase text-[#667eea] mb-3 block">Cómo funciona</span>
            <h2 className="text-[2rem] font-black tracking-tight">En 3 pasos</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="rounded-2xl p-8 text-center"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                  style={{ background: `${step.color}15`, border: `1px solid ${step.color}30`, color: step.color }}>
                  {step.icon}
                </div>
                <div className="text-[0.65rem] font-mono text-white/25 mb-2">{step.step}</div>
                <h3 className="font-bold text-white text-[1rem] mb-3">{step.title}</h3>
                <p className="text-white/45 text-[0.83rem] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-5">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-[2rem] font-black tracking-tight">Control total del riesgo</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.name} className="group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-8 h-[3px] rounded-full mb-4" style={{ background: f.color }} />
                <h3 className="font-bold text-white text-[0.95rem] mb-2">{f.name}</h3>
                <p className="text-white/45 text-[0.82rem] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-5">
        <div className="max-w-[480px] mx-auto">
          <div className="rounded-2xl p-8"
            style={{ background: "linear-gradient(135deg, rgba(74,222,128,0.10), rgba(34,197,94,0.04))", border: "1px solid rgba(74,222,128,0.25)" }}>
            <div className="text-[0.75rem] text-white/40 uppercase tracking-wider mb-2">Plan mensual</div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-[3rem] font-black text-white">€18.99</span>
              <span className="text-white/40">/mes</span>
            </div>
            <p className="text-white/45 text-sm mb-6 leading-relaxed">
              Hasta 3 cuentas follower. Replicación en tiempo real. Cancela cuando quieras.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "1 cuenta master",
                "Hasta 3 cuentas follower",
                "Replicación en tiempo real",
                "Risk profiles individuales",
                "Protección daily loss",
                "Soporte multi-broker",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-white/65">
                  <span className="text-[#4ade80] text-xs">✓</span>{f}
                </li>
              ))}
            </ul>
            <Link href="/checkout?product=replicador"
              className="block w-full text-center py-4 rounded-xl font-bold text-[#0a0a0f] transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #4ade80, #22c55e)", boxShadow: "0 8px 30px rgba(74,222,128,0.25)" }}>
              Suscribirse — €18.99/mes
            </Link>
            <p className="text-center text-white/25 text-xs mt-4">¿Necesitas más de 3 followers? <a href="mailto:contact@evtradelabs.com" className="text-white/40 hover:text-white/60 underline">Contáctanos</a></p>
          </div>
        </div>
      </section>
    </main>
  );
}
