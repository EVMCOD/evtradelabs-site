export {};

/**
 * Crea las tablas del Replicador en Cloudflare D1.
 * Ejecutar una vez: npx tsx scripts/migrate-d1-replicador.ts
 * Requiere CF_D1_TOKEN en el entorno.
 */

const ACCOUNT_ID  = "c5ec26eda22903c2898aadecbe94ea98";
const DATABASE_ID = "11cb5f69-c57e-4317-a524-d114efbd4ad4";
const API_TOKEN   = process.env.CF_D1_TOKEN;

if (!API_TOKEN) {
  console.error("❌  CF_D1_TOKEN no está definida.");
  process.exit(1);
}

async function run(sql: string) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${API_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ sql: sql.trim(), params: [] }),
    }
  );
  const data = await res.json() as any;
  if (!res.ok || data.errors?.length) throw new Error(data.errors?.[0]?.message ?? "D1 error");
  return data;
}

const MIGRATIONS = [
  // One group per user (MVP: 1 master + N followers)
  `CREATE TABLE IF NOT EXISTS ReplicadorGroup (
     id        TEXT PRIMARY KEY,
     userId    TEXT NOT NULL UNIQUE,
     name      TEXT NOT NULL DEFAULT 'Grupo Principal',
     status    TEXT NOT NULL DEFAULT 'active',
     createdAt TEXT NOT NULL DEFAULT (datetime('now')),
     updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
   )`,

  // Master + follower accounts
  `CREATE TABLE IF NOT EXISTS ReplicadorAccount (
     id             TEXT PRIMARY KEY,
     groupId        TEXT NOT NULL REFERENCES ReplicadorGroup(id) ON DELETE CASCADE,
     userId         TEXT NOT NULL,
     apiKey         TEXT NOT NULL UNIQUE,
     role           TEXT NOT NULL,
     accountLogin   TEXT,
     accountName    TEXT,
     broker         TEXT,
     server         TEXT,
     currency       TEXT NOT NULL DEFAULT 'USD',
     balance        REAL,
     equity         REAL,
     status         TEXT NOT NULL DEFAULT 'pending',
     lastSeenAt     TEXT,
     connectedAt    TEXT,
     lotMode        TEXT NOT NULL DEFAULT 'proportional',
     lotValue       REAL NOT NULL DEFAULT 1.0,
     symbolSuffix   TEXT NOT NULL DEFAULT '',
     copyStopLoss   INTEGER NOT NULL DEFAULT 1,
     copyTakeProfit INTEGER NOT NULL DEFAULT 1,
     maxSlippage    INTEGER NOT NULL DEFAULT 30,
     createdAt      TEXT NOT NULL DEFAULT (datetime('now')),
     updatedAt      TEXT NOT NULL DEFAULT (datetime('now'))
   )`,

  // Trade signals from master (TTL = 30s)
  `CREATE TABLE IF NOT EXISTS ReplicadorSignal (
     id               TEXT PRIMARY KEY,
     groupId          TEXT NOT NULL REFERENCES ReplicadorGroup(id) ON DELETE CASCADE,
     masterAccountId  TEXT NOT NULL,
     action           TEXT NOT NULL,
     symbol           TEXT NOT NULL,
     type             TEXT,
     lots             REAL,
     price            REAL,
     sl               REAL,
     tp               REAL,
     masterTicket     TEXT NOT NULL,
     masterPositionId TEXT NOT NULL,
     masterBalance    REAL,
     closePrice       REAL,
     profit           REAL,
     createdAt        TEXT NOT NULL,
     expiresAt        TEXT NOT NULL
   )`,

  // Execution status per follower account
  `CREATE TABLE IF NOT EXISTS ReplicadorExecution (
     id                TEXT PRIMARY KEY,
     signalId          TEXT NOT NULL REFERENCES ReplicadorSignal(id) ON DELETE CASCADE,
     followerAccountId TEXT NOT NULL,
     status            TEXT NOT NULL DEFAULT 'pending',
     followerTicket    TEXT,
     executedAt        TEXT,
     error             TEXT,
     createdAt         TEXT NOT NULL DEFAULT (datetime('now'))
   )`,

  `CREATE INDEX IF NOT EXISTS idx_repl_account_group  ON ReplicadorAccount(groupId)`,
  `CREATE INDEX IF NOT EXISTS idx_repl_signal_group   ON ReplicadorSignal(groupId, createdAt)`,
  `CREATE INDEX IF NOT EXISTS idx_repl_signal_master  ON ReplicadorSignal(masterAccountId, expiresAt)`,
  `CREATE INDEX IF NOT EXISTS idx_repl_exec_signal    ON ReplicadorExecution(signalId)`,
  `CREATE INDEX IF NOT EXISTS idx_repl_exec_follower  ON ReplicadorExecution(followerAccountId, status)`,
];

(async () => {
  for (const sql of MIGRATIONS) {
    const label = sql.slice(0, 55).replace(/\s+/g, " ").trim() + "...";
    process.stdout.write(`  ${label} `);
    try {
      await run(sql);
      console.log("✓");
    } catch (e: any) {
      console.log("✗  " + e.message);
      process.exit(1);
    }
  }
  console.log("\n✅  Tablas del Replicador creadas en D1.");
})();
