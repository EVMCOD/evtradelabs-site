import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Master of Liquidity — EA para MetaTrader 5 | EV Trading Labs",
  description: "Asesor Experto para MT5 con 8 estrategias de liquidez integradas. Gestión de riesgo avanzada, compatible con cuentas de fondeo.",
};

const STRATEGIES = [
  {
    id: "01",
    name: "Liquidity Sweep",
    desc: "Captura los barridos de liquidez por encima/debajo de máximos y mínimos previos. Entra en la trampa cuando el precio revierte.",
    color: "#a78bfa",
    tag: "Reversal",
  },
  {
    id: "02",
    name: "Fair Value Gap",
    desc: "Detecta y opera los desequilibrios de precio (FVG) dejados por movimientos de alta velocidad institucional.",
    color: "#60a5fa",
    tag: "Imbalance",
  },
  {
    id: "03",
    name: "Order Block Entry",
    desc: "Identifica zonas de Order Block institucionales y espera el retroceso al nivel para una entrada de alta probabilidad.",
    color: "#34d399",
    tag: "SMC",
  },
  {
    id: "04",
    name: "Breaker Block",
    desc: "Opera los Order Blocks fallidos que se convierten en zonas de soporte/resistencia después de un BOS.",
    color: "#f59e0b",
    tag: "SMC",
  },
  {
    id: "05",
    name: "Displacement Rebalance",
    desc: "Tras un movimiento de desplazamiento fuerte, opera el retroceso al 50% del desequilibrio para rebalancear.",
    color: "#f472b6",
    tag: "Rebalance",
  },
  {
    id: "06",
    name: "Session Open",
    desc: "Estrategia basada en las aperturas de Londres y Nueva York, capturando el impulso inicial de cada sesión.",
    color: "#38bdf8",
    tag: "Session",
  },
  {
    id: "07",
    name: "Smart Money Reversal",
    desc: "Combina confluencias de estructura, liquidez y desequilibrio para identificar reversiones institucionales.",
    color: "#a78bfa",
    tag: "Reversal",
  },
  {
    id: "08",
    name: "Trend Continuation",
    desc: "Opera pullbacks en tendencia fuerte usando niveles de estructura como zona de entrada con el flujo principal.",
    color: "#4ade80",
    tag: "Trend",
  },
];

const STATS = [
  { label: "Win Rate", value: "68.4%", color: "#4ade80" },
  { label: "Profit Factor", value: "2.31", color: "#4ade80" },
  { label: "Max Drawdown", value: "8.3%", color: "#f87171" },
  { label: "Sharpe Ratio", value: "2.87", color: "#a78bfa" },
  { label: "Total Trades", value: "847", color: "#fff" },
  { label: "Avg RR", value: "1:1.87", color: "#60a5fa" },
];

const EQUITY = [20000, 21300, 20850, 22400, 23100, 22950, 23800, 24100, 23500, 24300, 24853];
const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov"];

function EquityChart() {
  const min = 19000;
  const max = 27000;
  const pts = EQUITY.map((v, i) => `${(i / (EQUITY.length - 1)) * 1000},${200 - ((v - min) / (max - min)) * 180}`).join(" ");
  return (
    <div className="relative">
      <svg viewBox="0 0 1000 210" className="w-full h-[180px]" preserveAspectRatio="none">
        <defs>
          <linearGradient id="molGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 50, 100, 150, 200].map((y) => (
          <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        <polygon points={`0,${200 - ((EQUITY[0] - min) / (max - min)) * 180} ${pts} 1000,200 0,200`} fill="url(#molGrad)" />
        <polyline points={pts} fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {EQUITY.map((v, i) => (
          <circle key={i} cx={(i / (EQUITY.length - 1)) * 1000} cy={200 - ((v - min) / (max - min)) * 180} r="5" fill="#a78bfa" stroke="#0a0a0f" strokeWidth="2" />
        ))}
      </svg>
      <div className="flex justify-between mt-2 text-[0.65rem] text-white/30">
        {MONTHS.map((m) => <span key={m}>{m}</span>)}
      </div>
    </div>
  );
}

