import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EV Métricas — Analítica de trading profesional | EV Trading Labs",
  description: "Conecta tu cuenta MT5 y visualiza tus métricas de trading en tiempo real: equity curve, P&L mensual, heatmap de sesiones, desglose por símbolo y estadísticas completas.",
};

/* ─── Demo preview data (shown as mockup) ────────────────── */

const PREVIEW_STATS = [
  { label: "Balance", value: "€24 847", color: "#a78bfa" },
  { label: "Gain", value: "+68.4%", color: "#4ade80" },
  { label: "Profit Factor", value: "2.31", color: "#60a5fa" },
  { label: "Win Rate", value: "61.8%", color: "#f59e0b" },
  { label: "Drawdown", value: "6.2%", color: "#f87171" },
  { label: "Trades", value: "847", color: "#34d399" },
];

const PREVIEW_MONTHLY = [
  { m: "E", v: 3.2, pos: true }, { m: "F", v: -1.4, pos: false },
  { m: "M", v: 6.1, pos: true }, { m: "A", v: 2.2, pos: true },
  { m: "M", v: -0.9, pos: false }, { m: "J", v: 4.7, pos: true },
  { m: "J", v: 6.5, pos: true }, { m: "A", v: -2.2, pos: false },
  { m: "S", v: 5.8, pos: true }, { m: "O", v: 7.0, pos: true },
  { m: "N", v: 2.5, pos: true }, { m: "D", v: 4.2, pos: true },
];

// Mini equity sparkline points
const SPARKLINE = [
  14800, 15400, 15100, 16100, 15900, 16800, 17600, 17200, 18200,
  18000, 19100, 18800, 19800, 20600, 20000, 21100, 21800, 22200,
  22800, 23500, 24000, 24600, 24200, 24847,
];

