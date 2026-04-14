"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";

/* ─── Types ──────────────────────────────────────────────── */
type PageState = "loading" | "unauthenticated" | "setup" | "pending" | "connected";
type AnalyticsTab = "horas" | "dias" | "meses" | "activos";

interface MetricasAccount {
  apiKey: string;
  accountLogin: string | null;
  accountName: string | null;
  broker: string | null;
  server: string | null;
  currency: string;
  balance: number | null;
  equity: number | null;
  leverage: number | null;
  status: string;
  lastSyncAt: string | null;
  connectedAt: string | null;
}

interface Position {
  positionId: string;
  symbol: string;
  type: string;
  lots: number;
  openPrice: number | null;
  openTime: string | null;
  closePrice: number;
  closeTime: string;
  profit: number;
  commission: number;
  swap: number;
  mae: number | null;
  mfe: number | null;
  sl: number | null;
  tp: number | null;
  closeReason: string | null;
  comment: string | null;
}

interface Snapshot {
  balance: number;
  equity: number;
  timestamp: string;
}

interface BalanceOp {
  ticket: string;
  amount: number;
  type: string;
  time: string;
  comment: string | null;
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
const fmtNum = (n: number, dec = 2) =>
  n.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });

const fmtMoney = (cur: string, n: number) =>
  (n >= 0 ? "+" : "−") + cur + " " + fmtNum(Math.abs(n));

const dateShort = (iso: string) =>
  new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "short" });

const timeAgo = (iso: string) => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60)   return `hace ${s}s`;
  if (s < 3600) return `hace ${Math.floor(s / 60)}m`;
  return `hace ${Math.floor(s / 3600)}h`;
};

const net = (p: Position) => p.profit + p.commission + p.swap;

/* ─── Smooth bezier SVG path ─────────────────────────────── */
function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx.toFixed(1)} ${y0.toFixed(1)}, ${cx.toFixed(1)} ${y1.toFixed(1)}, ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  return d;
}