export default function MasterOfLiquidityPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">

      {/* Hero */}
      <section className="pt-32 pb-20 px-5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-10"
            style={{ background: "radial-gradient(ellipse, #a78bfa 0%, transparent 70%)", filter: "blur(60px)" }} />
        </div>
        <div className="max-w-[1100px] mx-auto relative">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Link href="/products" className="text-white/40 text-sm hover:text-white transition-colors">← Productos</Link>
            <span className="text-white/20">·</span>
            <span className="px-3 py-1 rounded-full text-[0.7rem] font-bold tracking-widest uppercase text-[#a78bfa] border border-[#a78bfa]/30 bg-[#a78bfa]/10">MT5 EA</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-[clamp(2.4rem,5vw,3.8rem)] font-black tracking-tight leading-[1.05] mb-5">
                Master of<br />
                <span style={{ background: "linear-gradient(135deg, #a78bfa, #667eea)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Liquidity
                </span>
              </h1>
              <p className="text-white/55 text-[1.05rem] leading-relaxed mb-8 max-w-[480px]">
                8 estrategias de liquidez institucional en un solo EA. Diseñado para operar con estructura, gestionar el riesgo con precisión y sobrevivir en cuentas de fondeo.
              </p>

              <div className="grid grid-cols-3 gap-3 mb-8">
                {STATS.map((s) => (
                  <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="text-[1.3rem] font-black mb-0.5" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-[0.65rem] text-white/40 uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/checkout?product=master-of-liquidity"
                  className="px-7 py-3.5 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #a78bfa, #667eea)", boxShadow: "0 8px 30px rgba(167,139,250,0.35)" }}>
                  Suscribirse — €48.99/mes
                </Link>
                <Link href="/checkout?product=master-of-liquidity&plan=lifetime"
                  className="px-7 py-3.5 rounded-xl font-bold text-white/70 border border-white/10 hover:border-white/25 hover:text-white transition-all">
                  Lifetime — €199
                </Link>
              </div>
            </div>

            {/* Performance card */}
            <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(167,139,250,0.15)", boxShadow: "0 0 60px rgba(167,139,250,0.06)" }}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[0.8rem] font-semibold text-white/50">Equity Curve — 2024</span>
                <span className="text-[#4ade80] text-[0.85rem] font-bold">+24.3%</span>
              </div>
              <EquityChart />
              <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-white/[0.06]">
                <div className="text-center">
                  <div className="text-[0.7rem] text-white/35 mb-1">Balance</div>
                  <div className="font-bold text-white text-sm">$24,853</div>
                </div>
                <div className="text-center">
                  <div className="text-[0.7rem] text-white/35 mb-1">Ganancia</div>
                  <div className="font-bold text-[#4ade80] text-sm">+$4,853</div>
                </div>
                <div className="text-center">
                  <div className="text-[0.7rem] text-white/35 mb-1">Drawdown</div>
                  <div className="font-bold text-[#f87171] text-sm">-8.3%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8 Strategies */}
      <section className="py-20 px-5">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-14">
            <span className="text-[0.7rem] font-bold tracking-[0.25em] uppercase text-[#667eea] mb-3 block">Estrategias</span>
            <h2 className="text-[2rem] font-black tracking-tight">8 estrategias integradas</h2>
            <p className="text-white/40 mt-3 max-w-[480px] mx-auto text-sm leading-relaxed">
              Cada estrategia opera de forma independiente con su propio perfil de riesgo. Tú decides cuáles activar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {STRATEGIES.map((s) => (
              <div key={s.id} className="group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[0.65rem] text-white/25 font-mono">{s.id}</span>
                  <span className="text-[0.62rem] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${s.color}18`, border: `1px solid ${s.color}35`, color: s.color }}>
                    {s.tag}
                  </span>
                </div>
                <div className="w-8 h-[3px] rounded-full mb-3 transition-all duration-300 group-hover:w-12"
                  style={{ background: s.color }} />
                <h3 className="font-bold text-white text-[0.92rem] mb-2">{s.name}</h3>
                <p className="text-white/40 text-[0.8rem] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk management */}
      <section className="py-20 px-5">
        <div className="max-w-[1100px] mx-auto">
          <div className="rounded-2xl p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div>
              <span className="text-[0.7rem] font-bold tracking-[0.25em] uppercase text-[#667eea] mb-3 block">Gestión del riesgo</span>
              <h2 className="text-[1.8rem] font-black tracking-tight mb-5">Protección integrada en cada operación</h2>
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                El EA calcula automáticamente el lotaje según tu riesgo por operación, gestiona los stops dinámicamente y protege la cuenta con límites de pérdida diaria y semanal.
              </p>
              <ul className="space-y-3">
                {[
                  "Lotaje automático por % de riesgo",
                  "Stop Loss dinámico por estructura",
                  "Límite de pérdida diaria y semanal",
                  "Trailing stop inteligente",
                  "Break-even automático",
                  "Compatible con reglas de fondeo (FTMO, MFF...)",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white/65">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#4ade80", boxShadow: "0 0 6px rgba(74,222,128,0.6)" }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              {[
                { label: "Riesgo por operación", value: "1–2%", bar: 25, color: "#a78bfa" },
                { label: "Max daily loss", value: "5%", bar: 50, color: "#f59e0b" },
                { label: "Max drawdown", value: "8.3%", bar: 83, color: "#f87171" },
                { label: "Win rate histórico", value: "68.4%", bar: 68, color: "#4ade80" },
                { label: "Profit factor", value: "2.31", bar: 77, color: "#60a5fa" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-[0.8rem] mb-1.5">
                    <span className="text-white/50">{item.label}</span>
                    <span className="font-bold" style={{ color: item.color }}>{item.value}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${item.bar}%`, background: item.color, opacity: 0.7 }} />
                  </div>
                </div>
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
                price: "€48.99",
                period: "/mes",
                desc: "Acceso completo con todas las actualizaciones. Cancela cuando quieras.",
                features: ["8 estrategias activas", "Actualizaciones continuas", "Soporte por email", "1 cuenta MT5"],
                cta: "Suscribirse",
                href: "/checkout?product=master-of-liquidity",
                highlight: false,
              },
              {
                name: "Lifetime",
                price: "€199",
                period: " pago único",
                desc: "Acceso de por vida. Sin pagos recurrentes. La opción más inteligente.",
                features: ["Todo lo del plan mensual", "Licencia permanente", "Actualizaciones de por vida", "Hasta 3 cuentas MT5"],
                cta: "Comprar Lifetime",
                href: "/checkout?product=master-of-liquidity&plan=lifetime",
                highlight: true,
              },
            ].map((plan) => (
              <div key={plan.name} className="rounded-2xl p-7 text-left relative"
                style={{
                  background: plan.highlight ? "linear-gradient(135deg, rgba(167,139,250,0.12), rgba(102,126,234,0.06))" : "rgba(255,255,255,0.03)",
                  border: plan.highlight ? "1px solid rgba(167,139,250,0.3)" : "1px solid rgba(255,255,255,0.07)",
                }}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[0.65rem] font-black uppercase tracking-wider text-white"
                    style={{ background: "linear-gradient(135deg, #a78bfa, #667eea)" }}>
                    Más popular
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
                    ? { background: "linear-gradient(135deg, #a78bfa, #667eea)", color: "#fff", boxShadow: "0 6px 24px rgba(167,139,250,0.3)" }
                    : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }
                  }>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-5 border-t border-white/[0.06]">
        <div className="max-w-[600px] mx-auto text-center">
          <p className="text-white/30 text-sm mb-4">¿Tienes dudas antes de comprar?</p>
          <a href="mailto:contact@evtradelabs.com" className="text-[#a78bfa] text-sm hover:underline">
            contact@evtradelabs.com
          </a>
        </div>
      </section>
    </main>
  );
}
