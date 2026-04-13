"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/* ─── Types ──────────────────────────────────────────────── */
type AuthState = "loading" | "unauthenticated" | "no_subscription" | "no_account" | "connected";

/* ─── Demo data (shown when connected) ──────────────────── */
const STATS = [
  { label: "Balance", value: "€24 847", sub: "cuenta real", color: "#a78bfa" },
  { label: "Gain", value: "+68.4%", sub: "desde inicio", color: "#4ade80" },
  { label: "Profit Factor", value: "2.31", sub: "bruto / pérdidas", color: "#60a5fa" },
  { label: "Win Rate", value: "61.8%", sub: "operaciones ganadoras", color: "#f59e0b" },
  { label: "Max Drawdown", value: "6.2%", sub: "drawdown absoluto", color: "#f87171" },
  { label: "Operaciones", value: "847", sub: "trades cerrados", color: "#34d399" },
];

const MONTHLY_PNL = [
  { month: "Ene", pnl: 480, pct: "+3.2%" }, { month: "Feb", pnl: -210, pct: "-1.4%" },
  { month: "Mar", pnl: 890, pct: "+6.1%" }, { month: "Abr", pnl: 340, pct: "+2.2%" },
  { month: "May", pnl: -150, pct: "-0.9%" }, { month: "Jun", pnl: 720, pct: "+4.7%" },
  { month: "Jul", pnl: 1050, pct: "+6.5%" }, { month: "Ago", pnl: -380, pct: "-2.2%" },
  { month: "Sep", pnl: 930, pct: "+5.8%" }, { month: "Oct", pnl: 1180, pct: "+7.0%" },
  { month: "Nov", pnl: 440, pct: "+2.5%" }, { month: "Dic", pnl: 760, pct: "+4.2%" },
];

const EQUITY_POINTS = [
  14800, 15100, 14950, 15400, 15250, 15800, 16100, 15900, 16500, 16800,
  17100, 17000, 17600, 17900, 18200, 18000, 18700, 19100, 18800, 19500,
  19800, 20200, 20000, 20600, 21100, 20900, 21500, 21800, 22200, 22000,
  22700, 23100, 22800, 23500, 23900, 24200, 24000, 24600, 24200, 24900,
  24500, 25100, 24800, 25400, 25100, 24700, 25300, 25600, 25200, 25800,
  25500, 25900, 26100, 25800, 26400, 26100, 26500, 24847, 24847, 24847,
];

const HOURS = ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22"];
const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie"];
const HEATMAP = [
  [  5,  2,  1,  8, 45, 72, 60, 88, 95, 50, 20, 10 ],
  [  3,  1,  2, 10, 50, 78, 65, 92, 98, 55, 22, 12 ],
  [  4,  2,  1,  9, 48, 75, 62, 85, 90, 48, 18,  8 ],
  [  2,  1,  1, 11, 52, 80, 68, 90, 92, 52, 25, 14 ],
  [  6,  3,  2, 12, 40, 65, 55, 70, 60, 30,  5,  2 ],
];

