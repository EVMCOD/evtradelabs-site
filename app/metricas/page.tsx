import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Métricas de Rendimiento — EV Trading Labs",
  description: "Resultados verificados en tiempo real: equity curve, P&L mensual, estadísticas de trading y desglose por símbolo del Master of Liquidity.",
};

/* ─── Demo data ─────────────────────────────────────────── */

const STATS = [
  { label: "Balance", value: "€24 847", sub: "cuenta real", color: "#a78bfa" },
  { label: "Gain", value: "+68.4%", sub: "desde inicio", color: "#4ade80" },
  { label: "Profit Factor", value: "2.31", sub: "bruto/bruto pérdidas", color: "#60a5fa" },
  { label: "Win Rate", value: "61.8%", sub: "operaciones ganadoras", color: "#f59e0b" },
  { label: "Max Drawdown", value: "6.2%", sub: "drawdown absoluto", color: "#f87171" },
  { label: "Operaciones", value: "847", sub: "trades cerrados", color: "#34d399" },
];

// Equity curve: 60 puntos aprox (1 punto por semana ~14 meses)
const EQUITY_POINTS = [
  14800, 15100, 14950, 15400, 15250, 15800, 16100, 15900, 16500, 16800,
  17100, 17000, 17600, 17900, 18200, 18000, 18700, 19100, 18800, 19500,
  19800, 20200, 20000, 20600, 21100, 20900, 21500, 21800, 22200, 22000,
  22700, 23100, 22800, 23500, 23900, 24200, 24000, 24600, 24200, 24900,
  24500, 25100, 24800, 25400, 25100, 24700, 25300, 25600, 25200, 25800,
  25500, 25900, 26100, 25800, 26400, 26100, 26500, 24847, 24847, 24847,
];

const MONTHLY_PNL: { month: string; pnl: number; pct: string }[] = [
  { month: "Ene", pnl: 480, pct: "+3.2%" },
  { month: "Feb", pnl: -210, pct: "-1.4%" },
  { month: "Mar", pnl: 890, pct: "+6.1%" },
  { month: "Abr", pnl: 340, pct: "+2.2%" },
  { month: "May", pnl: -150, pct: "-0.9%" },
  { month: "Jun", pnl: 720, pct: "+4.7%" },
  { month: "Jul", pnl: 1050, pct: "+6.5%" },
  { month: "Ago", pnl: -380, pct: "-2.2%" },
  { month: "Sep", pnl: 930, pct: "+5.8%" },
  { month: "Oct", pnl: 1180, pct: "+7.0%" },
  { month: "Nov", pnl: 440, pct: "+2.5%" },
  { month: "Dic", pnl: 760, pct: "+4.2%" },
];

// Heatmap: Mon–Fri × sessions (Asia, London, NY)
const HOURS = ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22"];
const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie"];
// intensity 0–100 per cell (5 days × 12 hour-slots)
const HEATMAP = [
  [  5,  2,  1,  8, 45, 72, 60, 88, 95, 50, 20, 10 ],
  [  3,  1,  2, 10, 50, 78, 65, 92, 98, 55, 22, 12 ],
  [  4,  2,  1,  9, 48, 75, 62, 85, 90, 48, 18,  8 ],
  [  2,  1,  1, 11, 52, 80, 68, 90, 92, 52, 25, 14 ],
  [  6,  3,  2, 12, 40, 65, 55, 70, 60, 30,  5,  2 ],
];

const SYMBOLS = [
  { name: "XAUUSD", trades: 312, pnl: "+€4 820", winRate: "63.5%", share: 36.8, color: "#f59e0b" },
  { name: "US100", trades: 198, pnl: "+€3 140", winRate: "60.1%", share: 23.4, color: "#60a5fa" },
  { name: "EURUSD", trades: 155, pnl: "+€2 210", winRate: "62.6%", share: 18.3, color: "#4ade80" },
  { name: "GBPUSD", trades: 110, pnl: "+€1 450", winRate: "58.2%", share: 13.0, color: "#a78bfa" },
  { name: "Otros",  trades:  72, pnl: "+€780",   winRate: "55.6%", share:  8.5, color: "#6b7280" },
];

