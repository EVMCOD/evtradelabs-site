"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";

/* ─── Types ──────────────────────────────────────────────── */
type PageState = "loading" | "unauthenticated" | "setup" | "ready";
type AccountRole = "master" | "follower";
type AccountStatus = "pending" | "connected" | "disconnected";

interface RGroup {
  id: string;
  name: string;
  status: string;
}

interface RAccount {
  id: string;
  role: AccountRole;
  apiKey: string;
  accountLogin: string | null;
  accountName: string | null;
  broker: string | null;
  server: string | null;
  currency: string | null;
  balance: number | null;
  equity: number | null;
  status: AccountStatus;
  lastSeenAt: string | null;
  connectedAt: string | null;
  lotMode: string;
  lotValue: number;
  symbolSuffix: string;
  copyStopLoss: number;
  copyTakeProfit: number;
  maxSlippage: number;
}

interface JournalEntry {
  symbol: string | null;
  type: string | null;
  lots: number | null;
  closePrice: number | null;
  profit: number | null;
  createdAt: string;
}

interface Signal {
  id: string;
  action: "open" | "close";
  symbol: string | null;
  type: string | null;
  lots: number | null;
  masterTicket: string | null;
  masterPositionId: string | null;
  createdAt: string;
  totalFollowers: number;
  done: number;
  failed: number;
  skipped: number;
  pending: number;
  expired: number;
}

/* ─── Utils ──────────────────────────────────────────────── */
const isLive = (lastSeenAt: string | null): boolean => {
  if (!lastSeenAt) return false;
  return Date.now() - new Date(lastSeenAt).getTime() < 5 * 60_000;
};

const fmtTime = (iso: string | null): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" });
};

const copyToClipboard = async (text: string) => {
  try { await navigator.clipboard.writeText(text); } catch { /* noop */ }
};

/* ─── Components ─────────────────────────────────────────── */

function LiveBadge({ lastSeenAt }: { lastSeenAt: string | null }) {
  const live = isLive(lastSeenAt);
  return live ? (
    <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      Live
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs text-white/30">
      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
      Offline
    </span>
  );
}

function ApiKeyField({ label, apiKey }: { label: string; apiKey: string }) {
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const masked = apiKey.slice(0, 8) + "•".repeat(Math.max(0, apiKey.length - 8));

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-white/40 uppercase tracking-wide">{label}</span>
      <div className="flex items-center gap-2">
        <code className="flex-1 bg-white/5 rounded px-2 py-1 text-xs font-mono text-white/70 overflow-hidden text-ellipsis whitespace-nowrap">
          {show ? apiKey : masked}
        </code>
        <button
          onClick={() => setShow(v => !v)}
          className="text-xs text-white/40 hover:text-white/70 transition-colors px-1"
          title={show ? "Ocultar" : "Mostrar"}
        >
          {show ? "Ocultar" : "Ver"}
        </button>
        <button
          onClick={handleCopy}
          className="text-xs text-white/40 hover:text-white/70 transition-colors px-1"
        >
          {copied ? "✓" : "Copiar"}
        </button>
      </div>
    </div>
  );
}

