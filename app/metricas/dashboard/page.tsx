"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";

/* ─── Types ──────────────────────────────────────────────── */
type PageState = "loading" | "unauthenticated" | "setup" | "pending" | "connected";
type AnalyticsTab = "horas" | "dias" | "meses" | "sesiones" | "activos" | "histograma";
type TF = "1W" | "1M" | "3M" | "6M" | "1Y" | "ALL";

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
  isLive: boolean;
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

interface OpenPosition {
  positionId: string;
  symbol: string;
  type: string;
  lots: number;
  openPrice: number | null;
  openTime: string | null;
  profit: number;
  commission: number;
  swap: number;
  sl: number | null;
  tp: number | null;
  mae: number | null;
  mfe: number | null;
}

interface SynthPoint { time: string; balance: number; }

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
  grossWin: number;
  grossLoss: number;
  avgWin: number;
  avgLoss: number;
  maxDDPct: number;
  maxDDAbs: number;
  recoveryFactor: number;
  avgDurationHours: number;
  maxConsecWins: number;
  maxConsecLosses: number;
  symbols: { name: string; trades: number; profit: number; winRate: number; share: number }[];
}

interface DisplayStats {
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  netProfit: number;
  avgWin: number;
  avgLoss: number;
  maxDDPct: number | null;
  maxDDAbs: number | null;
  recoveryFactor: number | null;
  avgDurationHours: number | null;
  maxConsecWins: number | null;
  maxConsecLosses: number | null;
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

const net = (p: { profit: number; commission: number; swap: number }) =>
  p.profit + p.commission + p.swap;

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

function bucketKey(iso: string, tf: TF): string {
  const d = new Date(iso);
  const Y = d.getUTCFullYear(), M = d.getUTCMonth(), D = d.getUTCDate();
  if (tf === "1W")  return `${Y}-${M}-${D}-${d.getUTCHours()}`;
  if (tf === "1M" || tf === "3M") return `${Y}-${M}-${D}`;
  if (tf === "6M")  return `${Y}-${M}-${Math.floor(D / 7)}`;
  return `${Y}-${M}`;
}

function resampleSynth(all: SynthPoint[], tf: TF): SynthPoint[] {
  const now = Date.now();
  const cutoffs: Record<TF, number> = {
    "1W": 7 * 86400e3, "1M": 30 * 86400e3, "3M": 90 * 86400e3,
    "6M": 180 * 86400e3, "1Y": 365 * 86400e3, "ALL": Infinity,
  };
  const src = tf === "ALL" ? all : all.filter(s => now - new Date(s.time).getTime() <= cutoffs[tf]);
  if (src.length === 0) return all.slice(-2);
  const map = new Map<string, SynthPoint>();
  for (const s of src) map.set(bucketKey(s.time, tf), s);
  return Array.from(map.values()).sort((a, b) => a.time.localeCompare(b.time));
}

function exportCSV(positions: Position[], currency: string) {
  const h = ["positionId","symbol","type","lots","openTime","openPrice","closeTime","closePrice","sl","tp","mae","mfe","profit","commission","swap","net","closeReason"];
  const rows = positions.map(p => [
    p.positionId, p.symbol, p.type, p.lots,
    p.openTime ?? "", p.openPrice ?? "",
    p.closeTime, p.closePrice,
    p.sl ?? "", p.tp ?? "", p.mae ?? "", p.mfe ?? "",
    p.profit, p.commission, p.swap, net(p), p.closeReason ?? "",
  ].join(","));
  const blob = new Blob([[h.join(","), ...rows].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `trades_${new Date().toISOString().slice(0,10)}.csv`; a.click();
  URL.revokeObjectURL(url);
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

/* ─── Equity / Drawdown Curve ────────────────────────────── */
function EquityCurve({ synthEquity, balanceOps, currency }: {
  synthEquity: SynthPoint[];
  balanceOps: BalanceOp[];
  currency: string;
}) {
  const [tf, setTf]     = useState<TF>("ALL");
  const [mode, setMode] = useState<"equity" | "drawdown">("equity");
  const TFS: TF[]       = ["1W","1M","3M","6M","1Y","ALL"];

  const data = useMemo(() => resampleSynth(synthEquity, tf), [synthEquity, tf]);

  const ddSeries = useMemo(() => {
    let peak = -Infinity;
    return data.map(pt => {
      if (pt.balance > peak) peak = pt.balance;
      return peak > 0 ? ((peak - pt.balance) / peak) * 100 : 0;
    });
  }, [data]);

  if (synthEquity.length < 2) {
    return <div className="flex items-center justify-center h-40 text-white/20 text-sm">Acumulando datos…</div>;
  }

  const W = 800, H = 170, PL = 4, PR = 4, PT = 10, PB = 10;
  const cW = W - PL - PR, cH = H - PT - PB;
  const n  = data.length;

  if (n < 2) return null;

  const tStart = new Date(data[0].time).getTime();
  const tEnd   = new Date(data[n - 1].time).getTime();
  const tRange = tEnd - tStart || 1;

  const vals  = mode === "equity" ? data.map(s => s.balance) : ddSeries;
  const minV  = Math.min(...vals), maxV = Math.max(...vals);
  const range = maxV - minV || maxV * 0.01 || 1;

  const px     = (i: number)   => PL + (i / (n - 1)) * cW;
  const py     = (v: number)   => PT + (1 - (v - minV) / range) * cH;
  const pxTime = (iso: string) => PL + ((new Date(iso).getTime() - tStart) / tRange) * cW;

  const pts: [number, number][] = vals.map((v, i) => [px(i), py(v)]);
  const line = smoothPath(pts);
  const fill = `${line} L ${px(n-1).toFixed(1)} ${(PT+cH).toFixed(1)} L ${PL} ${(PT+cH).toFixed(1)} Z`;
  const [lx, ly] = pts[n - 1];

  const colEquity = data[n-1].balance >= data[0].balance ? "#3b82f6" : "#ef4444";
  const col       = mode === "drawdown" ? "#f59e0b" : colEquity;
  const pct       = mode === "equity"
    ? ((data[n-1].balance - data[0].balance) / (data[0].balance || 1)) * 100
    : ddSeries[n - 1];

  const visibleOps = mode === "equity" ? balanceOps.filter(op => {
    const t = new Date(op.time).getTime();
    return t >= tStart && t <= tEnd;
  }) : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-1">
          {TFS.map(t => (
            <button key={t} onClick={() => setTf(t)}
              className="px-2.5 py-1 rounded-lg text-[0.65rem] font-bold transition-all"
              style={{
                background: tf === t ? "rgba(59,130,246,0.2)"         : "rgba(255,255,255,0.04)",
                border:     tf === t ? "1px solid rgba(59,130,246,0.4)" : "1px solid rgba(255,255,255,0.06)",
                color:      tf === t ? "#60a5fa"                       : "rgba(255,255,255,0.35)",
              }}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg overflow-hidden border border-white/[0.08]">
            {(["equity","drawdown"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className="px-3 py-1 text-[0.6rem] font-bold transition-all"
                style={{
                  background: mode === m ? "rgba(255,255,255,0.08)" : "transparent",
                  color:      mode === m ? "white" : "rgba(255,255,255,0.3)",
                }}>
                {m === "equity" ? "Equity" : "Drawdown"}
              </button>
            ))}
          </div>
          <span className="text-xs text-white/25">{dateShort(data[0].time)} → {dateShort(data[n-1].time)}</span>
          <span className="text-sm font-black" style={{ color: col }}>
            {mode === "equity"
              ? (pct >= 0 ? "+" : "") + pct.toFixed(2) + "%"
              : pct.toFixed(2) + "% DD"}
          </span>
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 170, display: "block" }}>
          <defs>
            <linearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={col} stopOpacity="0.18"/>
              <stop offset="100%" stopColor={col} stopOpacity="0.01"/>
            </linearGradient>
            <filter id="dg">
              <feGaussianBlur stdDeviation="4" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {[0.25, 0.5, 0.75].map(f => (
            <line key={f} x1={PL} y1={PT+f*cH} x2={W-PR} y2={PT+f*cH} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
          ))}
          <path d={fill} fill="url(#eqFill)"/>
          <path d={line} fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round"/>
          {visibleOps.map((op, i) => {
            const x  = pxTime(op.time);
            const mc = op.amount > 0 ? "#22c55e" : "#f59e0b";
            const cy = op.amount > 0 ? PT + 5 : PT + cH - 5;
            const lbl = (op.amount > 0 ? "+" : "−") + currency + " "
              + Math.abs(op.amount).toLocaleString("en-US", { maximumFractionDigits: 0 });
            return (
              <g key={i}>
                <line x1={x} y1={PT} x2={x} y2={PT+cH} stroke={mc} strokeWidth="1" strokeDasharray="3 3" opacity="0.5"/>
                <circle cx={x} cy={cy} r="3.5" fill={mc} opacity="0.9"/>
                <text x={x+5} y={cy+4} fontSize="9" fill={mc} opacity="0.85" fontWeight="600">{lbl}</text>
              </g>
            );
          })}
          <circle cx={lx} cy={ly} r="6" fill={col} opacity="0.2" filter="url(#dg)"/>
          <circle cx={lx} cy={ly} r="3" fill={col}/>
          <circle cx={lx} cy={ly} r="1.5" fill="white"/>
        </svg>
        <div className="absolute top-0 right-0 h-full flex flex-col justify-between text-right pr-1 pointer-events-none"
          style={{ paddingTop: PT, paddingBottom: PB }}>
          {[maxV, minV + range/2, minV].map((v, i) => (
            <span key={i} className="text-[0.55rem] text-white/20 leading-none">
              {mode === "equity" ? fmtNum(v, 0) : v.toFixed(1) + "%"}
            </span>
          ))}
        </div>
      </div>

      {visibleOps.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-white/[0.04]">
          {visibleOps.map((op, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[0.65rem]">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: op.amount > 0 ? "#22c55e" : "#f59e0b" }}/>
              <span className="text-white/35">{dateShort(op.time)}</span>
              <span className="font-bold" style={{ color: op.amount > 0 ? "#22c55e" : "#f59e0b" }}>
                {op.amount > 0 ? "+" : "−"}{currency} {Math.abs(op.amount).toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </span>
              {op.comment && <span className="text-white/20">· {op.comment}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Bar chart ──────────────────────────────────────────── */
function BarChart({ data }: { data: { label: string; value: number; trades: number }[] }) {
  const maxAbs = Math.max(...data.map(d => Math.abs(d.value)), 1);
  return (
    <div className="flex items-end gap-1" style={{ height: 100 }}>
      {data.map(d => {
        const isPos = d.value >= 0;
        const pct   = (Math.abs(d.value) / maxAbs) * 85;
        return (
          <div key={d.label} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div className="w-full flex flex-col justify-end" style={{ height: 84 }}>
              <div className="w-full rounded-t-sm" style={{
                height: `${Math.max(pct, 3)}%`,
                background: isPos ? "linear-gradient(to top,#1d4ed8,#3b82f6)" : "linear-gradient(to top,#991b1b,#ef4444)",
                boxShadow:  isPos ? "0 0 6px rgba(59,130,246,0.25)" : "0 0 6px rgba(239,68,68,0.25)",
              }}/>
            </div>
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

/* ─── P&L Histogram ──────────────────────────────────────── */
function PnLHistogram({ positions }: { positions: Position[] }) {
  const bins = useMemo(() => {
    if (positions.length === 0) return [];
    const nets = positions.map(p => net(p));
    const minV = Math.min(...nets), maxV = Math.max(...nets);
    const range = maxV - minV || 1;
    const N = Math.min(12, Math.max(6, Math.ceil(Math.sqrt(positions.length))));
    const step = range / N;
    return Array.from({ length: N }, (_, i) => {
      const lo = minV + i * step, hi = lo + step;
      const mid = (lo + hi) / 2;
      const inBin = nets.filter(v => i === N-1 ? v >= lo && v <= hi : v >= lo && v < hi);
      return { label: (lo >= 0 ? "+" : "") + lo.toFixed(0), midpoint: mid, trades: inBin.length };
    });
  }, [positions]);

  if (bins.length === 0) return <p className="text-white/20 text-sm text-center py-8">Sin datos</p>;
  const maxT = Math.max(...bins.map(b => b.trades), 1);
  return (
    <div>
      <p className="text-xs text-white/30 mb-4">Distribución de operaciones por P&L neto</p>
      <div className="flex items-end gap-1" style={{ height: 100 }}>
        {bins.map((b, i) => {
          const isPos = b.midpoint >= 0;
          const pct   = (b.trades / maxT) * 85;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
              <div className="w-full flex flex-col justify-end" style={{ height: 84 }}>
                <div className="w-full rounded-t-sm" style={{
                  height: `${Math.max(pct, 3)}%`,
                  background: isPos ? "linear-gradient(to top,#1d4ed8,#3b82f6)" : "linear-gradient(to top,#991b1b,#ef4444)",
                }}/>
              </div>
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[#1a1f2e] border border-white/10 rounded-lg px-2 py-1 text-[0.6rem] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                <div className="text-white/70 font-bold">{b.label}</div>
                <div className="text-white/40">{b.trades} ops</div>
              </div>
              <span className="text-[0.5rem] text-white/25 truncate w-full text-center">{b.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Calendar Heatmap ───────────────────────────────────── */
function CalendarHeatmap({ positions }: { positions: Position[] }) {
  const heatmap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of positions) {
      const d   = new Date(p.closeTime);
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,"0")}-${String(d.getUTCDate()).padStart(2,"0")}`;
      map[key]  = (map[key] ?? 0) + net(p);
    }
    return map;
  }, [positions]);

  const maxAbs = useMemo(() => Math.max(1, ...Object.values(heatmap).map(Math.abs)), [heatmap]);

  const weeks = useMemo(() => {
    const today = new Date(); today.setUTCHours(0,0,0,0);
    const start = new Date(today);
    start.setUTCDate(start.getUTCDate() - 52 * 7);
    while (start.getUTCDay() !== 1) start.setUTCDate(start.getUTCDate() - 1);
    const result: { date: string; pnl: number | null }[][] = [];
    const cur = new Date(start);
    while (cur <= today) {
      const week: { date: string; pnl: number | null }[] = [];
      for (let d = 0; d < 7; d++) {
        const key = `${cur.getUTCFullYear()}-${String(cur.getUTCMonth()+1).padStart(2,"0")}-${String(cur.getUTCDate()).padStart(2,"0")}`;
        week.push({ date: key, pnl: cur > today ? null : (heatmap[key] ?? 0) });
        cur.setUTCDate(cur.getUTCDate() + 1);
      }
      result.push(week);
    }
    return result;
  }, [heatmap]);

  const cellColor = (pnl: number | null) => {
    if (pnl === null) return "rgba(255,255,255,0.02)";
    if (pnl === 0)    return "rgba(255,255,255,0.04)";
    const intensity = Math.min(Math.abs(pnl) / maxAbs, 1);
    return pnl > 0
      ? `rgba(34,197,94,${0.1 + intensity * 0.7})`
      : `rgba(239,68,68,${0.1 + intensity * 0.7})`;
  };

  const DAYS = ["L","M","X","J","V","S","D"];
  const MONTH_NAMES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto pb-1">
        <div className="flex flex-col gap-[3px] pt-[18px] shrink-0">
          {DAYS.map(d => (
            <div key={d} className="text-[0.5rem] text-white/20 w-3 text-right leading-[10px]">{d}</div>
          ))}
        </div>
        {weeks.map((week, wi) => {
          const firstDate  = week[0].date;
          const dateObj    = new Date(firstDate + "T00:00:00Z");
          const showMonth  = dateObj.getUTCDate() <= 7;
          const monthLabel = showMonth ? MONTH_NAMES[dateObj.getUTCMonth()] : "";
          return (
            <div key={wi} className="flex flex-col gap-[3px]">
              <div className="text-[0.5rem] text-white/20 h-[14px] leading-[14px] whitespace-nowrap">{monthLabel}</div>
              {week.map((cell, di) => (
                <div key={di}
                  title={`${cell.date}: ${cell.pnl !== null ? (cell.pnl >= 0 ? "+" : "") + cell.pnl.toFixed(2) : "—"}`}
                  style={{ width: 10, height: 10, borderRadius: 2, background: cellColor(cell.pnl) }}/>
              ))}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        <span className="text-[0.55rem] text-white/20">−</span>
        {[0.8,0.5,0.2].map(o => (
          <div key={o} style={{ width:10, height:10, borderRadius:2, background:`rgba(239,68,68,${o})` }}/>
        ))}
        <div style={{ width:10, height:10, borderRadius:2, background:"rgba(255,255,255,0.04)" }}/>
        {[0.2,0.5,0.8].map(o => (
          <div key={o} style={{ width:10, height:10, borderRadius:2, background:`rgba(34,197,94,${o})` }}/>
        ))}
        <span className="text-[0.55rem] text-white/20">+</span>
      </div>
    </div>
  );
}

/* ─── Analytics ──────────────────────────────────────────── */
function Analytics({ positions, currency, selectedSymbol }: {
  positions: Position[];
  currency: string;
  selectedSymbol: string;
}) {
  const [tab, setTab] = useState<AnalyticsTab>("horas");

  const filtered = useMemo(() =>
    selectedSymbol === "ALL" ? positions : positions.filter(p => p.symbol === selectedSymbol),
    [positions, selectedSymbol]
  );

  const hourData = useMemo(() => {
    const map: Record<number, { value: number; trades: number }> = {};
    for (let h = 0; h < 24; h++) map[h] = { value: 0, trades: 0 };
    for (const p of filtered) {
      const h = new Date(p.openTime || p.closeTime).getUTCHours();
      map[h].value += net(p); map[h].trades++;
    }
    return Array.from({ length: 24 }, (_, h) => ({ label: String(h).padStart(2,"0"), ...map[h] }));
  }, [filtered]);

  const DAY_NAMES = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
  const dayData = useMemo(() => {
    const map: Record<number, { value: number; trades: number }> = {};
    for (let d = 0; d < 7; d++) map[d] = { value: 0, trades: 0 };
    for (const p of filtered) {
      const d = new Date(p.openTime || p.closeTime).getUTCDay();
      map[d].value += net(p); map[d].trades++;
    }
    return [1,2,3,4,5,6,0].map(d => ({ label: DAY_NAMES[d], ...map[d] }));
  }, [filtered]);

  const MONTH_NAMES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const monthData = useMemo(() => {
    const map: Record<string, { value: number; trades: number }> = {};
    for (const p of filtered) {
      const d   = new Date(p.closeTime);
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth()).padStart(2,"0")}`;
      if (!map[key]) map[key] = { value: 0, trades: 0 };
      map[key].value += net(p); map[key].trades++;
    }
    return Object.entries(map).sort(([a],[b]) => a.localeCompare(b))
      .map(([key, v]) => ({ label: MONTH_NAMES[parseInt(key.split("-")[1])], ...v }));
  }, [filtered]);

  const sessData = useMemo(() => {
    type Sess = "Asia" | "London" | "Overlap" | "NY" | "Otro";
    const map: Record<Sess, { value: number; trades: number; wins: number }> = {
      Asia: {value:0,trades:0,wins:0}, London: {value:0,trades:0,wins:0},
      Overlap: {value:0,trades:0,wins:0}, NY: {value:0,trades:0,wins:0}, Otro: {value:0,trades:0,wins:0},
    };
    for (const p of filtered) {
      const h = new Date(p.openTime || p.closeTime).getUTCHours();
      const sess: Sess = h < 8 ? "Asia" : h < 12 ? "London" : h < 17 ? "Overlap" : h < 22 ? "NY" : "Otro";
      const n = net(p);
      map[sess].value += n; map[sess].trades++;
      if (n > 0) map[sess].wins++;
    }
    const SESS_COLS: Record<string, string> = {
      Asia:"#a78bfa", London:"#60a5fa", Overlap:"#4ade80", NY:"#f59e0b", Otro:"#94a3b8"
    };
    const SESS_TIMES: Record<string, string> = {
      Asia:"00-08h UTC", London:"08-12h UTC", Overlap:"12-17h UTC", NY:"17-22h UTC", Otro:"22-24h UTC"
    };
    return (Object.entries(map) as [Sess, typeof map[Sess]][])
      .filter(([,v]) => v.trades > 0)
      .map(([name, v]) => ({
        name, color: SESS_COLS[name], time: SESS_TIMES[name],
        ...v, winRate: v.trades > 0 ? v.wins/v.trades*100 : 0,
      }));
  }, [filtered]);

  const symbolData = useMemo(() => {
    const map: Record<string, { value: number; trades: number; wins: number }> = {};
    for (const p of filtered) {
      if (!map[p.symbol]) map[p.symbol] = { value: 0, trades: 0, wins: 0 };
      const n = net(p);
      map[p.symbol].value += n; map[p.symbol].trades++;
      if (n > 0) map[p.symbol].wins++;
    }
    return Object.entries(map)
      .map(([sym, d]) => ({ label: sym, value: d.value, trades: d.trades, winRate: d.trades > 0 ? d.wins/d.trades*100 : 0 }))
      .sort((a,b) => b.trades - a.trades);
  }, [filtered]);

  const TABS: { key: AnalyticsTab; label: string }[] = [
    { key:"horas",      label:"Por Hora" },
    { key:"dias",       label:"Día Semana" },
    { key:"meses",      label:"Por Mes" },
    { key:"sesiones",   label:"Sesiones" },
    { key:"activos",    label:"Activos" },
    { key:"histograma", label:"Histograma" },
  ];

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex border-b border-white/[0.05] overflow-x-auto">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="px-4 py-3.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0"
            style={{ color: tab===t.key?"white":"rgba(255,255,255,0.3)", borderBottom: tab===t.key?"2px solid #3b82f6":"2px solid transparent" }}>
            {t.label}
          </button>
        ))}
        <div className="flex-1"/>
        <span className="flex items-center pr-4 text-xs text-white/20 shrink-0">{filtered.length} ops</span>
      </div>
      <div className="p-6">
        {tab === "horas" && (<div><p className="text-xs text-white/30 mb-4">P&L neto por hora UTC de apertura</p><BarChart data={hourData}/></div>)}
        {tab === "dias"  && (<div><p className="text-xs text-white/30 mb-4">P&L neto por día de la semana</p><BarChart data={dayData}/></div>)}
        {tab === "meses" && (<div><p className="text-xs text-white/30 mb-4">P&L neto por mes</p><BarChart data={monthData}/></div>)}
        {tab === "sesiones" && (
          <div className="space-y-3">
            <p className="text-xs text-white/30 mb-2">Rendimiento por sesión de mercado (hora UTC apertura)</p>
            {sessData.length === 0 && <p className="text-white/20 text-sm text-center py-4">Sin datos</p>}
            {sessData.map(s => (
              <div key={s.name} className="rounded-xl p-4" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black" style={{ color: s.color }}>{s.name}</span>
                    <span className="text-[0.62rem] text-white/25">{s.time} · {s.trades} ops · {s.winRate.toFixed(0)}% win</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: s.value >= 0 ? "#4ade80" : "#f87171" }}>
                    {s.value >= 0 ? "+" : "−"}{currency} {Math.abs(s.value).toFixed(2)}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5">
                  <div className="h-full rounded-full" style={{ width:`${s.winRate}%`, background:s.color, opacity:0.6 }}/>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === "activos" && (
          <div className="space-y-3">
            {symbolData.map((s, i) => {
              const COLS = ["#f59e0b","#60a5fa","#4ade80","#a78bfa","#f87171","#34d399","#fb923c","#c084fc"];
              const c = COLS[i % COLS.length];
              const maxT = symbolData[0]?.trades || 1;
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
                    <div className="h-full rounded-full" style={{ width:`${(s.trades/maxT)*100}%`, background:c, opacity:0.5 }}/>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {tab === "histograma" && <PnLHistogram positions={filtered}/>}
      </div>
    </div>
  );
}

/* ─── Open Positions ─────────────────────────────────────── */
function OpenPositions({ positions, currency, isLive }: { positions: OpenPosition[]; currency: string; isLive: boolean }) {
  if (positions.length === 0) return null;
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
      <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="font-black text-sm">Posiciones Abiertas</h2>
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[0.6rem] font-bold text-emerald-400 border border-emerald-500/25 bg-emerald-500/[0.08] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>Live
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[0.6rem] font-bold text-amber-400 border border-amber-500/25 bg-amber-500/[0.08] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"/>Stale
            </span>
          )}
        </div>
        <span className="text-xs text-white/25">{positions.length} abiertas</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[800px]">
          <thead>
            <tr className="border-b border-white/[0.04]">
              {["Símbolo","Dir","Lots","Apertura","P.Entrada","SL","TP","MAE","MFE","Float"].map(h => (
                <th key={h} className="px-3 py-3 text-left font-semibold text-white/25 uppercase tracking-wider text-[0.56rem] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {positions.map((p, i) => {
              const n = net(p);
              const isLong = p.type === "buy";
              return (
                <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
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
                  <td className="px-3 py-3 font-mono text-rose-400/70">{p.mae != null ? fmtNum(p.mae, 2) : "—"}</td>
                  <td className="px-3 py-3 font-mono text-emerald-400/70">{p.mfe != null ? fmtNum(p.mfe, 2) : "—"}</td>
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

/* ─── Close reason badge ─────────────────────────────────── */
function ReasonBadge({ reason }: { reason: string | null }) {
  if (!reason || reason === "manual") return <span className="text-white/20 text-[0.6rem]">Manual</span>;
  if (reason === "sl") return <span className="px-1.5 py-0.5 rounded text-[0.58rem] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/20">SL</span>;
  if (reason === "tp") return <span className="px-1.5 py-0.5 rounded text-[0.58rem] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">TP</span>;
  if (reason === "so") return <span className="px-1.5 py-0.5 rounded text-[0.58rem] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20">SO</span>;
  return <span className="text-white/20 text-[0.6rem]">{reason}</span>;
}

/* ─── Trades table ───────────────────────────────────────── */
function TradesTable({ positions, currency }: { positions: Position[]; currency: string }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? positions : positions.slice(0, 50);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
      <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h2 className="font-black text-sm">Operaciones Cerradas</h2>
          <div className="flex items-center gap-3 text-[0.62rem] text-white/25">
            <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-bold">TP</span> Take profit</span>
            <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/20 font-bold">SL</span> Stop loss</span>
            <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20 font-bold">SO</span> Stop out</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/25">{positions.length} cerradas</span>
          <button onClick={() => exportCSV(positions, currency)}
            className="px-3.5 py-2 rounded-xl text-[0.65rem] font-semibold border border-white/[0.08] text-white/45 hover:text-white/80 transition-all">
            Exportar CSV
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[1100px]">
          <thead>
            <tr className="border-b border-white/[0.04]">
              {["","Símbolo","Dir","Lots","Apertura","P.Entrada","SL","TP","Cierre","P.Salida","MAE","MFE","Neto"].map(h => (
                <th key={h} className="px-3 py-3 text-left font-semibold text-white/25 uppercase tracking-wider text-[0.56rem] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((p, i) => {
              const n = net(p);
              const isLong = p.type === "buy";
              const rowBg = p.closeReason === "sl" ? "rgba(239,68,68,0.03)"
                          : p.closeReason === "tp" ? "rgba(34,197,94,0.03)"
                          : "transparent";
              return (
                <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors" style={{ background: rowBg }}>
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
                  <td className="px-3 py-3 font-mono text-rose-400/70">{p.mae != null ? fmtNum(p.mae, 2) : "—"}</td>
                  <td className="px-3 py-3 font-mono text-emerald-400/70">{p.mfe != null ? fmtNum(p.mfe, 2) : "—"}</td>
                  <td className="px-3 py-3 font-bold font-mono" style={{ color: n >= 0 ? "#4ade80" : "#f87171" }}>
                    {n >= 0 ? "+" : "−"}{currency} {fmtNum(Math.abs(n))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {positions.length > 50 && (
        <div className="px-6 py-4 border-t border-white/[0.04] text-center">
          <button onClick={() => setShowAll(!showAll)} className="text-xs text-white/35 hover:text-white/70 transition-colors">
            {showAll ? "Mostrar menos" : `Ver todas (${positions.length})`}
          </button>
        </div>
      )}
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
          style={{ background:"linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>Iniciar sesión</Link>
      </div>
    </div>
  );
}

function SetupScreen({ account, onRegenerate }: { account: MetricasAccount; onRegenerate: () => void }) {
  const [copied, setCopied]           = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const copyKey = () => {
    navigator.clipboard.writeText(account.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    if (!confirm("¿Regenerar API Key?\n\nEl EA activo dejará de sincronizar hasta que actualices la key en MT5.")) return;
    setRegenerating(true);
    await fetch("/api/metricas/regenerate", { method: "POST" }).catch(() => null);
    onRegenerate();
    setRegenerating(false);
  };
  return (
    <div className="min-h-screen bg-[#080b12] text-white">
      <div className="max-w-[660px] mx-auto px-5 pt-32 pb-20">
        <Link href="/metricas" className="text-white/30 text-sm hover:text-white transition-colors">← EV Métricas</Link>
        <div className="mt-8 mb-8">
          <h1 className="text-3xl font-black mb-2">Conecta tu MT5</h1>
          <p className="text-white/40 text-sm">4 pasos, menos de 2 minutos.</p>
        </div>
        {[
          { n:1, title:"Tu API Key", body:(
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <code className="flex-1 px-4 py-3 rounded-xl text-sm text-blue-400 font-mono break-all" style={{ background:"rgba(0,0,0,0.4)", border:"1px solid rgba(59,130,246,0.15)" }}>{account.apiKey}</code>
                <button onClick={copyKey} className="shrink-0 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{ background:copied?"rgba(34,197,94,0.15)":"rgba(59,130,246,0.15)", border:`1px solid ${copied?"rgba(34,197,94,0.3)":"rgba(59,130,246,0.3)"}`, color:copied?"#22c55e":"#60a5fa" }}>
                  {copied?"✓ Copiada":"Copiar"}
                </button>
              </div>
              <button onClick={handleRegenerate} disabled={regenerating}
                className="self-start text-xs text-white/25 hover:text-rose-400 transition-colors disabled:opacity-40">
                {regenerating ? "Regenerando…" : "Regenerar key"}
              </button>
            </div>
          )},
          { n:2, title:"Descarga el EA", body:(
            <a href="https://github.com/EVMCOD/evtradelabs-site/raw/main/EVTradeLabs_Sync.mq5"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white"
              style={{ background:"linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>
              Descargar EVTradeLabs_Sync.mq5
            </a>
          )},
          { n:3, title:"Permite WebRequest", body:<p className="text-white/40 text-sm">Herramientas → Opciones → Asesores Expertos → añade <code className="text-blue-400 text-xs">https://evtradelabs.com</code></p> },
          { n:4, title:"Adjunta a un gráfico", body:<p className="text-white/40 text-sm">Compila (F7), arrastra a cualquier gráfico, pega tu API Key. El dashboard aparece en segundos.</p> },
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

/* ─── Dashboard ──────────────────────────────────────────── */
function Dashboard({ account, positions, openPositions, synthEquity, balanceOps, stats }: {
  account: MetricasAccount;
  positions: Position[];
  openPositions: OpenPosition[];
  synthEquity: SynthPoint[];
  balanceOps: BalanceOp[];
  stats: Stats;
}) {
  const [selectedSymbol, setSelectedSymbol] = useState("ALL");

  const allSymbols = useMemo(() =>
    Array.from(new Set(positions.map(p => p.symbol))).sort(), [positions]);

  const filteredPositions = useMemo(() =>
    selectedSymbol === "ALL" ? positions : positions.filter(p => p.symbol === selectedSymbol),
    [positions, selectedSymbol]
  );

  const cur = account.currency ?? "USD";
  const lastSyncAgo = account.lastSyncAt ? timeAgo(account.lastSyncAt) : "—";

  const displayStats = useMemo((): DisplayStats | null => {
    if (selectedSymbol === "ALL") return {
      totalTrades: stats.totalTrades, winRate: stats.winRate,
      profitFactor: stats.profitFactor, netProfit: stats.netProfit,
      avgWin: stats.avgWin, avgLoss: stats.avgLoss,
      maxDDPct: stats.maxDDPct, maxDDAbs: stats.maxDDAbs,
      recoveryFactor: stats.recoveryFactor,
      avgDurationHours: stats.avgDurationHours,
      maxConsecWins: stats.maxConsecWins, maxConsecLosses: stats.maxConsecLosses,
    };
    const closed = filteredPositions;
    if (closed.length === 0) return null;
    const nv    = (p: Position) => p.profit + p.commission + p.swap;
    const wins  = closed.filter(p => nv(p) > 0);
    const loses = closed.filter(p => nv(p) <= 0);
    const gw    = wins.reduce((s,p) => s+nv(p), 0);
    const gl    = Math.abs(loses.reduce((s,p) => s+nv(p), 0));
    return {
      totalTrades: closed.length,
      winRate: wins.length/closed.length*100,
      profitFactor: gl === 0 ? gw : gw/gl,
      netProfit: closed.reduce((s,p) => s+nv(p), 0),
      avgWin: wins.length  > 0 ? gw/wins.length  : 0,
      avgLoss: loses.length > 0 ? gl/loses.length : 0,
      maxDDPct: null, maxDDAbs: null,
      recoveryFactor: null, avgDurationHours: null,
      maxConsecWins: null, maxConsecLosses: null,
    };
  }, [selectedSymbol, filteredPositions, stats]);

  const S = displayStats;

  return (
    <main className="min-h-screen bg-[#080b12] text-white">

      {/* Top bar */}
      <div className="pt-24 px-5">
        <div className="max-w-[1200px] mx-auto border-b border-white/[0.05] pb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5 mb-0.5">
              <h1 className="text-lg font-black">Mis Métricas</h1>
              {account.isLive ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[0.6rem] font-bold text-emerald-400 border border-emerald-500/25 bg-emerald-500/[0.08] uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>Live
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[0.6rem] font-bold text-white/30 border border-white/10 bg-white/[0.04] uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/30"/>Offline
                </span>
              )}
            </div>
            <p className="text-white/25 text-xs">
              {account.broker ?? "—"} · {account.server ?? "—"} · #{account.accountLogin ?? "—"}
              <span className="ml-3">Sync {lastSyncAgo}</span>
            </p>
          </div>
        </div>
      </div>

      {/* KPI Row 1: Core */}
      <section className="px-5 pt-5 pb-3">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <KPI label="Balance"   color="#a78bfa" value={cur + " " + fmtNum(account.balance ?? 0)}/>
          <KPI label="Equity"    color="#60a5fa" value={cur + " " + fmtNum(account.equity  ?? 0)}/>
          <KPI label="Net P&L"   color={S && S.netProfit >= 0 ? "#4ade80" : "#f87171"}
            value={S ? fmtMoney(cur, S.netProfit) : "—"}
            sub={S ? `${((S.netProfit/(account.balance??1))*100).toFixed(2)}% retorno` : undefined}/>
          <KPI label="Win Rate"  color="#f59e0b"
            value={S ? S.winRate.toFixed(1) + "%" : "—"}
            sub={S ? `${S.totalTrades} operaciones` : undefined}/>
          <KPI label="P. Factor" color="#34d399"
            value={S ? S.profitFactor.toFixed(2) : "—"}
            sub={S ? `Avg win ${cur} ${S.avgWin.toFixed(0)}` : undefined}/>
          <KPI label="Avg Loss"  color="#fb923c"
            value={S ? cur + " " + S.avgLoss.toFixed(0) : "—"}
            sub={S && S.avgLoss > 0 ? `Ratio ${(S.avgWin/S.avgLoss).toFixed(2)}` : undefined}/>
        </div>
      </section>

      {/* KPI Row 2: Risk metrics */}
      <section className="px-5 pb-4">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <KPI label="Max DD %"     color="#ef4444"
            value={stats.maxDDPct != null ? stats.maxDDPct.toFixed(2) + "%" : "—"}
            sub="Drawdown máximo"/>
          <KPI label="Max DD $"     color="#f97316"
            value={stats.maxDDAbs != null ? cur + " " + fmtNum(stats.maxDDAbs) : "—"}
            sub="En términos absolutos"/>
          <KPI label="Recovery F."  color="#a78bfa"
            value={stats.recoveryFactor != null ? stats.recoveryFactor.toFixed(2) : "—"}
            sub="Net P&L / MaxDD"/>
          <KPI label="Duración Med."color="#60a5fa"
            value={stats.avgDurationHours != null ? stats.avgDurationHours.toFixed(1) + "h" : "—"}
            sub="Por operación"/>
          <KPI label="Racha Gan."   color="#22c55e"
            value={stats.maxConsecWins != null ? String(stats.maxConsecWins) : "—"}
            sub="Ganadoras consecutivas"/>
          <KPI label="Racha Perd."  color="#f87171"
            value={stats.maxConsecLosses != null ? String(stats.maxConsecLosses) : "—"}
            sub="Perdedoras consecutivas"/>
        </div>
      </section>

      {/* Symbol filter */}
      <section className="px-5 pb-4">
        <div className="max-w-[1200px] mx-auto flex items-center gap-2 flex-wrap">
          <span className="text-xs text-white/30 mr-1">Filtrar:</span>
          {["ALL", ...allSymbols].map(sym => (
            <button key={sym} onClick={() => setSelectedSymbol(sym)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: selectedSymbol===sym ? "rgba(59,130,246,0.2)"             : "rgba(255,255,255,0.04)",
                border:     `1px solid ${selectedSymbol===sym ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.07)"}`,
                color:      selectedSymbol===sym ? "#60a5fa"                           : "rgba(255,255,255,0.45)",
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
            <EquityCurve synthEquity={synthEquity} balanceOps={balanceOps} currency={cur}/>
          </div>
          <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="font-black text-sm">Cuenta</h2>
            {[
              { label:"Broker",    value: account.broker      ?? "—" },
              { label:"Servidor",  value: account.server      ?? "—" },
              { label:"Login",     value: "#" + (account.accountLogin ?? "—") },
              { label:"Titular",   value: account.accountName ?? "—" },
              { label:"Moneda",    value: cur },
              { label:"Apalanca.", value: account.leverage ? "1:" + account.leverage : "—" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between border-b border-white/[0.04] pb-2.5 last:border-0 last:pb-0">
                <span className="text-xs text-white/25">{label}</span>
                <span className="text-xs font-semibold text-white/60 text-right max-w-[140px] truncate">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open positions */}
      {openPositions.length > 0 && (
        <section className="px-5 pb-4">
          <div className="max-w-[1200px] mx-auto">
            <OpenPositions positions={openPositions} currency={cur} isLive={account.isLive}/>
          </div>
        </section>
      )}

      {/* Calendar heatmap */}
      <section className="px-5 pb-4">
        <div className="max-w-[1200px] mx-auto rounded-2xl p-5" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
          <h2 className="font-black text-sm mb-4">Actividad · Últimas 52 semanas</h2>
          <CalendarHeatmap positions={positions}/>
        </div>
      </section>

      {/* Analytics */}
      <section className="px-5 pb-4">
        <div className="max-w-[1200px] mx-auto">
          <Analytics positions={filteredPositions} currency={cur} selectedSymbol={selectedSymbol}/>
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
  const [state, setState]                   = useState<PageState>("loading");
  const [account, setAccount]               = useState<MetricasAccount | null>(null);
  const [positions, setPositions]           = useState<Position[]>([]);
  const [openPositions, setOpenPositions]   = useState<OpenPosition[]>([]);
  const [synthEquity, setSynthEquity]       = useState<SynthPoint[]>([]);
  const [balanceOps, setBalanceOps]         = useState<BalanceOp[]>([]);
  const [stats, setStats]                   = useState<Stats | null>(null);

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
      setPositions(data.positions         ?? []);
      setOpenPositions(data.openPositions ?? []);
      setSynthEquity(data.synthEquity     ?? []);
      setBalanceOps(data.balanceOps       ?? []);
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

  if (state === "loading") return (
    <div className="min-h-screen bg-[#080b12] flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin"/>
    </div>
  );
  if (state === "unauthenticated") return <UnauthScreen/>;
  if (state === "setup")           return <SetupScreen account={account!} onRegenerate={load}/>;
  if (state === "pending")         return <PendingScreen account={account!} onShowSetup={() => setState("setup")}/>;
  return (
    <Dashboard
      account={account!}
      positions={positions}
      openPositions={openPositions}
      synthEquity={synthEquity}
      balanceOps={balanceOps}
      stats={stats!}
    />
  );
}
