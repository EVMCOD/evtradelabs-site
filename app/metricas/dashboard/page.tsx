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

/* ─── Helpers ────────────────────────────────────────────── */
const cur = (account: MetricasAccount, n: number) =>
  (n >= 0 ? "+" : "-") + account.currency + " " + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const dateLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "2-digit" });

const timeAgo = (iso: string) => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `hace ${s}s`;
  if (s < 3600) return `hace ${Math.floor(s / 60)}m`;
  return `hace ${Math.floor(s / 3600)}h`;
};

/* ─── Equity curve SVG ────────────────────────────────────── */
function EquityCurve({ snapshots }: { snapshots: Snapshot[] }) {
  if (snapshots.length < 2) return null;
  const W = 1000, H = 220, PAD = { t: 20, r: 20, b: 36, l: 60 };
  const values = snapshots.map((s) => s.balance);
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1;
  const n = snapshots.length;

  const px = (i: number) => PAD.l + (i / (n - 1)) * (W - PAD.l - PAD.r);
  const py = (v: number) => PAD.t + (1 - (v - min) / range) * (H - PAD.t - PAD.b);

  const linePts = snapshots.map((s, i) => `${px(i).toFixed(1)},${py(s.balance).toFixed(1)}`).join(" L ");
  const fillPts = `M ${px(0).toFixed(1)},${(H - PAD.b).toFixed(1)} L ${linePts} L ${px(n - 1).toFixed(1)},${(H - PAD.b).toFixed(1)} Z`;

  const lastX = px(n - 1), lastY = py(values[n - 1]);
  const isUp = values[n - 1] >= values[0];

  // Y-axis labels (3 levels)
  const yLevels = [min, min + range / 2, max];
  // X-axis: first, mid, last
  const xLabels = [0, Math.floor(n / 2), n - 1].map((i) => ({
    x: px(i),
    label: dateLabel(snapshots[i].timestamp),
  }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 220 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isUp ? "#3b82f6" : "#ef4444"} stopOpacity="0.18" />
          <stop offset="100%" stopColor={isUp ? "#3b82f6" : "#ef4444"} stopOpacity="0.01" />
        </linearGradient>
        <linearGradient id="eqLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={isUp ? "#60a5fa" : "#f87171"} />
          <stop offset="100%" stopColor={isUp ? "#3b82f6" : "#ef4444"} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Grid lines */}
      {yLevels.map((v, i) => (
        <g key={i}>
          <line x1={PAD.l} y1={py(v)} x2={W - PAD.r} y2={py(v)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
          <text x={PAD.l - 6} y={py(v) + 4} textAnchor="end" fontSize="10" fill="rgba(255,255,255,0.3)">
            {v.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </text>
        </g>
      ))}

      {/* X labels */}
      {xLabels.map((l, i) => (
        <text key={i} x={l.x} y={H - 6} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.25)">{l.label}</text>
      ))}

      {/* Fill + line */}
      <path d={fillPts} fill="url(#eqFill)" />
      <path d={`M ${linePts}`} fill="none" stroke="url(#eqLine)" strokeWidth="2" strokeLinejoin="round" />

      {/* Last point glow dot */}
      <circle cx={lastX} cy={lastY} r="5" fill={isUp ? "#3b82f6" : "#ef4444"} filter="url(#glow)" />
      <circle cx={lastX} cy={lastY} r="3" fill="white" />
    </svg>
  );
}