function AccountCard({
  acc,
  onDelete,
}: {
  acc: RAccount;
  onDelete?: (id: string) => void;
}) {
  const live = isLive(acc.lastSeenAt);
  const isFollower = acc.role === "follower";

  const lotLabel: Record<string, string> = {
    proportional: "Proporcional",
    ratio: "Ratio",
    fixed: "Fijo",
  };

  return (
    <div className={`rounded-xl border p-4 flex flex-col gap-3 ${
      live
        ? "bg-white/[0.04] border-emerald-500/20"
        : "bg-white/[0.02] border-white/[0.06]"
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            acc.role === "master"
              ? "bg-amber-500/15 text-amber-400"
              : "bg-sky-500/15 text-sky-400"
          }`}>
            {acc.role}
          </span>
          <LiveBadge lastSeenAt={acc.lastSeenAt} />
        </div>
        {isFollower && onDelete && (
          <button
            onClick={() => onDelete(acc.id)}
            className="text-xs text-white/20 hover:text-red-400 transition-colors"
            title="Eliminar cuenta follower"
          >
            Eliminar
          </button>
        )}
      </div>

      {/* Account info */}
      {acc.accountLogin ? (
        <div>
          <p className="text-sm font-medium text-white/90">
            #{acc.accountLogin} — {acc.accountName ?? "—"}
          </p>
          <p className="text-xs text-white/40 mt-0.5">
            {acc.broker ?? "—"} · {acc.server ?? "—"}
          </p>
        </div>
      ) : (
        <p className="text-sm text-white/30 italic">Pendiente de conexión</p>
      )}

      {/* Balance */}
      {acc.balance != null && (
        <div className="flex gap-4 text-sm">
          <span className="text-white/50">Balance <span className="text-white/80">{acc.currency} {acc.balance.toFixed(2)}</span></span>
          {acc.equity != null && (
            <span className="text-white/50">Equity <span className="text-white/80">{acc.equity.toFixed(2)}</span></span>
          )}
        </div>
      )}

      {/* API Key */}
      <ApiKeyField label="API Key" apiKey={acc.apiKey} />

      {/* Follower settings */}
      {isFollower && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/40">
          <span>Lotes: <span className="text-white/60">{lotLabel[acc.lotMode] ?? acc.lotMode} × {acc.lotValue}</span></span>
          {acc.symbolSuffix && <span>Sufijo: <span className="text-white/60">{acc.symbolSuffix}</span></span>}
          <span>SL: <span className={acc.copyStopLoss ? "text-emerald-400" : "text-white/30"}>{acc.copyStopLoss ? "Sí" : "No"}</span></span>
          <span>TP: <span className={acc.copyTakeProfit ? "text-emerald-400" : "text-white/30"}>{acc.copyTakeProfit ? "Sí" : "No"}</span></span>
          <span>Slippage: <span className="text-white/60">{acc.maxSlippage} pts</span></span>
        </div>
      )}

      {/* Last seen */}
      <p className="text-xs text-white/25">
        {acc.connectedAt ? `Conectado ${fmtTime(acc.connectedAt)}` : "Sin conectar"}
        {acc.lastSeenAt && ` · Visto ${fmtTime(acc.lastSeenAt)}`}
      </p>
    </div>
  );
}

const DOW = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