function buildSparkline(pts: number[], w: number, h: number): string {
  const min = Math.min(...pts), max = Math.max(...pts);
  const range = max - min || 1;
  return pts.map((v, i) => {
    const x = (i / (pts.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Equity Curve en tiempo real",
    desc: "Visualiza la evolución de tu balance desde el primer día. Detecta drawdowns y racha ganadoras de un vistazo.",
    color: "#667eea",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M3 9h18M9 4v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "P&L Mensual",
    desc: "Calendario de resultados mes a mes. Identifica qué meses son consistentes y cuáles requieren ajustes.",
    color: "#4ade80",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    title: "Heatmap de Sesiones",
    desc: "¿A qué horas y días operas mejor? El heatmap muestra tu rendimiento por hora y sesión de mercado.",
    color: "#f59e0b",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 3v9l5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Desglose por Símbolo",
    desc: "Profit factor, win rate y P&L por par. Saber qué símbolos te dan edge y cuáles te drenan capital.",
    color: "#a78bfa",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M7 16l4-6 4 3 4-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Estadísticas avanzadas",
    desc: "Profit factor, expectativa, ratio riesgo/recompensa, rachas máximas y tiempo medio por trade.",
    color: "#34d399",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Enlace público compartible",
    desc: "Genera un link verificado de tu cuenta para compartir con inversores, fondos o tu comunidad.",
    color: "#60a5fa",
  },
];

export default function MetricasLandingPage() {
  const sparkCoords = buildSparkline(SPARKLINE, 280, 70);
  const fillPath = `M 0,70 L ${sparkCoords} L 280,70 Z`;
  const linePath = `M ${sparkCoords}`;

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">

      {/* Hero */}
      <section className="pt-32 pb-20 px-5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-8"
            style={{ background: "radial-gradient(ellipse, #667eea 0%, transparent 70%)", filter: "blur(100px)" }} />
        </div>
        <div className="max-w-[1100px] mx-auto relative">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Link href="/products" className="text-white/40 text-sm hover:text-white transition-colors">← Productos</Link>
            <span className="text-white/20">·</span>
            <span className="px-3 py-1 rounded-full text-[0.7rem] font-bold tracking-widest uppercase text-[#667eea] border border-[#667eea]/30 bg-[#667eea]/10">ANALÍTICA</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-[clamp(2.4rem,5vw,3.8rem)] font-black tracking-tight leading-[1.05] mb-5">
                EV Métricas
                <br />
                <span style={{ background: "linear-gradient(135deg, #667eea, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Tu cuenta. Tus datos.
                </span>
              </h1>
              <p className="text-white/55 text-[1.05rem] leading-relaxed mb-8 max-w-[480px]">
                Conecta tu cuenta MT5 y obtén un análisis completo de tu trading: equity curve, P&L mensual, heatmap de sesiones, desglose por símbolo y estadísticas avanzadas en un panel profesional.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/checkout?product=metricas"
                  className="px-7 py-3.5 rounded-xl font-bold transition-all hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff", boxShadow: "0 8px 30px rgba(102,126,234,0.30)" }}>
                  Empezar — €9.99/mes
                </Link>
                <Link href="/metricas/dashboard"
                  className="px-7 py-3.5 rounded-xl font-semibold border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all">
                  Ver demo
                </Link>
              </div>
            </div>

            {/* Dashboard preview mockup */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {/* Fake browser bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]"
                  style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#f87171]/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#4ade80]/50" />
                  </div>
                  <div className="flex-1 mx-3 px-3 py-1 rounded-md text-[0.65rem] text-white/20"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    evtradelabs.com/metricas/dashboard
                  </div>
                </div>

                <div className="p-4">
                  {/* KPI strip */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {PREVIEW_STATS.slice(0, 3).map((s) => (
                      <div key={s.label} className="rounded-xl p-3"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div className="text-[0.55rem] text-white/30 uppercase tracking-wider mb-1">{s.label}</div>
                        <div className="text-[0.9rem] font-black" style={{ color: s.color }}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Equity sparkline */}
                  <div className="rounded-xl p-3 mb-3"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="text-[0.6rem] text-white/30 mb-2">EQUITY CURVE</div>
                    <svg viewBox="0 0 280 70" className="w-full" style={{ height: "64px" }} preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#667eea" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#667eea" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d={fillPath} fill="url(#sparkFill)" />
                      <polyline points={sparkCoords} fill="none" stroke="#667eea" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  </div>

                  {/* Mini monthly bar */}
                  <div className="rounded-xl p-3"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="text-[0.6rem] text-white/30 mb-2">P&L MENSUAL</div>
                    <div className="flex items-end gap-1 h-10">
                      {PREVIEW_MONTHLY.map((m, i) => {
                        const h = Math.max(Math.abs(m.v) / 7 * 100, 8);
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                            <div className="w-full rounded-sm transition-all"
                              style={{
                                height: `${h}%`,
                                background: m.pos ? "rgba(74,222,128,0.6)" : "rgba(248,113,113,0.5)",
                              }} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Glow */}
              <div className="absolute -inset-4 rounded-3xl pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, rgba(102,126,234,0.12) 0%, transparent 70%)", filter: "blur(20px)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-5">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-14">
            <span className="text-[0.7rem] font-bold tracking-[0.25em] uppercase text-[#667eea] mb-3 block">Qué incluye</span>
            <h2 className="text-[2rem] font-black tracking-tight">Analítica que te hace mejor trader</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${f.color}15`, border: `1px solid ${f.color}25`, color: f.color }}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-white text-[0.95rem] mb-2">{f.title}</h3>
                <p className="text-white/45 text-[0.82rem] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-5">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-14">
            <span className="text-[0.7rem] font-bold tracking-[0.25em] uppercase text-[#667eea] mb-3 block">Cómo funciona</span>
            <h2 className="text-[2rem] font-black tracking-tight">Conecta en 3 pasos</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Suscríbete",
                desc: "Elige el plan mensual y crea tu cuenta. Acceso inmediato al panel de métricas.",
                color: "#667eea",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Instala el EA en MT5",
                desc: "Descarga EVMetricas.mq5, adjúntalo a cualquier gráfico y pega tu API key. Sin credenciales, sin riesgos.",
                color: "#a78bfa",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Analiza y mejora",
                desc: "Tus métricas se actualizan en tiempo real. Identifica patrones, errores y edge.",
                color: "#4ade80",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M7 16l4-6 4 3 4-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
              },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl p-8 text-center"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                  style={{ background: `${s.color}15`, border: `1px solid ${s.color}30`, color: s.color }}>
                  {s.icon}
                </div>
                <div className="text-[0.65rem] font-mono text-white/25 mb-2">{s.step}</div>
                <h3 className="font-bold text-white text-[1rem] mb-3">{s.title}</h3>
                <p className="text-white/45 text-[0.83rem] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-5">
        <div className="max-w-[480px] mx-auto">
          <div className="rounded-2xl p-8"
            style={{ background: "linear-gradient(135deg, rgba(102,126,234,0.12), rgba(118,75,162,0.06))", border: "1px solid rgba(102,126,234,0.25)" }}>
            <div className="text-[0.75rem] text-white/40 uppercase tracking-wider mb-2">Plan mensual</div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-[3rem] font-black text-white">€9.99</span>
              <span className="text-white/40">/mes</span>
            </div>
            <p className="text-white/45 text-sm mb-6 leading-relaxed">
              Una cuenta MT5. Métricas en tiempo real. Enlace de verificación público. Cancela cuando quieras.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "1 cuenta MT5 vinculada",
                "Equity curve en tiempo real",
                "P&L mensual y anual",
                "Heatmap de sesiones",
                "Desglose por símbolo",
                "Estadísticas avanzadas",
                "Enlace verificado compartible",
                "Historial completo de trades",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-white/65">
                  <span className="text-[#667eea] text-xs">✓</span>{f}
                </li>
              ))}
            </ul>
            <Link href="/checkout?product=metricas"
              className="block w-full text-center py-4 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", boxShadow: "0 8px 30px rgba(102,126,234,0.30)" }}>
              Suscribirse — €9.99/mes
            </Link>
            <p className="text-center text-white/25 text-xs mt-4">
              ¿Más de una cuenta? <a href="mailto:contact@evtradelabs.com" className="text-white/40 hover:text-white/60 underline">Contáctanos</a>
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}