/* ─── Monthly P&L bar chart ──────────────────────────────── */
function MonthlyPnL({ trades, currency }: { trades: Trade[]; currency: string }) {
  const monthlyMap: Record<string, number> = {};
  const MONTH_NAMES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

  for (const t of trades) {
    if (t.entry !== "out") continue;
    const d = new Date(t.time);
    if (isNaN(d.getTime())) continue;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap[key] = (monthlyMap[key] ?? 0) + t.profit + t.commission + t.swap;
  }

  const entries = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12);

  if (entries.length === 0) return null;

  const maxAbs = Math.max(...entries.map(([, v]) => Math.abs(v)), 1);

  return (
    <div>
      <div className="flex items-end gap-1.5 h-24">
        {entries.map(([key, val]) => {
          const isPos = val >= 0;
          const pct = (Math.abs(val) / maxAbs) * 100;
          const [, mm] = key.split("-");
          return (
            <div key={key} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="relative w-full flex flex-col justify-end" style={{ height: 80 }}>
                <div
                  className="w-full rounded-t-sm transition-all"
                  style={{
                    height: `${Math.max(pct, 4)}%`,
                    background: isPos
                      ? "linear-gradient(to top, #1d4ed8, #3b82f6)"
                      : "linear-gradient(to top, #991b1b, #ef4444)",
                    boxShadow: isPos ? "0 0 8px rgba(59,130,246,0.3)" : "0 0 8px rgba(239,68,68,0.3)",
                  }}
                />
                {/* Tooltip */}
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[#1a1f2e] border border-white/10 rounded px-2 py-1 text-[0.6rem] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <span className={isPos ? "text-blue-400" : "text-red-400"}>
                    {isPos ? "+" : ""}{currency} {val.toFixed(2)}
                  </span>
                </div>
              </div>
              <span className="text-[0.58rem] text-white/30">{MONTH_NAMES[parseInt(mm) - 1]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Gate screens ───────────────────────────────────────── */
function UnauthScreen() {
  return (
    <div className="min-h-screen bg-[#080b12] flex items-center justify-center px-5">
      <div className="max-w-[400px] w-full text-center">
        <div className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="#3b82f6" strokeWidth="1.5"/>
            <path d="M7 11V7a5 5 0 0110 0v4" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 className="text-2xl font-black text-white mb-3">Inicia sesión</h2>
        <p className="text-white/40 text-sm mb-8">Necesitas una cuenta para ver tus métricas.</p>
        <Link href="/login" className="block w-full py-3.5 rounded-xl font-bold text-center text-white"
          style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
          Iniciar sesión
        </Link>
      </div>
    </div>
  );
}

function SetupScreen({ account, onRegenerate }: { account: MetricasAccount; onRegenerate: () => void }) {
  const [copied, setCopied] = useState(false);
  const copyKey = () => {
    navigator.clipboard.writeText(account.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="min-h-screen bg-[#080b12] text-white">
      <div className="max-w-[680px] mx-auto px-5 pt-32 pb-20">
        <Link href="/metricas" className="text-white/30 text-sm hover:text-white transition-colors">← EV Métricas</Link>
        <div className="mt-8 mb-10">
          <h1 className="text-3xl font-black mb-2">Conecta tu cuenta MT5</h1>
          <p className="text-white/40 text-sm">Instala el EA en cualquier gráfico. Listo en segundos.</p>
        </div>
        {[
          {
            n: 1, title: "Tu API Key",
            body: (
              <div>
                <p className="text-white/40 text-sm mb-4">Copia esta clave y pégala en los parámetros del EA.</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-4 py-3 rounded-xl text-sm text-blue-400 font-mono break-all"
                    style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(59,130,246,0.15)" }}>
                    {account.apiKey}
                  </code>
                  <button onClick={copyKey}
                    className="shrink-0 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: copied ? "rgba(34,197,94,0.15)" : "rgba(59,130,246,0.15)", border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "rgba(59,130,246,0.3)"}`, color: copied ? "#22c55e" : "#60a5fa" }}>
                    {copied ? "✓ Copiada" : "Copiar"}
                  </button>
                </div>
              </div>
            ),
          },
          {
            n: 2, title: "Descarga el EA",
            body: (
              <div>
                <p className="text-white/40 text-sm mb-4">Coloca <code className="text-white/60 text-xs">EVTradeLabs_Sync.mq5</code> en <code className="text-white/60 text-xs">MQL5/Experts/</code></p>
                <a href="https://github.com/EVMCOD/evtradelabs-site/raw/main/EVTradeLabs_Sync.mq5"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Descargar EA
                </a>
              </div>
            ),
          },
          {
            n: 3, title: "Permite WebRequest en MT5",
            body: (
              <p className="text-white/40 text-sm">
                Herramientas → Opciones → Asesores Expertos → activa WebRequest y añade{" "}
                <code className="text-blue-400 text-xs">https://evtradelabs.com</code>
              </p>
            ),
          },
          {
            n: 4, title: "Adjunta el EA a cualquier gráfico",
            body: <p className="text-white/40 text-sm">Compila (F7), arrastra a un gráfico, pega tu API Key. El dashboard se actualiza en segundos.</p>,
          },
        ].map(({ n, title, body }) => (
          <div key={n} className="rounded-2xl p-6 mb-4"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-blue-400"
                style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}>{n}</div>
              <h2 className="font-bold">{title}</h2>
            </div>
            {body}
          </div>
        ))}
      </div>
    </div>
  );
}

function PendingScreen({ account, onShowSetup }: { account: MetricasAccount; onShowSetup: () => void }) {
  return (
    <div className="min-h-screen bg-[#080b12] flex items-center justify-center px-5">
      <div className="max-w-[480px] w-full text-center">
        <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}>
          <div className="w-5 h-5 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
        </div>
        <h2 className="text-2xl font-black text-white mb-3">Esperando conexión</h2>
        <p className="text-white/40 text-sm mb-6">El EA se sincronizará en los próximos 60 segundos.</p>
        <code className="block text-xs text-blue-400 font-mono p-4 rounded-xl mb-6"
          style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(59,130,246,0.1)" }}>
          {account.apiKey}
        </code>
        <button onClick={onShowSetup}
          className="px-6 py-3 rounded-xl text-sm font-semibold border border-white/10 text-white/50 hover:text-white transition-all">
          Ver instrucciones
        </button>
      </div>
    </div>
  );
}

/* ─── Stat card ──────────────────────────────────────────── */
function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-1"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <span className="text-[0.62rem] uppercase tracking-widest font-semibold" style={{ color: color + "99" }}>{label}</span>
      <span className="text-[1.45rem] font-black leading-none" style={{ color }}>{value}</span>
      {sub && <span className="text-[0.68rem] text-white/25 mt-0.5">{sub}</span>}
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
  const closed = trades.filter((t) => t.entry === "out");
  const recent = closed.slice(0, 10);
  const net = (t: Trade) => t.profit + t.commission + t.swap;

  const lastSyncAgo = account.lastSyncAt ? timeAgo(account.lastSyncAt) : "—";

  return (
    <main className="min-h-screen bg-[#080b12] text-white">

      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="pt-24 pb-0 px-5">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-3 py-5 border-b border-white/[0.05]">
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-0.5">
                  <h1 className="text-lg font-black">Mis Métricas</h1>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[0.6rem] font-bold text-emerald-400 border border-emerald-500/25 bg-emerald-500/8 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </span>
                </div>
                <p className="text-white/30 text-xs">
                  {account.broker ?? "—"} · {account.server ?? "—"} · #{account.accountLogin ?? "—"}
                  <span className="ml-3 text-white/20">Sync {lastSyncAgo}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(window.location.origin + "/metricas/public/" + account.accountLogin)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs text-white/40 hover:text-white/70 transition-all border border-white/[0.07] hover:border-white/15">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Compartir
            </button>
          </div>
        </div>
      </div>

      {/* ── KPI row ─────────────────────────────────────────── */}
      <section className="px-5 py-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard label="Balance"       value={(account.currency ?? "") + " " + (account.balance?.toLocaleString("en-US", { minimumFractionDigits: 2 }) ?? "—")}  color="#a78bfa" />
          <StatCard label="Equity"        value={(account.currency ?? "") + " " + (account.equity?.toLocaleString("en-US", { minimumFractionDigits: 2 }) ?? "—")}   color="#60a5fa" />
          <StatCard label="Net Profit"    value={cur(account, stats.netProfit)}  color={stats.netProfit >= 0 ? "#4ade80" : "#f87171"} sub={`${stats.netProfit >= 0 ? "+" : ""}${((stats.netProfit / (account.balance ?? 1)) * 100).toFixed(2)}%`} />
          <StatCard label="Win Rate"      value={stats.winRate.toFixed(1) + "%"} color="#f59e0b" sub={`${stats.totalTrades} operaciones`} />
          <StatCard label="Profit Factor" value={stats.profitFactor.toFixed(2)}  color="#34d399" sub={`Avg win: ${account.currency} ${stats.avgWin.toFixed(0)}`} />
          <StatCard label="Avg Loss"      value={account.currency + " " + stats.avgLoss.toFixed(0)}  color="#fb923c" sub={`Avg win / loss: ${stats.avgLoss > 0 ? (stats.avgWin / stats.avgLoss).toFixed(2) : "—"}`} />
        </div>
      </section>

      {/* ── Equity curve + Account info ─────────────────────── */}
      <section className="px-5 pb-5">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[1fr_280px] gap-4">

          {/* Curve */}
          <div className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="px-6 pt-5 pb-2 flex items-center justify-between">
              <h2 className="font-black text-sm">Equity Curve</h2>
              <span className="text-xs text-white/25">{snapshots.length} puntos</span>
            </div>
            <div className="px-2 pb-3">
              {snapshots.length >= 2
                ? <EquityCurve snapshots={snapshots} />
                : <div className="flex items-center justify-center h-40 text-white/20 text-sm">Acumulando datos…</div>
              }
            </div>
          </div>

          {/* Account info */}
          <div className="rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="font-black text-sm mb-1">Cuenta</h2>
            {[
              { label: "Broker",    value: account.broker    ?? "—" },
              { label: "Servidor",  value: account.server    ?? "—" },
              { label: "Login",     value: "#" + (account.accountLogin ?? "—") },
              { label: "Moneda",    value: account.currency },
              { label: "Apalanca.", value: account.leverage ? "1:" + (account as any).leverage : "—" },
              { label: "Conectado", value: account.connectedAt ? dateLabel(account.connectedAt) : "—" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between border-b border-white/[0.04] pb-3 last:border-0 last:pb-0">
                <span className="text-xs text-white/30">{label}</span>
                <span className="text-xs font-semibold text-white/70 text-right max-w-[150px] truncate">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── P&L Mensual + Símbolo breakdown ─────────────────── */}
      <section className="px-5 pb-5">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-4">

          {/* Monthly */}
          <div className="rounded-2xl p-6"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-sm">P&L Mensual</h2>
              <span className="text-xs text-white/25 font-mono">{account.currency}</span>
            </div>
            <MonthlyPnL trades={trades} currency={account.currency} />
          </div>

          {/* Symbols */}
          <div className="rounded-2xl p-6"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="font-black text-sm mb-6">Por Símbolo</h2>
            <div className="space-y-4">
              {stats.symbols.map((s, i) => {
                const COLS = ["#f59e0b","#60a5fa","#4ade80","#a78bfa","#f87171","#34d399","#fb923c","#c084fc"];
                const c = COLS[i % COLS.length];
                return (
                  <div key={s.name}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black" style={{ color: c }}>{s.name}</span>
                        <span className="text-[0.65rem] text-white/25">{s.trades} ops</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-white/35">{s.winRate.toFixed(1)}%</span>
                        <span className="font-bold" style={{ color: s.profit >= 0 ? "#4ade80" : "#f87171" }}>
                          {s.profit >= 0 ? "+" : ""}{account.currency} {Math.abs(s.profit).toLocaleString("en-US", { minimumFractionDigits: 0 })}
                        </span>
                      </div>
                    </div>
                    <div className="h-1 rounded-full bg-white/5">
                      <div className="h-full rounded-full" style={{ width: `${s.share}%`, background: c, opacity: 0.6 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trades table ─────────────────────────────────────── */}
      {recent.length > 0 && (
        <section className="px-5 pb-20">
          <div className="max-w-[1200px] mx-auto">
            <div className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="px-6 py-5 border-b border-white/[0.05] flex items-center justify-between">
                <h2 className="font-black text-sm">Últimas Operaciones</h2>
                <span className="text-xs text-white/25">{closed.length} cerradas en total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.04]">
                      {["Símbolo","Tipo","Lots","Resultado","Comis.","Swap","Neto","Fecha"].map((h) => (
                        <th key={h} className="px-6 py-3 text-left font-semibold text-white/25 uppercase tracking-wider text-[0.6rem]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((t, i) => {
                      const n = net(t);
                      return (
                        <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-3.5 font-bold text-white/80">{t.symbol}</td>
                          <td className="px-6 py-3.5">
                            <span className={`px-2 py-0.5 rounded text-[0.6rem] font-bold ${t.type === "buy" ? "bg-blue-500/10 text-blue-400" : "bg-red-500/10 text-red-400"}`}>
                              {t.type === "buy" ? "Long" : "Short"}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 text-white/40 font-mono">{t.lots}</td>
                          <td className="px-6 py-3.5 font-mono" style={{ color: t.profit >= 0 ? "#4ade80" : "#f87171" }}>
                            {t.profit >= 0 ? "+" : ""}{t.profit.toFixed(2)}
                          </td>
                          <td className="px-6 py-3.5 font-mono text-white/30">{t.commission.toFixed(2)}</td>
                          <td className="px-6 py-3.5 font-mono text-white/30">{t.swap.toFixed(2)}</td>
                          <td className="px-6 py-3.5 font-bold font-mono" style={{ color: n >= 0 ? "#4ade80" : "#f87171" }}>
                            {n >= 0 ? "+" : ""}{n.toFixed(2)}
                          </td>
                          <td className="px-6 py-3.5 text-white/25">
                            {new Date(t.time).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}
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
    const authRes = await fetch("/api/auth/me").catch(() => null);
    if (!authRes?.ok) { setState("unauthenticated"); return; }

    const connectRes = await fetch("/api/metricas/connect").catch(() => null);
    if (!connectRes?.ok) { setState("setup"); return; }
    const { account: acc } = await connectRes.json();
    setAccount(acc);

    if (!acc.connectedAt) { setState("setup"); return; }

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

  useEffect(() => {
    if (state !== "connected" && state !== "pending") return;
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, [state, load]);

  if (state === "loading") {
    return (
      <div className="min-h-screen bg-[#080b12] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
      </div>
    );
  }
  if (state === "unauthenticated") return <UnauthScreen />;
  if (state === "setup")          return <SetupScreen account={account!} onRegenerate={load} />;
  if (state === "pending")        return <PendingScreen account={account!} onShowSetup={() => setState("setup")} />;
  return <Dashboard account={account!} trades={trades} snapshots={snapshots} stats={stats!} />;
}
