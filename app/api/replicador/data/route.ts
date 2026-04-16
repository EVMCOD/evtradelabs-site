import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { query } from "@/lib/d1";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { results: groups } = await query<any>(
      `SELECT id, name, status FROM ReplicadorGroup WHERE userId = ?`,
      [user.userId]
    );

    if (groups.length === 0)
      return NextResponse.json({ group: null, accounts: [], recentSignals: [] });

    const group = groups[0];

    const [accountsRes, signalsRes, pnlRes, journalRes] = await Promise.all([
      query<any>(
        `SELECT id, role, apiKey, accountLogin, accountName, broker, server,
                currency, balance, equity, status, lastSeenAt, connectedAt,
                lotMode, lotValue, symbolSuffix, copyStopLoss, copyTakeProfit, maxSlippage
         FROM ReplicadorAccount WHERE groupId = ? ORDER BY role DESC, createdAt ASC`,
        [group.id]
      ),
      // Last 50 signals with per-follower execution summary
      query<any>(
        `SELECT s.id, s.action, s.symbol, s.type, s.lots, s.masterTicket,
                s.masterPositionId, s.createdAt, s.expiresAt,
                COUNT(e.id)                                      AS totalFollowers,
                SUM(CASE WHEN e.status = 'done'    THEN 1 ELSE 0 END) AS done,
                SUM(CASE WHEN e.status = 'failed'  THEN 1 ELSE 0 END) AS failed,
                SUM(CASE WHEN e.status = 'skipped' THEN 1 ELSE 0 END) AS skipped,
                SUM(CASE WHEN e.status = 'pending' THEN 1 ELSE 0 END) AS pending,
                SUM(CASE WHEN e.status = 'expired' THEN 1 ELSE 0 END) AS expired
         FROM ReplicadorSignal s
         LEFT JOIN ReplicadorExecution e ON e.signalId = s.id
         WHERE s.groupId = ?
         GROUP BY s.id
         ORDER BY s.createdAt DESC
         LIMIT 50`,
        [group.id]
      ),
      // Daily P&L and ops count (UTC day)
      query<any>(
        `SELECT COALESCE(SUM(profit), 0) AS dailyPnl,
                COUNT(*) AS operationsToday
         FROM ReplicadorSignal
         WHERE groupId = ? AND action = 'close'
           AND date(createdAt) = date('now')`,
        [group.id]
      ),
      // Journal: last 30 closed trades
      query<any>(
        `SELECT symbol, type, lots, closePrice, profit, createdAt
         FROM ReplicadorSignal
         WHERE groupId = ? AND action = 'close'
         ORDER BY createdAt DESC
         LIMIT 30`,
        [group.id]
      ),
    ]);

    const pnl = pnlRes.results[0] ?? { dailyPnl: 0, operationsToday: 0 };

    return NextResponse.json({
      group,
      accounts:       accountsRes.results,
      recentSignals:  signalsRes.results,
      dailyPnl:       Number(pnl.dailyPnl),
      operationsToday: Number(pnl.operationsToday),
      journal:        journalRes.results,
    });
  } catch (err) {
    console.error("replicador/data GET:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
