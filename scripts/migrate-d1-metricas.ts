export {};

/**
 * Crea las tablas de EV Métricas en Cloudflare D1.
 * Ejecutar una vez: npx tsx scripts/migrate-d1-metricas.ts
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
  `CREATE TABLE IF NOT EXISTS MetricasAccount (
     id           TEXT PRIMARY KEY,
     userId       TEXT NOT NULL UNIQUE,
     apiKey       TEXT NOT NULL UNIQUE,
     accountLogin TEXT,
     accountName  TEXT,
     broker       TEXT,
     server       TEXT,
     currency     TEXT NOT NULL DEFAULT 'USD',
     balance      REAL,
     equity       REAL,
     leverage     INTEGER,
     status       TEXT NOT NULL DEFAULT 'pending',
     lastSyncAt   TEXT,
     connectedAt  TEXT,
     createdAt    TEXT NOT NULL DEFAULT (datetime('now')),
     updatedAt    TEXT NOT NULL DEFAULT (datetime('now'))
   )`,

  `CREATE TABLE IF NOT EXISTS MetricasTrade (
     id         TEXT PRIMARY KEY,
     accountId  TEXT NOT NULL REFERENCES MetricasAccount(id) ON DELETE CASCADE,
     ticket     TEXT NOT NULL,
     positionId TEXT,
     symbol     TEXT NOT NULL,
     type       TEXT NOT NULL,
     lots       REAL NOT NULL DEFAULT 0,
     price      REAL NOT NULL DEFAULT 0,
     profit     REAL NOT NULL DEFAULT 0,
     commission REAL NOT NULL DEFAULT 0,
     swap       REAL NOT NULL DEFAULT 0,
     entry      TEXT NOT NULL DEFAULT 'out',
     time       TEXT NOT NULL,
     comment    TEXT,
     createdAt  TEXT NOT NULL DEFAULT (datetime('now')),
     UNIQUE(accountId, ticket)
   )`,

  `CREATE TABLE IF NOT EXISTS MetricasSnapshot (
     id        TEXT PRIMARY KEY,
     accountId TEXT NOT NULL REFERENCES MetricasAccount(id) ON DELETE CASCADE,
     balance   REAL NOT NULL,
     equity    REAL NOT NULL,
     margin    REAL NOT NULL DEFAULT 0,
     timestamp TEXT NOT NULL DEFAULT (datetime('now'))
   )`,

  `CREATE INDEX IF NOT EXISTS idx_metricas_trade_account ON MetricasTrade(accountId, time)`,
  `CREATE INDEX IF NOT EXISTS idx_metricas_snapshot_account ON MetricasSnapshot(accountId, timestamp)`,
];

(async () => {
  for (const sql of MIGRATIONS) {
    const label = sql.slice(0, 50).replace(/\s+/g, " ").trim() + "...";
    process.stdout.write(`  ${label} `);
    try {
      await run(sql);
      console.log("✓");
    } catch (e: any) {
      console.log("✗  " + e.message);
      process.exit(1);
    }
  }
  console.log("\n✅  Tablas de Métricas creadas en D1.");
})();
