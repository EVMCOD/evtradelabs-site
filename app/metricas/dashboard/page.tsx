"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

/* ─── Types ──────────────────────────────────────────────── */
type PageState = "loading" | "unauthenticated" | "setup" | "pending" | "connected";

interface MetricasAccount {
  apiKey: string;
  accountLogin: string | null;
  accountName: string | null;
  broker: string | null;
  server: string | null;
  currency: string;
  balance: number | null;
  equity: number | null;
  status: string;
  lastSyncAt: string | null;
  connectedAt: string | null;
}

interface Trade {
  ticket: string;
  symbol: string;
  type: string;
  lots: number;
  price: number;
  profit: number;
  commission: number;
  swap: number;
  entry: string;
  time: string;
  comment: string | null;
}

interface Snapshot {
  balance: number;
  equity: number;
  timestamp: string;
}

interface Stats {
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  netProfit: number;
  avgWin: number;
  avgLoss: number;
  symbols: { name: string; trades: number; profit: number; winRate: number; share: number }[];
}

/* ─── SVG equity curve ───────────────────────────────────── */
function buildPath(points: { y: number }[], w: number, h: number, pad = 16): string {
  if (points.length < 2) return "";
  const values = points.map((p) => p.y);
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1;
  const n = points.length;
  return points
    .map((p, i) => {
      const x = pad + (i / (n - 1)) * (w - pad * 2);
      const y = h - pad - ((p.y - min) / range) * (h - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" L ");
}

/* ─── Gate: not logged in ────────────────────────────────── */
function UnauthScreen() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-5">
      <div className="max-w-[400px] w-full text-center">
        <div className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: "rgba(102,126,234,0.1)", border: "1px solid rgba(102,126,234,0.2)" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="#667eea" strokeWidth="1.5"/>
            <path d="M7 11V7a5 5 0 0110 0v4" stroke="#667eea" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 className="text-[1.5rem] font-black text-white mb-3">Inicia sesión</h2>
        <p className="text-white/40 text-sm mb-8">Necesitas una cuenta para acceder a tus métricas.</p>
        <div className="flex flex-col gap-3">
          <Link href="/login" className="block w-full py-3.5 rounded-xl font-bold text-center text-white"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
            Iniciar sesión
          </Link>
          <Link href="/register" className="block w-full py-3.5 rounded-xl font-semibold text-center border border-white/10 text-white/60 hover:text-white transition-all">
            Crear cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Setup: show API key + EA instructions ──────────────── */
function SetupScreen({ account, onRegenerate }: { account: MetricasAccount; onRegenerate: () => void }) {
  const [copied, setCopied] = useState(false);
  const [regen, setRegen] = useState(false);

  const copyKey = () => {
    navigator.clipboard.writeText(account.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegen = async () => {
    setRegen(true);
    await fetch("/api/metricas/connect", { method: "POST" });
    onRegenerate();
    setRegen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-[680px] mx-auto px-5 pt-32 pb-20">
        <Link href="/metricas" className="text-white/30 text-sm hover:text-white transition-colors">← EV Métricas</Link>

        <div className="mt-8 mb-10">
          <h1 className="text-[1.8rem] font-black text-white mb-2">Conecta tu cuenta MT5</h1>
          <p className="text-white/40 text-[0.95rem]">Instala el EA en cualquier gráfico. Listo.</p>
        </div>

        {/* Step 1: API Key */}
        <div className="rounded-2xl p-6 mb-4"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[0.75rem] font-black text-[#667eea]"
              style={{ background: "rgba(102,126,234,0.12)", border: "1px solid rgba(102,126,234,0.2)" }}>1</div>
            <h2 className="font-bold text-white">Tu API Key</h2>
          </div>
          <p className="text-white/40 text-sm mb-4">Copia esta clave. La pegarás en los parámetros del EA.</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-4 py-3 rounded-xl text-[0.82rem] text-[#a78bfa] font-mono break-all"
              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(167,139,250,0.15)" }}>
              {account.apiKey}
            </code>
            <button onClick={copyKey}
              className="shrink-0 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ background: copied ? "rgba(74,222,128,0.15)" : "rgba(102,126,234,0.15)", border: `1px solid ${copied ? "rgba(74,222,128,0.3)" : "rgba(102,126,234,0.3)"}`, color: copied ? "#4ade80" : "#a78bfa" }}>
              {copied ? "✓ Copiada" : "Copiar"}
            </button>
          </div>
          <button onClick={handleRegen} disabled={regen}
            className="mt-3 text-[0.75rem] text-white/25 hover:text-white/50 transition-colors">
            {regen ? "Regenerando..." : "Regenerar clave"}
          </button>
        </div>

        {/* Step 2: Download EA */}
        <div className="rounded-2xl p-6 mb-4"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[0.75rem] font-black text-[#667eea]"
              style={{ background: "rgba(102,126,234,0.12)", border: "1px solid rgba(102,126,234,0.2)" }}>2</div>
            <h2 className="font-bold text-white">Descarga el EA</h2>
          </div>
          <p className="text-white/40 text-sm mb-4">
            Coloca el archivo <code className="text-white/60 text-[0.8rem]">EVMetricas.mq5</code> en la carpeta{" "}
            <code className="text-white/60 text-[0.8rem]">MQL5/Experts/</code> de tu MetaTrader 5.
          </p>
          <a href="/ea/EVMetricas.mq5" download
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", boxShadow: "0 6px 20px rgba(102,126,234,0.25)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Descargar EVMetricas.mq5
          </a>
        </div>

        {/* Step 3: Allow URL in MT5 */}
        <div className="rounded-2xl p-6 mb-4"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[0.75rem] font-black text-[#667eea]"
              style={{ background: "rgba(102,126,234,0.12)", border: "1px solid rgba(102,126,234,0.2)" }}>3</div>
            <h2 className="font-bold text-white">Permite las peticiones web en MT5</h2>
          </div>
          <p className="text-white/40 text-sm mb-3">
            En MT5: <span className="text-white/60">Herramientas → Opciones → Asesores Expertos</span>
          </p>
          <div className="flex items-start gap-3 p-4 rounded-xl text-sm text-white/40"
            style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <span className="text-white/20 shrink-0 mt-0.5">→</span>
            <span>Activa <strong className="text-white/60">«Permitir WebRequest para las URLs listadas»</strong> y añade:
              <code className="block mt-1 text-[#a78bfa] text-[0.8rem]">https://evtradelabs.com</code>
            </span>
          </div>
        </div>

        {/* Step 4: Attach EA */}
        <div className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[0.75rem] font-black text-[#667eea]"
              style={{ background: "rgba(102,126,234,0.12)", border: "1px solid rgba(102,126,234,0.2)" }}>4</div>
            <h2 className="font-bold text-white">Adjunta el EA a cualquier gráfico</h2>
          </div>
          <p className="text-white/40 text-sm">
            Compila el EA (F7), arrástralo a cualquier gráfico abierto en MT5 y pega tu API Key en el campo <strong className="text-white/60">API Key</strong>. El dashboard se actualizará en segundos.
          </p>
        </div>

        <div className="mt-8 flex items-center gap-3 p-4 rounded-xl text-sm text-white/40"
          style={{ background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.12)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#4ade80" strokeWidth="1.5"/>
          </svg>
          <span>El EA solo envía datos de tu historial y balance. <strong className="text-white/60">No puede abrir, modificar ni cerrar operaciones.</strong></span>
        </div>
      </div>
    </div>
  );
}

/* ─── Pending: API key exists, EA not yet connected ──────── */
function PendingScreen({ account, onRegenerate }: { account: MetricasAccount; onRegenerate: () => void }) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-5">
      <div className="max-w-[480px] w-full text-center">
        <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ background: "rgba(102,126,234,0.1)", border: "1px solid rgba(102,126,234,0.2)" }}>
          <div className="w-4 h-4 rounded-full border-2 border-[#667eea]/40 border-t-[#667eea] animate-spin" />
        </div>
        <h2 className="text-[1.5rem] font-black text-white mb-3">Esperando al EA</h2>
        <p className="text-white/40 text-sm leading-relaxed mb-6">
          Tu API key está lista. Instala el EA en MT5 y adjúntalo a un gráfico. El dashboard aparecerá automáticamente en cuanto el EA envíe los primeros datos.
        </p>
        <div className="p-4 rounded-xl mb-6 text-left"
          style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="text-[0.65rem] text-white/30 uppercase tracking-wider mb-1.5">Tu API Key</div>
          <code className="text-[0.8rem] text-[#a78bfa] font-mono break-all">{account.apiKey}</code>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={onRegenerate}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all">
            Ver instrucciones
          </button>
          <a href="/ea/EVMetricas.mq5" download
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
            Descargar EA
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Full dashboard ─────────────────────────────────────── */
function Dashboard({ account, trades, snapshots, stats }: {
  account: MetricasAccount;
  trades: Trade[];
  snapshots: Snapshot[];
  stats: Stats;
}) {
  const W = 900, H = 200;
  const snapPts = snapshots.map((s) => ({ y: s.balance }));
  const equityPath = buildPath(snapPts, W, H);
  const fillPath = snapPts.length >= 2
    ? `M 16,${H - 16} L ${equityPath} L ${W - 16},${H - 16} Z`
    : "";

  const closed = trades.filter((t) => t.entry === "out");
  const recent = closed.slice(0, 8);

  // Monthly P&L from closed trades
  const monthlyMap: Record<string, number> = {};
  for (const t of closed) {
    const d = new Date(t.time);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap[key] = (monthlyMap[key] ?? 0) + t.profit + t.commission + t.swap;
  }
  const monthlyEntries = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12);

  const fmt = (n: number) =>
    (n >= 0 ? "+" : "") + account.currency + " " + Math.abs(n).toFixed(2);
  const lastSyncLabel = account.lastSyncAt
    ? new Date(account.lastSyncAt).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
    : "—";

  const SYMBOL_COLORS = ["#f59e0b", "#60a5fa", "#4ade80", "#a78bfa", "#f87171", "#34d399", "#fb923c", "#c084fc"];

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <section className="pt-32 pb-8 px-5">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-[1.5rem] font-black">Mis Métricas</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold text-[#4ade80] border border-[#4ade80]/30 bg-[#4ade80]/10 uppercase tracking-wider">
                  ● Live
                </span>
              </div>
              <p className="text-white/30 text-sm">
                {account.broker ?? "—"} · {account.server ?? "—"} · #{account.accountLogin ?? "—"} · Sync {lastSyncLabel}
              </p>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(window.location.origin + "/metricas/public/" + account.accountLogin)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[0.8rem] text-white/50 hover:text-white transition-all"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Copiar enlace público
            </button>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "Balance", value: account.currency + " " + (account.balance?.toFixed(2) ?? "—"), color: "#a78bfa" },
              { label: "Equity", value: account.currency + " " + (account.equity?.toFixed(2) ?? "—"), color: "#4ade80" },
              { label: "Profit Factor", value: stats.profitFactor.toFixed(2), color: "#60a5fa" },
              { label: "Win Rate", value: stats.winRate.toFixed(1) + "%", color: "#f59e0b" },
              { label: "Net Profit", value: fmt(stats.netProfit), color: stats.netProfit >= 0 ? "#4ade80" : "#f87171" },
              { label: "Trades", value: String(stats.totalTrades), color: "#34d399" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl p-5"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="text-[0.62rem] uppercase tracking-widest text-white/30 mb-2">{s.label}</div>
                <div className="text-[1.3rem] font-black leading-none truncate" style={{ color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equity Curve */}
      {snapshots.length >= 2 && (
        <section className="py-6 px-5">
          <div className="max-w-[1100px] mx-auto">
            <div className="rounded-2xl p-6 md:p-8"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h2 className="text-[1.05rem] font-black mb-4">Equity Curve</h2>
              <div className="rounded-xl overflow-hidden" style={{ background: "rgba(0,0,0,0.2)" }}>
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: "180px" }} preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#667eea" stopOpacity="0.25"/>
                      <stop offset="100%" stopColor="#667eea" stopOpacity="0.01"/>
                    </linearGradient>
                    <linearGradient id="eqLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#667eea"/>
                      <stop offset="100%" stopColor="#a78bfa"/>
                    </linearGradient>
                  </defs>
                  {[0.25, 0.5, 0.75].map((f) => (
                    <line key={f} x1={16} y1={16 + f * (H - 32)} x2={W - 16} y2={16 + f * (H - 32)}
                      stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
                  ))}
                  {fillPath && <path d={fillPath} fill="url(#eqFill)"/>}
                  {equityPath && <path d={`M ${equityPath}`} fill="none" stroke="url(#eqLine)" strokeWidth="2" strokeLinejoin="round"/>}
                </svg>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Monthly P&L */}
      {monthlyEntries.length > 0 && (
        <section className="py-6 px-5">
          <div className="max-w-[1100px] mx-auto">
            <div className="rounded-2xl p-6 md:p-8"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h2 className="text-[1.05rem] font-black mb-6">P&L Mensual</h2>
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
                {monthlyEntries.map(([key, val]) => {
                  const isPos = val >= 0;
                  const maxAbs = Math.max(...monthlyEntries.map(([, v]) => Math.abs(v)));
                  const intensity = maxAbs > 0 ? Math.abs(val) / maxAbs : 0;
                  const bg = isPos ? `rgba(74,222,128,${0.07 + intensity * 0.28})` : `rgba(248,113,113,${0.07 + intensity * 0.28})`;
                  const border = isPos ? `rgba(74,222,128,${0.15 + intensity * 0.3})` : `rgba(248,113,113,${0.15 + intensity * 0.3})`;
                  const [, month] = key.split("-");
                  const monthNames = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
                  return (
                    <div key={key} className="rounded-xl p-3 text-center" style={{ background: bg, border: `1px solid ${border}` }}>
                      <div className="text-[0.6rem] text-white/35 mb-1.5">{monthNames[parseInt(month) - 1]}</div>
                      <div className={`text-[0.68rem] font-black ${isPos ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                        {isPos ? "+" : ""}{val.toFixed(0)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Symbols + Recent trades */}
      <section className="py-6 px-5 pb-20">
        <div className="max-w-[1100px] mx-auto grid lg:grid-cols-2 gap-6">

          {/* Symbols */}
          {stats.symbols.length > 0 && (
            <div className="rounded-2xl p-6 md:p-8"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h2 className="text-[1.05rem] font-black mb-6">Desglose por Símbolo</h2>
              <div className="space-y-4">
                {stats.symbols.map((s, i) => (
                  <div key={s.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="font-black text-[0.88rem]" style={{ color: SYMBOL_COLORS[i % SYMBOL_COLORS.length] }}>{s.name}</span>
                        <span className="text-[0.68rem] text-white/30">{s.trades} trades</span>
                      </div>
                      <div className="flex items-center gap-3 text-[0.76rem]">
                        <span className="text-white/40">{s.winRate.toFixed(1)}%</span>
                        <span className="font-bold" style={{ color: s.profit >= 0 ? "#4ade80" : "#f87171" }}>
                          {s.profit >= 0 ? "+" : ""}{account.currency} {Math.abs(s.profit).toFixed(0)}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-full rounded-full" style={{ width: `${s.share}%`, background: SYMBOL_COLORS[i % SYMBOL_COLORS.length], opacity: 0.65 }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent trades */}
          {recent.length > 0 && (
            <div className="rounded-2xl p-6 md:p-8"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h2 className="text-[1.05rem] font-black mb-6">Últimas Operaciones</h2>
              <div className="space-y-1">
                {recent.map((t, i) => {
                  const net = t.profit + t.commission + t.swap;
                  return (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="text-[0.85rem] font-bold">{t.symbol}</div>
                          <div className="text-[0.62rem] text-white/25">{t.time.slice(0, 10)}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-md text-[0.62rem] font-bold ${t.type === "buy" ? "bg-[#4ade80]/10 text-[#4ade80]" : "bg-[#f87171]/10 text-[#f87171]"}`}>
                          {t.type === "buy" ? "Long" : "Short"}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={`text-[0.88rem] font-black ${net >= 0 ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                          {net >= 0 ? "+" : ""}{account.currency} {Math.abs(net).toFixed(2)}
                        </div>
                        <div className="text-[0.62rem] text-white/25">{t.lots} lots</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

/* ─── Page entry ─────────────────────────────────────────── */
export default function MetricasDashboardPage() {
  const [state, setState] = useState<PageState>("loading");
  const [account, setAccount] = useState<MetricasAccount | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  const load = useCallback(async () => {
    // 1. Auth check
    const authRes = await fetch("/api/auth/me").catch(() => null);
    if (!authRes?.ok) { setState("unauthenticated"); return; }

    // 2. Get/create API key
    const connectRes = await fetch("/api/metricas/connect").catch(() => null);
    if (!connectRes?.ok) { setState("setup"); return; }
    const { account: acc } = await connectRes.json();
    setAccount(acc);

    // 3. If EA hasn't connected yet, show setup
    if (!acc.connectedAt) { setState("setup"); return; }

    // 4. Load metrics data
    const dataRes = await fetch("/api/metricas/data").catch(() => null);
    if (!dataRes?.ok) { setState("pending"); return; }
    const data = await dataRes.json();

    if (data.stats) {
      setTrades(data.trades ?? []);
      setSnapshots(data.snapshots ?? []);
      setStats(data.stats);
      setState("connected");
    } else {
      setState("pending");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Poll every 30s when connected or pending
  useEffect(() => {
    if (state !== "connected" && state !== "pending") return;
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, [state, load]);

  if (state === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-[#667eea]/30 border-t-[#667eea] animate-spin"/>
      </div>
    );
  }
  if (state === "unauthenticated") return <UnauthScreen />;
  if (state === "setup") return <SetupScreen account={account!} onRegenerate={load} />;
  if (state === "pending") return <PendingScreen account={account!} onRegenerate={() => setState("setup")} />;
  return <Dashboard account={account!} trades={trades} snapshots={snapshots} stats={stats!} />;
}