/* ─── Equity Curve ───────────────────────────────────────── */
function EquityCurve({ snapshots, balanceOps, currency }: { snapshots: Snapshot[]; balanceOps: BalanceOp[]; currency: string }) {
  if (snapshots.length < 2) {
    return <div className="flex items-center justify-center h-40 text-white/20 text-sm">Acumulando datos…</div>;
  }
  const W = 800, H = 170, PL = 4, PR = 4, PT = 10, PB = 10;
  const cW = W - PL - PR, cH = H - PT - PB;

  const tStart = new Date(snapshots[0].timestamp).getTime();
  const tEnd   = new Date(snapshots[snapshots.length - 1].timestamp).getTime();
  const tRange = tEnd - tStart || 1;

  const vals = snapshots.map((s) => s.balance);
  const min = Math.min(...vals), max = Math.max(...vals);
  const range = max - min || max * 0.01 || 1;
  const n = snapshots.length;

  const px = (i: number) => PL + (i / (n - 1)) * cW;
  const py = (v: number) => PT + (1 - (v - min) / range) * cH;
  const pxTime = (iso: string) => PL + ((new Date(iso).getTime() - tStart) / tRange) * cW;

  const pts: [number, number][] = snapshots.map((s, i) => [px(i), py(s.balance)]);
  const line = smoothPath(pts);
  const fill = `${line} L ${px(n-1).toFixed(1)} ${(PT+cH).toFixed(1)} L ${PL} ${(PT+cH).toFixed(1)} Z`;
  const [lx, ly] = pts[pts.length - 1];
  const isUp = vals[n - 1] >= vals[0];
  const col = isUp ? "#3b82f6" : "#ef4444";
  const pct = ((vals[n - 1] - vals[0]) / vals[0] * 100);

  // Balance ops within snapshot time range
  const visibleOps = balanceOps.filter((op) => {
    const t = new Date(op.time).getTime();
    return t >= tStart && t <= tEnd;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-white/30">
          {snapshots.length} puntos · {dateShort(snapshots[0].timestamp)} → {dateShort(snapshots[snapshots.length-1].timestamp)}
        </span>
        <span className="text-sm font-black" style={{ color: col }}>
          {pct >= 0 ? "+" : ""}{pct.toFixed(2)}%
        </span>
      </div>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 170, display: "block" }}>
          <defs>
            <linearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={col} stopOpacity="0.18"/>
              <stop offset="100%" stopColor={col} stopOpacity="0.01"/>
            </linearGradient>
            <filter id="dg"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>

          {/* Grid */}
          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1={PL} y1={PT + f*cH} x2={W-PR} y2={PT + f*cH} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
          ))}

          {/* Fill + line */}
          <path d={fill} fill="url(#eqFill)"/>
          <path d={line} fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round"/>

          {/* Balance op markers */}
          {visibleOps.map((op, i) => {
            const x = pxTime(op.time);
            const isDeposit = op.amount > 0;
            const mc = isDeposit ? "#22c55e" : "#f59e0b";
            const label = (isDeposit ? "+" : "−") + currency + " " + Math.abs(op.amount).toLocaleString("en-US", { maximumFractionDigits: 0 });
            const labelY = isDeposit ? PT + 14 : PT + cH - 4;
            return (
              <g key={i}>
                <line x1={x} y1={PT} x2={x} y2={PT + cH} stroke={mc} strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>
                <circle cx={x} cy={isDeposit ? PT + 4 : PT + cH - 4} r="3.5" fill={mc} opacity="0.9"/>
                <text x={x + 5} y={labelY} fontSize="9" fill={mc} opacity="0.85" fontWeight="600">{label}</text>
              </g>
            );
          })}

          {/* Last point dot */}
          <circle cx={lx} cy={ly} r="6" fill={col} opacity="0.2" filter="url(#dg)"/>
          <circle cx={lx} cy={ly} r="3" fill={col}/>
          <circle cx={lx} cy={ly} r="1.5" fill="white"/>
        </svg>

        {/* Y labels */}
        <div className="absolute top-0 right-0 h-full flex flex-col justify-between text-right pr-1 pointer-events-none" style={{ paddingTop: PT, paddingBottom: PB }}>
          {[max, min + range/2, min].map((v, i) => (
            <span key={i} className="text-[0.55rem] text-white/20 leading-none">{fmtNum(v, 0)}</span>
          ))}
        </div>
      </div>

      {/* Balance ops legend */}
      {balanceOps.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-white/[0.04]">
          {balanceOps.map((op, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[0.65rem]">
              <span className="w-2 h-2 rounded-full" style={{ background: op.amount > 0 ? "#22c55e" : "#f59e0b" }}/>
              <span className="text-white/40">{dateShort(op.time)}</span>
              <span className="font-bold" style={{ color: op.amount > 0 ? "#22c55e" : "#f59e0b" }}>
                {op.amount > 0 ? "+" : "−"}{currency} {Math.abs(op.amount).toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </span>
              {op.comment && <span className="text-white/25">· {op.comment}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Bar chart (generic) ────────────────────────────────── */
function BarChart({ data }: { data: { label: string; value: number; trades: number }[] }) {
  const maxAbs = Math.max(...data.map((d) => Math.abs(d.value)), 1);
  return (
    <div className="flex items-end gap-1" style={{ height: 100 }}>
      {data.map((d) => {
        const isPos = d.value >= 0;
        const pct = (Math.abs(d.value) / maxAbs) * 85;
        return (
          <div key={d.label} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div className="w-full flex flex-col justify-end" style={{ height: 84 }}>
              <div className="w-full rounded-t-sm"
                style={{
                  height: `${Math.max(pct, 3)}%`,
                  background: isPos ? "linear-gradient(to top,#1d4ed8,#3b82f6)" : "linear-gradient(to top,#991b1b,#ef4444)",
                  boxShadow: isPos ? "0 0 6px rgba(59,130,246,0.25)" : "0 0 6px rgba(239,68,68,0.25)",
                }}/>
            </div>
            {/* tooltip */}
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[#1a1f2e] border border-white/10 rounded-lg px-2.5 py-1.5 text-[0.6rem] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
              <div className={`font-bold ${isPos ? "text-blue-400" : "text-red-400"}`}>{isPos?"+":""}{d.value.toFixed(2)}</div>
              <div className="text-white/40">{d.trades} ops</div>
            </div>
            <span className="text-[0.55rem] text-white/30 truncate w-full text-center">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Analytics section ──────────────────────────────────── */
function Analytics({ positions, currency, symbols, selectedSymbol }: {
  positions: Position[];
  currency: string;
  symbols: string[];
  selectedSymbol: string;
}) {
  const [tab, setTab] = useState<AnalyticsTab>("horas");

  const filtered = useMemo(() =>
    selectedSymbol === "ALL" ? positions : positions.filter((p) => p.symbol === selectedSymbol),
    [positions, selectedSymbol]
  );

  // Hour analysis (0-23, based on openTime)
  const hourData = useMemo(() => {
    const map: Record<number, { value: number; trades: number }> = {};
    for (let h = 0; h < 24; h++) map[h] = { value: 0, trades: 0 };
    for (const p of filtered) {
      const t = p.openTime || p.closeTime;
      const h = new Date(t).getUTCHours();
      map[h].value  += net(p);
      map[h].trades += 1;
    }
    return Array.from({ length: 24 }, (_, h) => ({ label: String(h).padStart(2, "0"), ...map[h] }));
  }, [filtered]);

  // Day of week (Mon=1...Sun=0 → reorder Mon-Sun)
  const DAY_NAMES = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
  const dayData = useMemo(() => {
    const map: Record<number, { value: number; trades: number }> = {};
    for (let d = 0; d < 7; d++) map[d] = { value: 0, trades: 0 };
    for (const p of filtered) {
      const t = p.openTime || p.closeTime;
      const d = new Date(t).getUTCDay();
      map[d].value  += net(p);
      map[d].trades += 1;
    }
    // Reorder Mon→Sun
    return [1,2,3,4,5,6,0].map((d) => ({ label: DAY_NAMES[d], ...map[d] }));
  }, [filtered]);

  // Month analysis
  const MONTH_NAMES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const monthData = useMemo(() => {
    const map: Record<string, { value: number; trades: number }> = {};
    for (const p of filtered) {
      const d = new Date(p.closeTime);
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth()).padStart(2,"0")}`;
      if (!map[key]) map[key] = { value: 0, trades: 0 };
      map[key].value  += net(p);
      map[key].trades += 1;
    }
    return Object.entries(map)
      .sort(([a],[b]) => a.localeCompare(b))
      .map(([key, v]) => ({ label: MONTH_NAMES[parseInt(key.split("-")[1])], ...v }));
  }, [filtered]);

  // Symbol breakdown
  const symbolData = useMemo(() => {
    const map: Record<string, { value: number; trades: number; wins: number }> = {};
    for (const p of filtered) {
      if (!map[p.symbol]) map[p.symbol] = { value: 0, trades: 0, wins: 0 };
      const n = net(p);
      map[p.symbol].value  += n;
      map[p.symbol].trades += 1;
      if (n > 0) map[p.symbol].wins++;
    }
    return Object.entries(map)
      .map(([sym, d]) => ({ label: sym, value: d.value, trades: d.trades, winRate: d.trades > 0 ? d.wins/d.trades*100 : 0 }))
      .sort((a,b) => b.trades - a.trades);
  }, [filtered]);

  const TABS: { key: AnalyticsTab; label: string }[] = [
    { key: "horas", label: "Por Hora" },
    { key: "dias",  label: "Día Semana" },
    { key: "meses", label: "Por Mes" },
    { key: "activos", label: "Activos" },
  ];

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Tabs */}
      <div className="flex border-b border-white/[0.05]">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="px-5 py-3.5 text-xs font-semibold transition-all"
            style={{ color: tab === t.key ? "white" : "rgba(255,255,255,0.3)", borderBottom: tab === t.key ? "2px solid #3b82f6" : "2px solid transparent" }}>
            {t.label}
          </button>
        ))}
        <div className="flex-1"/>
        <span className="flex items-center pr-4 text-xs text-white/20">{filtered.length} ops</span>
      </div>

      <div className="p-6">
        {tab === "horas" && (
          <div>
            <p className="text-xs text-white/30 mb-4">P&L neto por hora UTC de apertura</p>
            <BarChart data={hourData}/>
          </div>
        )}
        {tab === "dias" && (
          <div>
            <p className="text-xs text-white/30 mb-4">P&L neto por día de la semana</p>
            <BarChart data={dayData}/>
          </div>
        )}
        {tab === "meses" && (
          <div>
            <p className="text-xs text-white/30 mb-4">P&L neto por mes</p>
            <BarChart data={monthData}/>
          </div>
        )}
        {tab === "activos" && (
          <div className="space-y-3">
            {symbolData.map((s, i) => {
              const COLS = ["#f59e0b","#60a5fa","#4ade80","#a78bfa","#f87171","#34d399","#fb923c","#c084fc"];
              const c = COLS[i % COLS.length];
              const maxTrades = symbolData[0]?.trades || 1;
              return (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-black" style={{ color: c }}>{s.label}</span>
                      <span className="text-[0.65rem] text-white/25">{s.trades} ops · {s.winRate.toFixed(0)}% win</span>
                    </div>
                    <span className="text-xs font-bold" style={{ color: s.value >= 0 ? "#4ade80" : "#f87171" }}>
                      {s.value >= 0 ? "+" : "−"}{currency} {Math.abs(s.value).toFixed(2)}
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-white/5">
                    <div className="h-full rounded-full" style={{ width: `${(s.trades/maxTrades)*100}%`, background: c, opacity: 0.5 }}/>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Close reason badge ─────────────────────────────────── */
function ReasonBadge({ reason }: { reason: string | null }) {
  if (!reason || reason === "manual") return <span className="text-white/20 text-[0.6rem]">Manual</span>;
  if (reason === "sl") return (
    <span className="px-1.5 py-0.5 rounded text-[0.58rem] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/20">SL</span>
  );
  if (reason === "tp") return (
    <span className="px-1.5 py-0.5 rounded text-[0.58rem] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">TP</span>
  );
  if (reason === "so") return (
    <span className="px-1.5 py-0.5 rounded text-[0.58rem] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20">SO</span>
  );
  return <span className="text-white/20 text-[0.6rem]">{reason}</span>;
}

/* ─── Trades table ───────────────────────────────────────── */
function TradesTable({ positions, currency }: { positions: Position[]; currency: string }) {
  const recent = positions.slice(0, 50);
  const HEADS = ["","Símbolo","Dir","Lots","Apertura","P.Entrada","SL","TP","Cierre","P.Salida","MAE","MFE","Neto"];
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between">
        <h2 className="font-black text-sm">Operaciones</h2>
        <div className="flex items-center gap-4 text-[0.62rem] text-white/25">
          <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-bold">TP</span> Take profit</span>
          <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/20 font-bold">SL</span> Stop loss</span>
          <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20 font-bold">SO</span> Stop out</span>
          <span>{positions.length} cerradas</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[1100px]">
          <thead>
            <tr className="border-b border-white/[0.04]">
              {HEADS.map((h) => (
                <th key={h} className="px-3 py-3 text-left font-semibold text-white/25 uppercase tracking-wider text-[0.56rem] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.map((p, i) => {
              const n = net(p);
              const isLong = p.type === "buy";
              const rowBg = p.closeReason === "sl" ? "rgba(239,68,68,0.03)"
                          : p.closeReason === "tp" ? "rgba(34,197,94,0.03)"
                          : "transparent";
              return (
                <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors" style={{ background: rowBg }}>
                  {/* Close reason */}
                  <td className="px-3 py-3"><ReasonBadge reason={p.closeReason}/></td>
                  <td className="px-3 py-3 font-bold text-white/80">{p.symbol}</td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-0.5 rounded text-[0.6rem] font-bold ${isLong ? "bg-blue-500/10 text-blue-400" : "bg-rose-500/10 text-rose-400"}`}>
                      {isLong ? "Long" : "Short"}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-mono text-white/35">{p.lots}</td>
                  <td className="px-3 py-3 text-white/30 whitespace-nowrap">{p.openTime ? dateShort(p.openTime) : "—"}</td>
                  <td className="px-3 py-3 font-mono text-white/55">{p.openPrice != null ? fmtNum(p.openPrice, 5) : "—"}</td>
                  <td className="px-3 py-3 font-mono text-rose-400/50">{p.sl ? fmtNum(p.sl, 5) : "—"}</td>
                  <td className="px-3 py-3 font-mono text-emerald-400/50">{p.tp ? fmtNum(p.tp, 5) : "—"}</td>
                  <td className="px-3 py-3 text-white/30 whitespace-nowrap">{dateShort(p.closeTime)}</td>
                  <td className="px-3 py-3 font-mono text-white/55">{fmtNum(p.closePrice, 5)}</td>
                  <td className="px-3 py-3 font-mono text-rose-400/70">
                    {p.mae != null ? fmtNum(p.mae, 2) : "—"}
                  </td>
                  <td className="px-3 py-3 font-mono text-emerald-400/70">
                    {p.mfe != null ? fmtNum(p.mfe, 2) : "—"}
                  </td>
                  <td className="px-3 py-3 font-bold font-mono" style={{ color: n >= 0 ? "#4ade80" : "#f87171" }}>
                    {n >= 0 ? "+" : "−"}{currency} {fmtNum(Math.abs(n))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── KPI Card ───────────────────────────────────────────── */
function KPI({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="rounded-2xl p-4 flex flex-col gap-1"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <span className="text-[0.6rem] uppercase tracking-widest font-semibold" style={{ color: color + "90" }}>{label}</span>
      <span className="text-xl font-black leading-none truncate" style={{ color }}>{value}</span>
      {sub && <span className="text-[0.65rem] text-white/20 mt-0.5">{sub}</span>}
    </div>
  );
}

/* ─── Gate screens ───────────────────────────────────────── */
function UnauthScreen() {
  return (
    <div className="min-h-screen bg-[#080b12] flex items-center justify-center px-5">
      <div className="max-w-[380px] w-full text-center">
        <h2 className="text-2xl font-black text-white mb-3">Inicia sesión</h2>
        <p className="text-white/40 text-sm mb-8">Necesitas una cuenta para ver tus métricas.</p>
        <Link href="/login" className="block w-full py-3.5 rounded-xl font-bold text-center text-white"
          style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>Iniciar sesión</Link>
      </div>
    </div>
  );
}

function SetupScreen({ account, onRegenerate }: { account: MetricasAccount; onRegenerate: () => void }) {
  const [copied, setCopied] = useState(false);
  const copyKey = () => { navigator.clipboard.writeText(account.apiKey); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="min-h-screen bg-[#080b12] text-white">
      <div className="max-w-[660px] mx-auto px-5 pt-32 pb-20">
        <Link href="/metricas" className="text-white/30 text-sm hover:text-white transition-colors">← EV Métricas</Link>
        <div className="mt-8 mb-8">
          <h1 className="text-3xl font-black mb-2">Conecta tu MT5</h1>
          <p className="text-white/40 text-sm">4 pasos, menos de 2 minutos.</p>
        </div>
        {[
          { n: 1, title: "Tu API Key", body: (
            <div className="flex items-center gap-2">
              <code className="flex-1 px-4 py-3 rounded-xl text-sm text-blue-400 font-mono break-all" style={{ background:"rgba(0,0,0,0.4)", border:"1px solid rgba(59,130,246,0.15)" }}>{account.apiKey}</code>
              <button onClick={copyKey} className="shrink-0 px-4 py-3 rounded-xl text-sm font-semibold transition-all" style={{ background: copied?"rgba(34,197,94,0.15)":"rgba(59,130,246,0.15)", border:`1px solid ${copied?"rgba(34,197,94,0.3)":"rgba(59,130,246,0.3)"}`, color: copied?"#22c55e":"#60a5fa" }}>{copied?"✓ Copiada":"Copiar"}</button>
            </div>
          )},
          { n: 2, title: "Descarga el EA", body: (
            <a href="https://github.com/EVMCOD/evtradelabs-site/raw/main/EVTradeLabs_Sync.mq5"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white"
              style={{ background:"linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>
              Descargar EVTradeLabs_Sync.mq5
            </a>
          )},
          { n: 3, title: "Permite WebRequest", body: <p className="text-white/40 text-sm">Herramientas → Opciones → Asesores Expertos → añade <code className="text-blue-400 text-xs">https://evtradelabs.com</code></p> },
          { n: 4, title: "Adjunta a un gráfico", body: <p className="text-white/40 text-sm">Compila (F7), arrastra a cualquier gráfico, pega tu API Key. El dashboard aparece en segundos.</p> },
        ].map(({ n, title, body }) => (
          <div key={n} className="rounded-2xl p-6 mb-4" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-blue-400" style={{ background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.2)" }}>{n}</div>
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
      <div className="max-w-[440px] w-full text-center">
        <div className="w-14 h-14 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background:"rgba(59,130,246,0.08)", border:"1px solid rgba(59,130,246,0.2)" }}>
          <div className="w-5 h-5 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin"/>
        </div>
        <h2 className="text-2xl font-black text-white mb-3">Esperando conexión</h2>
        <p className="text-white/40 text-sm mb-6">El EA sincronizará en los próximos 60 segundos.</p>
        <code className="block text-xs text-blue-400 font-mono p-4 rounded-xl mb-6" style={{ background:"rgba(0,0,0,0.3)", border:"1px solid rgba(59,130,246,0.1)" }}>{account.apiKey}</code>
        <button onClick={onShowSetup} className="px-6 py-3 rounded-xl text-sm font-semibold border border-white/10 text-white/50 hover:text-white transition-all">Ver instrucciones</button>
      </div>
    </div>
  );
}

/* ─── Full Dashboard ─────────────────────────────────────── */
function Dashboard({ account, positions, snapshots, balanceOps, stats }: {
  account: MetricasAccount;
  positions: Position[];
  snapshots: Snapshot[];
  balanceOps: BalanceOp[];
  stats: Stats;
}) {
  const [selectedSymbol, setSelectedSymbol] = useState("ALL");

  const allSymbols = useMemo(() =>
    Array.from(new Set(positions.map((p) => p.symbol))).sort(),
    [positions]
  );

  const filteredPositions = useMemo(() =>
    selectedSymbol === "ALL" ? positions : positions.filter((p) => p.symbol === selectedSymbol),
    [positions, selectedSymbol]
  );

  const lastSyncAgo = account.lastSyncAt ? timeAgo(account.lastSyncAt) : "—";
  const cur = account.currency ?? "USD";

  const filteredStats = useMemo(() => {
    if (selectedSymbol === "ALL") return stats;
    const closed = filteredPositions;
    if (closed.length === 0) return null;
    const nv = (p: Position) => p.profit + p.commission + p.swap;
    const winners = closed.filter((p) => nv(p) > 0);
    const losers  = closed.filter((p) => nv(p) <= 0);
    const gw = winners.reduce((s,p) => s+nv(p), 0);
    const gl = Math.abs(losers.reduce((s,p) => s+nv(p), 0));
    return {
      totalTrades:  closed.length,
      winRate:      winners.length/closed.length*100,
      profitFactor: gl === 0 ? gw : gw/gl,
      netProfit:    closed.reduce((s,p) => s+nv(p), 0),
      avgWin:       winners.length > 0 ? gw/winners.length : 0,
      avgLoss:      losers.length  > 0 ? gl/losers.length  : 0,
      symbols: stats.symbols,
    };
  }, [selectedSymbol, filteredPositions, stats]);

  return (
    <main className="min-h-screen bg-[#080b12] text-white">

      {/* Top bar */}
      <div className="pt-24 px-5">
        <div className="max-w-[1200px] mx-auto border-b border-white/[0.05] pb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5 mb-0.5">
              <h1 className="text-lg font-black">Mis Métricas</h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[0.6rem] font-bold text-emerald-400 border border-emerald-500/25 bg-emerald-500/8 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>Live
              </span>
            </div>
            <p className="text-white/25 text-xs">
              {account.broker ?? "—"} · {account.server ?? "—"} · #{account.accountLogin ?? "—"}
              <span className="ml-3">Sync {lastSyncAgo}</span>
            </p>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(window.location.origin + "/metricas/public/" + account.accountLogin)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs text-white/40 hover:text-white/70 border border-white/[0.07] transition-all">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            Compartir
          </button>
        </div>
      </div>

      {/* KPIs */}
      <section className="px-5 py-5">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <KPI label="Balance"  color="#a78bfa" value={(cur) + " " + fmtNum(account.balance ?? 0)} />
          <KPI label="Equity"   color="#60a5fa" value={(cur) + " " + fmtNum(account.equity  ?? 0)} />
          <KPI label="Net P&L"  color={filteredStats && filteredStats.netProfit >= 0 ? "#4ade80" : "#f87171"}
            value={filteredStats ? fmtMoney(cur, filteredStats.netProfit) : "—"}
            sub={filteredStats ? `${((filteredStats.netProfit / (account.balance ?? 1)) * 100).toFixed(2)}% retorno` : undefined} />
          <KPI label="Win Rate" color="#f59e0b"
            value={filteredStats ? filteredStats.winRate.toFixed(1) + "%" : "—"}
            sub={filteredStats ? `${filteredStats.totalTrades} operaciones` : undefined} />
          <KPI label="Profit F."color="#34d399"
            value={filteredStats ? filteredStats.profitFactor.toFixed(2) : "—"}
            sub={filteredStats ? `Avg win ${cur} ${filteredStats.avgWin.toFixed(0)}` : undefined} />
          <KPI label="Avg Loss" color="#fb923c"
            value={filteredStats ? cur + " " + filteredStats.avgLoss.toFixed(0) : "—"}
            sub={filteredStats && filteredStats.avgLoss > 0 ? `Ratio ${(filteredStats.avgWin / filteredStats.avgLoss).toFixed(2)}` : undefined} />
        </div>
      </section>

      {/* Symbol filter */}
      <section className="px-5 pb-4">
        <div className="max-w-[1200px] mx-auto flex items-center gap-2 flex-wrap">
          <span className="text-xs text-white/30 mr-1">Filtrar:</span>
          {["ALL", ...allSymbols].map((sym) => (
            <button key={sym} onClick={() => setSelectedSymbol(sym)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: selectedSymbol === sym ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${selectedSymbol === sym ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.07)"}`,
                color: selectedSymbol === sym ? "#60a5fa" : "rgba(255,255,255,0.45)",
              }}>
              {sym === "ALL" ? "Todos" : sym}
            </button>
          ))}
        </div>
      </section>

      {/* Equity curve + Account info */}
      <section className="px-5 pb-4">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[1fr_260px] gap-4">
          <div className="rounded-2xl p-5" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="font-black text-sm mb-4">Equity Curve</h2>
            <EquityCurve snapshots={snapshots} balanceOps={balanceOps} currency={cur}/>
          </div>
          <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="font-black text-sm">Cuenta</h2>
            {[
              { label: "Broker",     value: account.broker      ?? "—" },
              { label: "Servidor",   value: account.server      ?? "—" },
              { label: "Login",      value: "#" + (account.accountLogin ?? "—") },
              { label: "Titular",    value: account.accountName ?? "—" },
              { label: "Moneda",     value: cur },
              { label: "Apalanca.",  value: account.leverage ? "1:" + account.leverage : "—" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between border-b border-white/[0.04] pb-2.5 last:border-0 last:pb-0">
                <span className="text-xs text-white/25">{label}</span>
                <span className="text-xs font-semibold text-white/60 text-right max-w-[140px] truncate">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics */}
      <section className="px-5 pb-4">
        <div className="max-w-[1200px] mx-auto">
          <Analytics positions={filteredPositions} currency={cur} symbols={allSymbols} selectedSymbol={selectedSymbol}/>
        </div>
      </section>

      {/* Trades table */}
      <section className="px-5 pb-20">
        <div className="max-w-[1200px] mx-auto">
          <TradesTable positions={filteredPositions} currency={cur}/>
        </div>
      </section>
    </main>
  );
}

/* ─── Page entry ─────────────────────────────────────────── */
export default function MetricasDashboardPage() {
  const [state, setState]           = useState<PageState>("loading");
  const [account, setAccount]       = useState<MetricasAccount | null>(null);
  const [positions, setPositions]   = useState<Position[]>([]);
  const [snapshots, setSnapshots]   = useState<Snapshot[]>([]);
  const [balanceOps, setBalanceOps] = useState<BalanceOp[]>([]);
  const [stats, setStats]           = useState<Stats | null>(null);

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
      setPositions(data.positions ?? []);
      setSnapshots(data.snapshots ?? []);
      setBalanceOps(data.balanceOps ?? []);
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
        <div className="w-6 h-6 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin"/>
      </div>
    );
  }
  if (state === "unauthenticated") return <UnauthScreen/>;
  if (state === "setup")          return <SetupScreen account={account!} onRegenerate={load}/>;
  if (state === "pending")        return <PendingScreen account={account!} onShowSetup={() => setState("setup")}/>;
  return <Dashboard account={account!} positions={positions} snapshots={snapshots} balanceOps={balanceOps} stats={stats!}/>;
}