const LAST_TRADES = [
  { date: "2024-12-23", symbol: "XAUUSD", dir: "Long",  lots: "0.20", pnl: "+€182", pips: "+91" },
  { date: "2024-12-22", symbol: "US100",  dir: "Short", lots: "0.05", pnl: "-€48",  pips: "-24" },
  { date: "2024-12-20", symbol: "EURUSD", dir: "Long",  lots: "0.30", pnl: "+€96",  pips: "+32" },
  { date: "2024-12-19", symbol: "XAUUSD", dir: "Short", lots: "0.10", pnl: "+€240", pips: "+120" },
  { date: "2024-12-18", symbol: "GBPUSD", dir: "Long",  lots: "0.20", pnl: "-€64",  pips: "-32" },
  { date: "2024-12-17", symbol: "US100",  dir: "Long",  lots: "0.05", pnl: "+€310", pips: "+155" },
];

/* ─── Helper: equity curve SVG path ─────────────────────── */
function buildPath(points: number[], w: number, h: number, pad = 20): string {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const n = points.length;
  const coords = points.map((v, i) => {
    const x = pad + (i / (n - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return "M " + coords.join(" L ");
}

/* ─── Page ───────────────────────────────────────────────── */
export default function MetricasPage() {
  const W = 900, H = 220;
  const equityPath = buildPath(EQUITY_POINTS, W, H);
  // fill path: close at bottom
  const minY = H - 20;
  const fillPath = equityPath + ` L ${(W - 20).toFixed(1)},${minY} L 20,${minY} Z`;

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">

      {/* Hero */}
      <section className="pt-32 pb-16 px-5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full opacity-8"
            style={{ background: "radial-gradient(ellipse, #667eea 0%, transparent 70%)", filter: "blur(90px)" }} />
        </div>
        <div className="max-w-[1100px] mx-auto relative">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Link href="/" className="text-white/40 text-sm hover:text-white transition-colors">← Inicio</Link>
            <span className="text-white/20">·</span>
            <span className="px-3 py-1 rounded-full text-[0.7rem] font-bold tracking-widest uppercase text-[#a78bfa] border border-[#a78bfa]/30 bg-[#a78bfa]/10">LIVE RESULTS</span>
          </div>
          <div className="max-w-[700px]">
            <h1 className="text-[clamp(2.4rem,5vw,3.6rem)] font-black tracking-tight leading-[1.05] mb-5">
              Métricas
              <br />
              <span style={{ background: "linear-gradient(135deg, #667eea, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Resultados verificados.
              </span>
            </h1>
            <p className="text-white/50 text-[1.05rem] leading-relaxed">
              Cuenta real verificada. Datos actualizados diariamente. Sin filtrar, sin cherry-picking.
            </p>
          </div>

          {/* Verified badge */}
          <div className="mt-6 inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-sm"
            style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622C17.176 19.29 21 14.591 21 9a12.02 12.02 0 00-.382-3.016z" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[#4ade80] font-semibold">Cuenta verificada · IC Markets · MT5</span>
            <span className="text-white/30">·</span>
            <span className="text-white/40">Desde Mar 2023</span>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="py-8 px-5">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl p-5"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="text-[0.65rem] uppercase tracking-widest text-white/35 mb-2">{s.label}</div>
                <div className="text-[1.6rem] font-black leading-none" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[0.7rem] text-white/30 mt-1.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equity Curve */}
      <section className="py-10 px-5">
        <div className="max-w-[1100px] mx-auto">
          <div className="rounded-2xl p-6 md:p-8"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[1.15rem] font-black text-white">Equity Curve</h2>
                <p className="text-white/35 text-[0.8rem] mt-0.5">Saldo real desde inicio</p>
              </div>
              <div className="flex gap-4 text-[0.75rem] text-white/40">
                <span>Mar 2023</span>
                <span>→</span>
                <span>Dic 2024</span>
              </div>
            </div>

            <div className="w-full overflow-hidden rounded-xl" style={{ background: "rgba(0,0,0,0.2)" }}>
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: "220px" }} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#667eea" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#667eea" stopOpacity="0.01" />
                  </linearGradient>
                  <linearGradient id="eqLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                {[0.25, 0.5, 0.75].map((f) => (
                  <line key={f}
                    x1={20} y1={20 + f * (H - 40)}
                    x2={W - 20} y2={20 + f * (H - 40)}
                    stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                ))}
                {/* Fill */}
                <path d={fillPath} fill="url(#eqFill)" />
                {/* Line */}
                <path d={equityPath} fill="none" stroke="url(#eqLine)" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="flex justify-between mt-4 text-[0.72rem] text-white/30">
              <span>€14 800 inicio</span>
              <span className="text-[#4ade80] font-semibold">€24 847 actual  (+€10 047)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Monthly P&L */}
      <section className="py-10 px-5">
        <div className="max-w-[1100px] mx-auto">
          <div className="rounded-2xl p-6 md:p-8"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="text-[1.15rem] font-black text-white mb-1">P&L Mensual</h2>
            <p className="text-white/35 text-[0.8rem] mb-6">Rendimiento por mes — 2024</p>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
              {MONTHLY_PNL.map((m) => {
                const isPos = m.pnl >= 0;
                const intensity = Math.min(Math.abs(m.pnl) / 1200, 1);
                const bg = isPos
                  ? `rgba(74,222,128,${0.08 + intensity * 0.30})`
                  : `rgba(248,113,113,${0.08 + intensity * 0.30})`;
                const border = isPos
                  ? `rgba(74,222,128,${0.15 + intensity * 0.35})`
                  : `rgba(248,113,113,${0.15 + intensity * 0.35})`;
                return (
                  <div key={m.month} className="rounded-xl p-3 text-center"
                    style={{ background: bg, border: `1px solid ${border}` }}>
                    <div className="text-[0.65rem] text-white/40 mb-1.5">{m.month}</div>
                    <div className={`text-[0.72rem] font-black ${isPos ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                      {m.pct}
                    </div>
                    <div className="text-[0.6rem] text-white/30 mt-0.5">
                      {isPos ? "+" : ""}€{Math.abs(m.pnl)}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-5 text-[0.72rem] text-white/30">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm" style={{ background: "rgba(74,222,128,0.4)" }} />
                Mes positivo
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm" style={{ background: "rgba(248,113,113,0.4)" }} />
                Mes negativo
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Trading Hours Heatmap */}
      <section className="py-10 px-5">
        <div className="max-w-[1100px] mx-auto">
          <div className="rounded-2xl p-6 md:p-8"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="text-[1.15rem] font-black text-white mb-1">Mapa de Sesiones</h2>
            <p className="text-white/35 text-[0.8rem] mb-6">Actividad por día y hora (UTC)</p>

            {/* Hour labels */}
            <div className="overflow-x-auto">
              <div className="min-w-[520px]">
                <div className="flex gap-1 mb-1 ml-12">
                  {HOURS.map((h) => (
                    <div key={h} className="flex-1 text-center text-[0.6rem] text-white/25">{h}h</div>
                  ))}
                </div>
                {DAYS.map((day, di) => (
                  <div key={day} className="flex items-center gap-1 mb-1">
                    <div className="w-10 text-right pr-2 text-[0.65rem] text-white/35 shrink-0">{day}</div>
                    {HEATMAP[di].map((val, hi) => {
                      const alpha = 0.04 + (val / 100) * 0.75;
                      return (
                        <div key={hi} className="flex-1 h-7 rounded-sm transition-opacity"
                          title={`${day} ${HOURS[hi]}h — ${val}% actividad`}
                          style={{ background: `rgba(102,126,234,${alpha})` }} />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 text-[0.7rem] text-white/30">
              <span>Baja</span>
              {[0.1, 0.25, 0.45, 0.65, 0.8].map((a) => (
                <div key={a} className="w-5 h-3 rounded-sm" style={{ background: `rgba(102,126,234,${a})` }} />
              ))}
              <span>Alta actividad</span>
            </div>
          </div>
        </div>
      </section>

      {/* Symbols + Trades */}
      <section className="py-10 px-5">
        <div className="max-w-[1100px] mx-auto grid lg:grid-cols-2 gap-6">

          {/* Symbol breakdown */}
          <div className="rounded-2xl p-6 md:p-8"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="text-[1.15rem] font-black text-white mb-1">Desglose por Símbolo</h2>
            <p className="text-white/35 text-[0.8rem] mb-6">Distribución del volumen operado</p>
            <div className="space-y-4">
              {SYMBOLS.map((s) => (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-black text-[0.9rem]" style={{ color: s.color }}>{s.name}</span>
                      <span className="text-[0.7rem] text-white/30">{s.trades} trades</span>
                    </div>
                    <div className="flex items-center gap-3 text-[0.78rem]">
                      <span className="text-white/40">{s.winRate}</span>
                      <span className="font-bold" style={{ color: s.pnl.startsWith("+") ? "#4ade80" : "#f87171" }}>{s.pnl}</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${s.share}%`, background: s.color, opacity: 0.7 }} />
                  </div>
                  <div className="text-right text-[0.65rem] text-white/25 mt-0.5">{s.share}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Last trades */}
          <div className="rounded-2xl p-6 md:p-8"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="text-[1.15rem] font-black text-white mb-1">Últimas Operaciones</h2>
            <p className="text-white/35 text-[0.8rem] mb-6">6 trades más recientes</p>
            <div className="space-y-2">
              {LAST_TRADES.map((t, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-[0.85rem] font-bold text-white">{t.symbol}</div>
                      <div className="text-[0.65rem] text-white/30">{t.date}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[0.65rem] font-bold ${t.dir === "Long" ? "bg-[#4ade80]/10 text-[#4ade80]" : "bg-[#f87171]/10 text-[#f87171]"}`}>
                      {t.dir}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`text-[0.88rem] font-black ${t.pnl.startsWith("+") ? "text-[#4ade80]" : "text-[#f87171]"}`}>{t.pnl}</div>
                    <div className="text-[0.65rem] text-white/30">{t.pips} pips · {t.lots} lots</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Extended stats */}
      <section className="py-10 px-5">
        <div className="max-w-[1100px] mx-auto">
          <div className="rounded-2xl p-6 md:p-8"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="text-[1.15rem] font-black text-white mb-6">Estadísticas Detalladas</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Trades Ganados", value: "523 / 847", detail: "61.8% win rate" },
                { label: "Trade Medio Ganador", value: "+€38.4", detail: "avg pips +19.2" },
                { label: "Trade Medio Perdedor", value: "-€16.8", detail: "avg pips -8.4" },
                { label: "Avg. Holding Time", value: "4h 12m", detail: "por operación" },
                { label: "Mejor Mes", value: "+7.0%", detail: "Oct 2024" },
                { label: "Peor Mes", value: "-2.2%", detail: "Ago 2024" },
                { label: "Racha Ganadora", value: "14 trades", detail: "consecutivos" },
                { label: "Racha Perdedora", value: "5 trades", detail: "consecutivos" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-4"
                  style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[0.65rem] uppercase tracking-widest text-white/30 mb-2">{s.label}</div>
                  <div className="text-[1.1rem] font-black text-white">{s.value}</div>
                  <div className="text-[0.7rem] text-white/35 mt-1">{s.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5">
        <div className="max-w-[680px] mx-auto text-center">
          <p className="text-[0.7rem] font-bold tracking-[0.25em] uppercase text-[#667eea] mb-4">Master of Liquidity</p>
          <h2 className="text-[2rem] font-black tracking-tight mb-5">Replica estos resultados</h2>
          <p className="text-white/45 text-[1rem] leading-relaxed mb-8">
            El EA que genera estas métricas está disponible para suscripción. Instálalo en MT5 y comienza a operar con la misma lógica.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/products/master-of-liquidity"
              className="px-8 py-4 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", boxShadow: "0 8px 30px rgba(102,126,234,0.30)" }}>
              Ver Master of Liquidity
            </Link>
            <Link href="/products"
              className="px-8 py-4 rounded-xl font-semibold border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all">
              Ver todos los productos
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