const SYMBOLS = [
  { name: "XAUUSD", trades: 312, pnl: "+€4 820", winRate: "63.5%", share: 36.8, color: "#f59e0b" },
  { name: "US100",  trades: 198, pnl: "+€3 140", winRate: "60.1%", share: 23.4, color: "#60a5fa" },
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

function buildPath(points: number[], w: number, h: number, pad = 20): string {
  const min = Math.min(...points), max = Math.max(...points);
  const range = max - min || 1;
  const n = points.length;
  return points.map((v, i) => {
    const x = pad + (i / (n - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" L ");
}

/* ─── Gate screens ───────────────────────────────────────── */

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-[#667eea]/30 border-t-[#667eea] animate-spin" />
    </div>
  );
}

function UnauthScreen() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-5">
      <div className="max-w-[420px] w-full text-center">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: "rgba(102,126,234,0.1)", border: "1px solid rgba(102,126,234,0.2)" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="#667eea" strokeWidth="1.5"/>
            <path d="M7 11V7a5 5 0 0110 0v4" stroke="#667eea" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 className="text-[1.6rem] font-black text-white mb-3">Inicia sesión</h2>
        <p className="text-white/45 text-sm leading-relaxed mb-8">
          Necesitas una cuenta para acceder a tus métricas.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/login"
            className="block w-full py-3.5 rounded-xl font-bold text-center text-white"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
            Iniciar sesión
          </Link>
          <Link href="/register"
            className="block w-full py-3.5 rounded-xl font-semibold text-center border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all">
            Crear cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}

function NoSubscriptionScreen() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-5">
      <div className="max-w-[480px] w-full">
        <div className="rounded-2xl p-8 text-center"
          style={{ background: "linear-gradient(135deg, rgba(102,126,234,0.10), rgba(118,75,162,0.05))", border: "1px solid rgba(102,126,234,0.2)" }}>
          <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: "rgba(102,126,234,0.12)", border: "1px solid rgba(102,126,234,0.25)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M3 3v18h18" stroke="#667eea" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M7 16l4-6 4 3 4-7" stroke="#667eea" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-[1.6rem] font-black text-white mb-3">EV Métricas</h2>
          <p className="text-white/45 text-sm leading-relaxed mb-2">
            Accede a tu equity curve, P&L mensual, heatmap de sesiones y estadísticas completas de tu cuenta MT5.
          </p>
          <div className="flex items-baseline justify-center gap-1.5 my-6">
            <span className="text-[2.5rem] font-black text-white">€9.99</span>
            <span className="text-white/40">/mes</span>
          </div>
          <Link href="/checkout?product=metricas"
            className="block w-full py-4 rounded-xl font-bold text-white text-center transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", boxShadow: "0 8px 30px rgba(102,126,234,0.25)" }}>
            Activar Métricas
          </Link>
          <Link href="/metricas" className="block mt-4 text-sm text-white/30 hover:text-white/50 transition-colors">
            Ver qué incluye →
          </Link>
        </div>
      </div>
    </div>
  );
}

