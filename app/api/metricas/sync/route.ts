import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/d1";

// Called by the MT5 EA — auth via X-API-Key header (no JWT)
export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? req.headers.get("X-API-Key");
  if (!apiKey) {
    return NextResponse.json({ error: "Missing X-API-Key" }, { status: 401 });
  }

  // Resolve account by API key
  const { results: found } = await query<any>(
    `SELECT id, connectedAt FROM MetricasAccount WHERE apiKey = ?`,
    [apiKey]
  );
  if (found.length === 0) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
  }
  const accountId   = found[0].id as string;
  const isFirstSync = !found[0].connectedAt;
  const now         = new Date().toISOString();

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { event, account, trades, balanceOps } = body;

  // ── Update account metadata ────────────────────────────────────
  if (account) {
    await query(
      `UPDATE MetricasAccount
       SET accountLogin = COALESCE(?, accountLogin),
           accountName  = COALESCE(?, accountName),
           broker       = COALESCE(?, broker),
           server       = COALESCE(?, server),
           currency     = COALESCE(?, currency),
           balance      = COALESCE(?, balance),
           equity       = COALESCE(?, equity),
           leverage     = COALESCE(?, leverage),
           status       = 'connected',
           lastSyncAt   = ?,
           connectedAt  = COALESCE(connectedAt, ?),
           updatedAt    = ?
       WHERE id = ?`,
      [
        account.login ? String(account.login) : null,
        account.name  ?? null,
        account.broker ?? null,
        account.server ?? null,
        account.currency ?? null,
        account.balance  != null ? Number(account.balance)  : null,
        account.equity   != null ? Number(account.equity)   : null,
        account.leverage != null ? Number(account.leverage) : null,
        now,
        isFirstSync ? now : null,
        now,
        accountId,
      ]
    );

    // Write snapshot (max once per minute)
    if (account.balance != null && account.equity != null) {
      const oneMinAgo = new Date(Date.now() - 60_000).toISOString();
      const { results: recentSnap } = await query<any>(
        `SELECT id FROM MetricasSnapshot WHERE accountId = ? AND timestamp > ? LIMIT 1`,
        [accountId, oneMinAgo]
      );
      if (recentSnap.length === 0) {
        await query(
          `INSERT INTO MetricasSnapshot (id, accountId, balance, equity, margin, timestamp)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            crypto.randomUUID(),
            accountId,
            Number(account.balance),
            Number(account.equity),
            account.margin != null ? Number(account.margin) : 0,
            now,
          ]
        );
        // Prune snapshots older than 30 days — runs at most once per minute
        const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60_000).toISOString();
        await query(
          `DELETE FROM MetricasSnapshot WHERE accountId = ? AND timestamp < ?`,
          [accountId, cutoff]
        );
      }
    }
  }

  // ── Helpers ────────────────────────────────────────────────────
  // Normalise Unix timestamp (seconds) → ISO string; pass-through if already ISO
  const toISO = (t: unknown): string => {
    const s = String(t ?? "");
    return /^\d{9,11}$/.test(s) ? new Date(Number(s) * 1000).toISOString() : (s || now);
  };
  // Sanitise closeReason: EA sends "null" string for IN deals; treat as SQL NULL
  const sanitizeReason = (r: unknown): string | null => {
    if (!r || r === "null") return null;
    return String(r);
  };
  // Only update MAE/MFE when the incoming value is non-zero (preserve existing tracked value)
  const maeArg = (v: unknown) => (v != null && Number(v) !== 0) ? Number(v) : null;

  // ── Upsert trades ──────────────────────────────────────────────
  let inserted = 0;
  if (Array.isArray(trades) && trades.length > 0) {
    for (const t of trades) {
      if (!t.ticket || !t.symbol) continue;
      const tradeTime    = toISO(t.time);
      const closeReason  = sanitizeReason(t.closeReason);
      const mae          = maeArg(t.mae);
      const mfe          = maeArg(t.mfe);
      try {
        await query(
          `INSERT OR IGNORE INTO MetricasTrade
             (id, accountId, ticket, positionId, symbol, type, lots, price,
              profit, commission, swap, entry, time, comment, mae, mfe, sl, tp, closeReason)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            crypto.randomUUID(),
            accountId,
            String(t.ticket),
            t.positionId ? String(t.positionId) : null,
            t.symbol,
            t.type ?? "buy",
            t.lots       != null ? Number(t.lots)       : 0,
            t.price      != null ? Number(t.price)      : 0,
            t.profit     != null ? Number(t.profit)     : 0,
            t.commission != null ? Number(t.commission) : 0,
            t.swap       != null ? Number(t.swap)       : 0,
            t.entry ?? "out",
            tradeTime,
            t.comment ?? null,
            mae, mfe,
            t.sl != null ? Number(t.sl) : null,
            t.tp != null ? Number(t.tp) : null,
            closeReason,
          ]
        );
        await query(
          `UPDATE MetricasTrade
           SET profit = ?, commission = ?, swap = ?,
               mae         = CASE WHEN ? IS NOT NULL THEN ? ELSE mae         END,
               mfe         = CASE WHEN ? IS NOT NULL THEN ? ELSE mfe         END,
               sl          = CASE WHEN ? IS NOT NULL THEN ? ELSE sl          END,
               tp          = CASE WHEN ? IS NOT NULL THEN ? ELSE tp          END,
               closeReason = CASE WHEN ? IS NOT NULL THEN ? ELSE closeReason END
           WHERE accountId = ? AND ticket = ?`,
          [
            t.profit     != null ? Number(t.profit)     : 0,
            t.commission != null ? Number(t.commission) : 0,
            t.swap       != null ? Number(t.swap)       : 0,
            mae, mae,
            mfe, mfe,
            t.sl != null ? Number(t.sl) : null, t.sl != null ? Number(t.sl) : null,
            t.tp != null ? Number(t.tp) : null, t.tp != null ? Number(t.tp) : null,
            closeReason, closeReason,
            accountId,
            String(t.ticket),
          ]
        );
        inserted++;
      } catch (err) {
        console.error("metricas/sync trade upsert error:", t.ticket, err);
      }
    }
  }

  // ── Upsert balance ops (deposits / withdrawals / corrections) ─
  let balanceInserted = 0;
  if (Array.isArray(balanceOps) && balanceOps.length > 0) {
    for (const op of balanceOps) {
      if (!op.ticket) continue;
      try {
        const opTime = toISO(op.time);
        const opType = op.type ?? "deposit";
        await query(
          `INSERT OR IGNORE INTO MetricasBalanceOp (id, accountId, ticket, amount, type, time, comment)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [crypto.randomUUID(), accountId, String(op.ticket),
           Number(op.amount), opType, opTime, op.comment ?? null]
        );
        // UPDATE handles broker corrections (same ticket, different amount)
        await query(
          `UPDATE MetricasBalanceOp
           SET amount = ?, type = ?, comment = COALESCE(?, comment)
           WHERE accountId = ? AND ticket = ?`,
          [Number(op.amount), opType, op.comment ?? null, accountId, String(op.ticket)]
        );
        balanceInserted++;
      } catch (err) {
        console.error("metricas/sync balanceOp error:", op.ticket, err);
      }
    }
  }

  return NextResponse.json({ ok: true, event, tradesProcessed: inserted, balanceOpsProcessed: balanceInserted });
}