function Journal({ entries }: { entries: JournalEntry[] }) {
  const [viewDate, setViewDate]     = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const byDay = useMemo(() => {
    const map: Record<string, { pnl: number; trades: JournalEntry[] }> = {};
    for (const e of entries) {
      const key = e.createdAt.slice(0, 10);
      if (!map[key]) map[key] = { pnl: 0, trades: [] };
      map[key].pnl += e.profit ?? 0;
      map[key].trades.push(e);
    }
    return map;
  }, [entries]);

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDow   = new Date(year, month, 1).getDay();
  const startOffset = (firstDow + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthEntries = entries.filter(e => e.createdAt.startsWith(monthPrefix));
  const monthPnl  = monthEntries.reduce((s, e) => s + (e.profit ?? 0), 0);
  const monthWins = monthEntries.filter(e => (e.profit ?? 0) > 0).length;
  const today = new Date().toISOString().slice(0, 10);

  const monthLabel = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(viewDate);

  const selectedData = selectedDay ? byDay[selectedDay] : null;

  return (
    <div className="flex flex-col">
      {/* Month header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1)); setSelectedDay(null); }}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors text-sm"
          >‹</button>
          <span className="text-sm font-medium text-white/70 capitalize w-36 text-center">{monthLabel}</span>
          <button
            onClick={() => { setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1)); setSelectedDay(null); }}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors text-sm"
          >›</button>
        </div>
        {monthEntries.length > 0 && (
          <div className="flex items-center gap-3 text-xs text-white/30">
            <span>{monthWins}/{monthEntries.length} ops</span>
            <span className={`font-semibold tabular-nums ${monthPnl > 0 ? "text-emerald-400" : monthPnl < 0 ? "text-red-400" : "text-white/30"}`}>
              {monthPnl >= 0 ? "+" : ""}{monthPnl.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Day of week headers */}
      <div className="grid grid-cols-7 border-b border-white/[0.04]">
        {DOW.map(d => (
          <div key={d} className="text-center text-[10px] text-white/20 py-2 font-medium tracking-wide">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (!day) return (
            <div key={i} className="h-14 border-r border-b border-white/[0.03] last:border-r-0" />
          );
          const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const data = byDay[key];
          const isToday    = key === today;
          const isSelected = key === selectedDay;
          const hasTrades  = !!data;
          const pnl = data?.pnl ?? 0;

          return (
            <button
              key={i}
              onClick={() => hasTrades && setSelectedDay(isSelected ? null : key)}
              disabled={!hasTrades}
              className={`
                relative h-14 flex flex-col items-center justify-center gap-0.5 border-r border-b border-white/[0.03]
                transition-colors outline-none
                ${isSelected ? "bg-white/[0.07]" : hasTrades ? "hover:bg-white/[0.04] cursor-pointer" : "cursor-default"}
              `}
            >
              <span className={`
                flex items-center justify-center w-5 h-5 rounded-full text-xs font-medium
                ${isToday ? "bg-white/15 text-white/90" : hasTrades ? "text-white/70" : "text-white/20"}
              `}>
                {day}
              </span>
              {hasTrades && (
                <span className={`text-[10px] font-semibold tabular-nums leading-none ${
                  pnl > 0 ? "text-emerald-400" : pnl < 0 ? "text-red-400" : "text-white/30"
                }`}>
                  {pnl >= 0 ? "+" : ""}{pnl.toFixed(2)}
                </span>
              )}
              {isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/50" />
              )}
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {entries.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 gap-2 border-t border-white/[0.04]">
          <p className="text-sm text-white/25">Sin operaciones cerradas aún</p>
          <p className="text-xs text-white/15">Aparecerán aquí al cerrar posiciones en el master</p>
        </div>
      )}

      {/* Expanded day panel */}
      {selectedDay && selectedData && (
        <div className="border-t border-white/[0.08]">
          {/* Day header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.02]">
            <span className="text-xs font-medium text-white/50 capitalize">
              {new Date(selectedDay + "T12:00:00").toLocaleDateString("es-ES", {
                weekday: "long", day: "numeric", month: "long",
              })}
            </span>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-white/30">{selectedData.trades.length} op{selectedData.trades.length !== 1 ? "s" : ""}</span>
              <span className={`font-bold tabular-nums ${
                selectedData.pnl > 0 ? "text-emerald-400" : selectedData.pnl < 0 ? "text-red-400" : "text-white/30"
              }`}>
                {selectedData.pnl >= 0 ? "+" : ""}{selectedData.pnl.toFixed(2)}
              </span>
            </div>
          </div>
          {/* Trade list */}
          <div className="divide-y divide-white/[0.04]">
            {selectedData.trades.map((e, i) => {
              const pnl = e.profit ?? 0;
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02] transition-colors">
                  <div className={`flex-none w-0.5 h-7 rounded-full ${
                    pnl > 0 ? "bg-emerald-500/70" : pnl < 0 ? "bg-red-500/70" : "bg-white/10"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white/85">{e.symbol ?? "—"}</span>
                      <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                        e.type === "buy" ? "bg-sky-500/15 text-sky-400" : "bg-orange-500/15 text-orange-400"
                      }`}>
                        {e.type ?? "—"}
                      </span>
                      <span className="text-xs text-white/30">{e.lots?.toFixed(2)} lotes</span>
                    </div>
                    <div className="text-[11px] text-white/25 mt-0.5">
                      Cierre {e.closePrice?.toFixed(5) ?? "—"} ·{" "}
                      {new Date(e.createdAt).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <div className={`text-sm font-bold tabular-nums ${
                    pnl > 0 ? "text-emerald-400" : pnl < 0 ? "text-red-400" : "text-white/30"
                  }`}>
                    {pnl >= 0 ? "+" : ""}{pnl.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function SignalsTable({ signals }: { signals: Signal[] }) {
  if (signals.length === 0)
    return <p className="text-sm text-white/30 py-4 text-center">Sin señales aún.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-white/30 border-b border-white/[0.06]">
            <th className="text-left py-2 pr-3 font-medium">Hora</th>
            <th className="text-left py-2 pr-3 font-medium">Acción</th>
            <th className="text-left py-2 pr-3 font-medium">Símbolo</th>
            <th className="text-left py-2 pr-3 font-medium">Tipo</th>
            <th className="text-right py-2 pr-3 font-medium">Lotes</th>
            <th className="text-right py-2 pr-3 font-medium">OK</th>
            <th className="text-right py-2 pr-3 font-medium">Fail</th>
            <th className="text-right py-2 pr-3 font-medium">Skip</th>
            <th className="text-right py-2 font-medium">Pend</th>
          </tr>
        </thead>
        <tbody>
          {signals.map(s => (
            <tr key={s.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
              <td className="py-1.5 pr-3 text-white/40">{fmtTime(s.createdAt)}</td>
              <td className="py-1.5 pr-3">
                <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                  s.action === "open"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-red-500/10 text-red-400"
                }`}>
                  {s.action}
                </span>
              </td>
              <td className="py-1.5 pr-3 text-white/70 font-medium">{s.symbol ?? "—"}</td>
              <td className="py-1.5 pr-3 text-white/50">{s.type ?? "—"}</td>
              <td className="py-1.5 pr-3 text-right text-white/60">{s.lots?.toFixed(2) ?? "—"}</td>
              <td className="py-1.5 pr-3 text-right text-emerald-400">{s.done}</td>
              <td className="py-1.5 pr-3 text-right text-red-400">{s.failed > 0 ? s.failed : <span className="text-white/20">0</span>}</td>
              <td className="py-1.5 pr-3 text-right text-white/30">{s.skipped}</td>
              <td className="py-1.5 text-right text-amber-400">{s.pending > 0 ? s.pending : <span className="text-white/20">0</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Add Follower Form ───────────────────────────────────── */
function AddFollowerForm({
  onAdd,
  onCancel,
}: {
  onAdd: (params: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}) {
  const [lotMode, setLotMode] = useState("proportional");
  const [lotValue, setLotValue] = useState("1.0");
  const [symbolSuffix, setSymbolSuffix] = useState("");
  const [copyStopLoss, setCopyStopLoss] = useState(true);
  const [copyTakeProfit, setCopyTakeProfit] = useState(true);
  const [maxSlippage, setMaxSlippage] = useState("30");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onAdd({
      lotMode,
      lotValue: Number(lotValue),
      symbolSuffix,
      copyStopLoss,
      copyTakeProfit,
      maxSlippage: Number(maxSlippage),
    });
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 flex flex-col gap-4">
      <p className="text-sm font-semibold text-white/80">Nueva cuenta follower</p>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-white/40">Modo de lotes</label>
          <select
            value={lotMode}
            onChange={e => setLotMode(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 focus:outline-none focus:border-white/20"
          >
            <option value="proportional">Proporcional (balance)</option>
            <option value="ratio">Ratio × multiplicador</option>
            <option value="fixed">Fijo</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-white/40">
            {lotMode === "fixed" ? "Lotes fijos" : "Multiplicador"}
          </label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={lotValue}
            onChange={e => setLotValue(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 focus:outline-none focus:border-white/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-white/40">Sufijo símbolo (opcional)</label>
          <input
            type="text"
            placeholder=".ecn"
            value={symbolSuffix}
            onChange={e => setSymbolSuffix(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 focus:outline-none focus:border-white/20 placeholder:text-white/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-white/40">Slippage máximo (puntos)</label>
          <input
            type="number"
            min="0"
            value={maxSlippage}
            onChange={e => setMaxSlippage(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 focus:outline-none focus:border-white/20"
          />
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
          <input
            type="checkbox"
            checked={copyStopLoss}
            onChange={e => setCopyStopLoss(e.target.checked)}
            className="accent-emerald-500"
          />
          Copiar Stop Loss
        </label>
        <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
          <input
            type="checkbox"
            checked={copyTakeProfit}
            onChange={e => setCopyTakeProfit(e.target.checked)}
            className="accent-emerald-500"
          />
          Copiar Take Profit
        </label>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm text-white/80 transition-colors disabled:opacity-40"
        >
          {loading ? "Creando..." : "Crear cuenta follower"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm text-white/30 hover:text-white/60 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

/* ─── Setup Screen ───────────────────────────────────────── */
function SetupScreen({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("Grupo Principal");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/replicador/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_group", name }),
      });
      if (!res.ok) {
        const d = await res.json();
        setErr(d.error ?? "Error al crear grupo");
        return;
      }
      onCreated();
    } catch {
      setErr("Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2">EV Replicador</h1>
        <p className="text-white/50 text-sm mb-8">
          Réplica automática de operaciones entre cuentas MT5.
          Comienza creando tu grupo de cuentas.
        </p>

        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-white/40 uppercase tracking-wide">Nombre del grupo</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/80 focus:outline-none focus:border-white/20 text-sm"
            />
          </div>

          {err && <p className="text-sm text-red-400">{err}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 text-sm font-medium transition-colors disabled:opacity-40"
          >
            {loading ? "Creando..." : "Crear grupo y cuenta master"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────── */
function Dashboard({
  group,
  accounts,
  signals,
  dailyPnl,
  operationsToday,
  journal,
  onRefresh,
}: {
  group: RGroup;
  accounts: RAccount[];
  signals: Signal[];
  dailyPnl: number;
  operationsToday: number;
  journal: JournalEntry[];
  onRefresh: () => void;
}) {
  const [showAddFollower, setShowAddFollower] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const master = accounts.find(a => a.role === "master");
  const followers = accounts.filter(a => a.role === "follower");

  const totalBalance = accounts.reduce((s, a) => s + (a.balance ?? 0), 0);
  const currency = accounts.find(a => a.currency)?.currency ?? "USD";

  const handleAddFollower = async (params: Record<string, unknown>) => {
    setErr(null);
    const res = await fetch("/api/replicador/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add_account", ...params }),
    });
    if (!res.ok) {
      const d = await res.json();
      setErr(d.error ?? "Error al añadir follower");
      return;
    }
    setShowAddFollower(false);
    onRefresh();
  };

  const handleDelete = async (accountId: string) => {
    if (!confirm("¿Eliminar esta cuenta follower? Se perderá su API Key.")) return;
    setDeleteLoading(accountId);
    try {
      await fetch("/api/replicador/setup", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId }),
      });
      onRefresh();
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/replicador" className="text-white/30 hover:text-white/60 text-sm transition-colors">
            ← Replicador
          </Link>
          <span className="text-white/20">/</span>
          <h1 className="text-sm font-medium text-white/80">{group.name}</h1>
        </div>
        <button
          onClick={onRefresh}
          className="text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          Actualizar
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-8">
        {err && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {err}
          </div>
        )}

        {/* Financial KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-5 py-4">
            <p className="text-xs text-white/30 uppercase tracking-wide mb-1">Balance Total</p>
            <p className="text-2xl font-semibold text-white/90 tabular-nums">
              {currency} {totalBalance.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-white/25 mt-1">{accounts.filter(a => a.balance != null).length} cuenta{accounts.filter(a => a.balance != null).length !== 1 ? "s" : ""}</p>
          </div>

          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-5 py-4">
            <p className="text-xs text-white/30 uppercase tracking-wide mb-1">P&L Hoy</p>
            <p className={`text-2xl font-semibold tabular-nums ${
              dailyPnl > 0 ? "text-emerald-400" : dailyPnl < 0 ? "text-red-400" : "text-white/40"
            }`}>
              {dailyPnl >= 0 ? "+" : ""}{dailyPnl.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-white/25 mt-1">{operationsToday} operación{operationsToday !== 1 ? "es" : ""} cerrada{operationsToday !== 1 ? "s" : ""}</p>
          </div>

          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-5 py-4">
            <p className="text-xs text-white/30 uppercase tracking-wide mb-1">Estado</p>
            <p className="text-2xl font-semibold text-white/90">
              {accounts.filter(a => isLive(a.lastSeenAt)).length}
              <span className="text-base text-white/30 font-normal"> / {accounts.length}</span>
            </p>
            <p className="text-xs text-white/25 mt-1">cuentas en línea · {followers.length}/10 followers</p>
          </div>
        </div>

        {/* Accounts section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Cuentas</h2>
            {followers.length < 10 && !showAddFollower && (
              <button
                onClick={() => setShowAddFollower(true)}
                className="text-xs text-white/40 hover:text-white/70 border border-white/[0.08] rounded-lg px-3 py-1.5 transition-colors"
              >
                + Añadir follower
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {master && (
              <AccountCard acc={master} />
            )}

            {followers.map(acc => (
              <AccountCard
                key={acc.id}
                acc={acc}
                onDelete={deleteLoading === acc.id ? undefined : handleDelete}
              />
            ))}

            {followers.length === 0 && !showAddFollower && (
              <div className="rounded-xl border border-dashed border-white/[0.08] px-6 py-8 text-center">
                <p className="text-sm text-white/30">Sin cuentas follower.</p>
                <p className="text-xs text-white/20 mt-1">
                  Añade una cuenta follower e instala el EA con el Role = FOLLOWER.
                </p>
              </div>
            )}

            {showAddFollower && (
              <AddFollowerForm
                onAdd={handleAddFollower}
                onCancel={() => setShowAddFollower(false)}
              />
            )}
          </div>
        </section>

        {/* Install instructions */}
        {master && (
          <section className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
              Instrucciones de instalación
            </h2>
            <ol className="flex flex-col gap-3 text-sm text-white/60">
              <li className="flex gap-3">
                <span className="flex-none w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/40 font-medium">1</span>
                <span>
                  Descarga{" "}
                  <a href="/ea/EVReplicador.ex5" className="text-white/80 underline underline-offset-2 hover:text-white" download>
                    EVReplicador.ex5
                  </a>{" "}
                  y compílalo en MetaEditor.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-none w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/40 font-medium">2</span>
                <span>
                  En la cuenta <strong className="text-amber-400">master</strong>: instala el EA con{" "}
                  <code className="bg-white/5 px-1 rounded text-xs">Role = MASTER</code> y pega la API Key de esa cuenta.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-none w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/40 font-medium">3</span>
                <span>
                  En cada cuenta <strong className="text-sky-400">follower</strong>: instala el EA con{" "}
                  <code className="bg-white/5 px-1 rounded text-xs">Role = FOLLOWER</code> y pega la API Key del follower correspondiente.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-none w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/40 font-medium">4</span>
                <span>
                  Habilita WebRequest para{" "}
                  <code className="bg-white/5 px-1 rounded text-xs">https://evtradelabs.com</code>{" "}
                  en MT5 → Herramientas → Opciones → Asesores Expertos.
                </span>
              </li>
            </ol>
          </section>
        )}

        {/* Journal */}
        <section>
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
            Journal
          </h2>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <Journal entries={journal} />
          </div>
        </section>

        {/* Signals table */}
        <section>
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
            Señales recientes
          </h2>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <SignalsTable signals={signals} />
          </div>
        </section>
      </main>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function ReplicadorDashboardPage() {
  const [state, setState] = useState<PageState>("loading");
  const [group, setGroup]             = useState<RGroup | null>(null);
  const [accounts, setAccounts]       = useState<RAccount[]>([]);
  const [signals, setSignals]         = useState<Signal[]>([]);
  const [dailyPnl, setDailyPnl]       = useState(0);
  const [operationsToday, setOpsToday] = useState(0);
  const [journal, setJournal]         = useState<JournalEntry[]>([]);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/replicador/data");
      if (res.status === 401) { setState("unauthenticated"); return; }
      if (!res.ok) return;
      const data = await res.json();
      if (!data.group) {
        setState("setup");
        return;
      }
      setGroup(data.group);
      setAccounts(data.accounts);
      setSignals(data.recentSignals ?? []);
      setDailyPnl(data.dailyPnl ?? 0);
      setOpsToday(data.operationsToday ?? 0);
      setJournal(data.journal ?? []);
      setState("ready");
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Poll every 10s when ready
  useEffect(() => {
    if (state !== "ready") return;
    const id = setInterval(load, 10_000);
    return () => clearInterval(id);
  }, [state, load]);

  if (state === "loading")
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <p className="text-white/30 text-sm">Cargando...</p>
      </div>
    );

  if (state === "unauthenticated")
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 text-sm mb-4">Sesión expirada.</p>
          <Link href="/login" className="text-white/80 underline text-sm">Iniciar sesión</Link>
        </div>
      </div>
    );

  if (state === "setup")
    return <SetupScreen onCreated={load} />;

  if (state === "ready" && group)
    return (
      <Dashboard
        group={group}
        accounts={accounts}
        signals={signals}
        dailyPnl={dailyPnl}
        operationsToday={operationsToday}
        journal={journal}
        onRefresh={load}
      />
    );

  return null;
}