function ConnectAccountScreen() {
  const [server, setServer] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Placeholder — real connection logic goes here
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    alert("Funcionalidad en desarrollo. Tu cuenta será vinculada pronto.");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-5">
      <div className="max-w-[440px] w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
            style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="text-[1.6rem] font-black text-white mb-2">Conecta tu cuenta MT5</h2>
          <p className="text-white/40 text-sm leading-relaxed">
            Solo necesitas acceso de <span className="text-white/60">solo lectura</span>. No podemos ejecutar ni modificar órdenes.
          </p>
        </div>

        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label className="block text-[0.75rem] text-white/40 uppercase tracking-wider mb-2">Servidor MT5</label>
            <input
              type="text"
              placeholder="ej. ICMarkets-Live01"
              value={server}
              onChange={(e) => setServer(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </div>
          <div>
            <label className="block text-[0.75rem] text-white/40 uppercase tracking-wider mb-2">Login (número de cuenta)</label>
            <input
              type="text"
              placeholder="ej. 12345678"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </div>
          <div>
            <label className="block text-[0.75rem] text-white/40 uppercase tracking-wider mb-2">Contraseña de inversor</label>
            <input
              type="password"
              placeholder="Contraseña de solo lectura"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl text-[0.78rem] text-white/40 leading-relaxed"
            style={{ background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.12)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#4ade80" strokeWidth="1.5"/>
            </svg>
            <span>La contraseña de inversor es de <strong className="text-white/60">solo lectura</strong>. No permite abrir ni cerrar posiciones. Puedes encontrarla en MT5 → Herramientas → Configuración → Inversor.</span>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", boxShadow: "0 8px 30px rgba(102,126,234,0.25)" }}
          >
            {loading ? "Conectando..." : "Conectar cuenta"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Main dashboard (connected) ─────────────────────────── */

function Dashboard() {
  const W = 900, H = 220;
  const equityPath = buildPath(EQUITY_POINTS, W, H);
  const minY = H - 20;
  const fillPath = `M 20,${minY} L ${equityPath} L ${W - 20},${minY} Z`;
  const linePath = `M ${equityPath}`;

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <section className="pt-32 pb-10 px-5">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-[1.6rem] font-black text-white">Mis Métricas</h1>
                <span className="px-2.5 py-1 rounded-full text-[0.65rem] font-bold text-[#4ade80] border border-[#4ade80]/30 bg-[#4ade80]/10 uppercase tracking-wider">● Live</span>
              </div>
              <p className="text-white/35 text-sm">IC Markets · MT5 · Cuenta #12345 · Desde Mar 2023</p>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[0.8rem] text-white/50 hover:text-white transition-colors"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Enlace público
            </button>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl p-5"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="text-[0.62rem] uppercase tracking-widest text-white/30 mb-2">{s.label}</div>
                <div className="text-[1.5rem] font-black leading-none" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[0.65rem] text-white/25 mt-1.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equity Curve */}
      <section className="py-6 px-5">
        <div className="max-w-[1100px] mx-auto">
          <div className="rounded-2xl p-6 md:p-8"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[1.1rem] font-black text-white">Equity Curve</h2>
                <p className="text-white/30 text-[0.78rem] mt-0.5">Balance real desde inicio</p>
              </div>
              <span className="text-white/25 text-[0.72rem]">Mar 2023 → Dic 2024</span>
            </div>
            <div className="w-full rounded-xl overflow-hidden" style={{ background: "rgba(0,0,0,0.2)" }}>
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: "200px" }} preserveAspectRatio="none">
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
                {[0.25, 0.5, 0.75].map((f) => (
                  <line key={f} x1={20} y1={20 + f * (H - 40)} x2={W - 20} y2={20 + f * (H - 40)}
                    stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                ))}
                <path d={fillPath} fill="url(#eqFill)" />
                <path d={linePath} fill="none" stroke="url(#eqLine)" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex justify-between mt-4 text-[0.72rem] text-white/30">
              <span>€14 800 inicio</span>
              <span className="text-[#4ade80] font-semibold">€24 847 actual (+€10 047)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Monthly P&L */}
      <section className="py-6 px-5">
        <div className="max-w-[1100px] mx-auto">
          <div className="rounded-2xl p-6 md:p-8"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="text-[1.1rem] font-black text-white mb-1">P&L Mensual</h2>
            <p className="text-white/30 text-[0.78rem] mb-6">Rendimiento por mes — 2024</p>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
              {MONTHLY_PNL.map((m) => {
                const isPos = m.pnl >= 0;
                const intensity = Math.min(Math.abs(m.pnl) / 1200, 1);
                const bg = isPos ? `rgba(74,222,128,${0.07 + intensity * 0.28})` : `rgba(248,113,113,${0.07 + intensity * 0.28})`;
                const border = isPos ? `rgba(74,222,128,${0.15 + intensity * 0.3})` : `rgba(248,113,113,${0.15 + intensity * 0.3})`;
                return (
                  <div key={m.month} className="rounded-xl p-3 text-center" style={{ background: bg, border: `1px solid ${border}` }}>
                    <div className="text-[0.6rem] text-white/35 mb-1.5">{m.month}</div>
                    <div className={`text-[0.7rem] font-black ${isPos ? "text-[#4ade80]" : "text-[#f87171]"}`}>{m.pct}</div>
                    <div className="text-[0.58rem] text-white/25 mt-0.5">{isPos ? "+" : ""}€{Math.abs(m.pnl)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Heatmap */}
      <section className="py-6 px-5">
        <div className="max-w-[1100px] mx-auto">
          <div className="rounded-2xl p-6 md:p-8"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="text-[1.1rem] font-black text-white mb-1">Mapa de Sesiones</h2>
            <p className="text-white/30 text-[0.78rem] mb-6">Actividad por día y hora (UTC)</p>
            <div className="overflow-x-auto">
              <div className="min-w-[520px]">
                <div className="flex gap-1 mb-1 ml-12">
                  {HOURS.map((h) => (
                    <div key={h} className="flex-1 text-center text-[0.58rem] text-white/20">{h}h</div>
                  ))}
                </div>
                {DAYS.map((day, di) => (
                  <div key={day} className="flex items-center gap-1 mb-1">
                    <div className="w-10 text-right pr-2 text-[0.62rem] text-white/30 shrink-0">{day}</div>
                    {HEATMAP[di].map((val, hi) => (
                      <div key={hi} className="flex-1 h-7 rounded-sm"
                        title={`${day} ${HOURS[hi]}h — ${val}%`}
                        style={{ background: `rgba(102,126,234,${0.04 + (val / 100) * 0.72})` }} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Symbols + Trades */}
      <section className="py-6 px-5 pb-20">
        <div className="max-w-[1100px] mx-auto grid lg:grid-cols-2 gap-6">
          {/* Symbols */}
          <div className="rounded-2xl p-6 md:p-8"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="text-[1.1rem] font-black text-white mb-1">Desglose por Símbolo</h2>
            <p className="text-white/30 text-[0.78rem] mb-6">Distribución del volumen operado</p>
            <div className="space-y-4">
              {SYMBOLS.map((s) => (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-black text-[0.9rem]" style={{ color: s.color }}>{s.name}</span>
                      <span className="text-[0.68rem] text-white/30">{s.trades} trades</span>
                    </div>
                    <div className="flex items-center gap-3 text-[0.76rem]">
                      <span className="text-white/40">{s.winRate}</span>
                      <span className="font-bold" style={{ color: s.pnl.startsWith("+") ? "#4ade80" : "#f87171" }}>{s.pnl}</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full" style={{ width: `${s.share}%`, background: s.color, opacity: 0.65 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trades */}
          <div className="rounded-2xl p-6 md:p-8"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="text-[1.1rem] font-black text-white mb-1">Últimas Operaciones</h2>
            <p className="text-white/30 text-[0.78rem] mb-6">6 trades más recientes</p>
            <div className="space-y-1">
              {LAST_TRADES.map((t, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-[0.85rem] font-bold text-white">{t.symbol}</div>
                      <div className="text-[0.62rem] text-white/25">{t.date}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[0.62rem] font-bold ${t.dir === "Long" ? "bg-[#4ade80]/10 text-[#4ade80]" : "bg-[#f87171]/10 text-[#f87171]"}`}>
                      {t.dir}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`text-[0.88rem] font-black ${t.pnl.startsWith("+") ? "text-[#4ade80]" : "text-[#f87171]"}`}>{t.pnl}</div>
                    <div className="text-[0.62rem] text-white/25">{t.pips} pips · {t.lots} lots</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ─── Page entry (client, checks auth + sub) ─────────────── */

export default function MetricasDashboardPage() {
  // In production this would check real auth + subscription status via API.
  // For now we simulate the "demo" connected state so the UI is visible.
  const [state, setState] = useState<AuthState>("loading");

  useEffect(() => {
    fetch("/api/auth/me")
      .then(async (r) => {
        if (!r.ok) { setState("unauthenticated"); return; }
        // TODO: check subscription → setState("no_subscription") if not subscribed
        // TODO: check if MT5 account is linked → setState("no_account") if not
        // For now: show demo dashboard
        setState("connected");
      })
      .catch(() => setState("unauthenticated"));
  }, []);

  if (state === "loading") return <LoadingScreen />;
  if (state === "unauthenticated") return <UnauthScreen />;
  if (state === "no_subscription") return <NoSubscriptionScreen />;
  if (state === "no_account") return <ConnectAccountScreen />;
  return <Dashboard />;
}
