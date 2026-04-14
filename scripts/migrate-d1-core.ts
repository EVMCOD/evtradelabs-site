export {};

/**
 * Crea las tablas principales (Order, License) en Cloudflare D1.
 * La tabla User ya existe (creada previamente para auth).
 * Ejecutar: npx tsx scripts/migrate-d1-core.ts
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
}

const MIGRATIONS = [
  // User table — may already exist, IF NOT EXISTS is safe
  `CREATE TABLE IF NOT EXISTS User (
     id            TEXT PRIMARY KEY,
     email         TEXT NOT NULL UNIQUE,
     name          TEXT,
     password      TEXT,
     emailVerified TEXT,
     createdAt     TEXT NOT NULL DEFAULT (datetime('now')),
     updatedAt     TEXT NOT NULL DEFAULT (datetime('now'))
   )`,

  // Order — reserved word in SQLite, quoted
  `CREATE TABLE IF NOT EXISTS "Order" (
     id              TEXT PRIMARY KEY,
     stripeSessionId TEXT NOT NULL UNIQUE,
     customerEmail   TEXT NOT NULL,
     customerName    TEXT,
     country         TEXT,
     productSlug     TEXT NOT NULL,
     productName     TEXT NOT NULL,
     amount          INTEGER NOT NULL DEFAULT 0,
     currency        TEXT NOT NULL DEFAULT 'eur',
     status          TEXT NOT NULL DEFAULT 'pending',
     licenseKey      TEXT,
     createdAt       TEXT NOT NULL DEFAULT (datetime('now')),
     updatedAt       TEXT NOT NULL DEFAULT (datetime('now'))
   )`,

  `CREATE TABLE IF NOT EXISTS License (
     id                TEXT PRIMARY KEY,
     key               TEXT NOT NULL UNIQUE,
     orderId           TEXT NOT NULL REFERENCES "Order"(id),
     productSlug       TEXT NOT NULL,
     productName       TEXT NOT NULL,
     customerEmail     TEXT NOT NULL,
     userId            TEXT,
     status            TEXT NOT NULL DEFAULT 'active',
     expiresAt         TEXT,
     maxAccounts       INTEGER NOT NULL DEFAULT 1,
     activatedAccounts INTEGER NOT NULL DEFAULT 0,
     createdAt         TEXT NOT NULL DEFAULT (datetime('now')),
     updatedAt         TEXT NOT NULL DEFAULT (datetime('now'))
   )`,

  `CREATE INDEX IF NOT EXISTS idx_order_email    ON "Order"(customerEmail)`,
  `CREATE INDEX IF NOT EXISTS idx_license_email  ON License(customerEmail)`,
  `CREATE INDEX IF NOT EXISTS idx_license_order  ON License(orderId)`,
];

(async () => {
  for (const sql of MIGRATIONS) {
    const label = sql.replace(/\s+/g, " ").trim().slice(0, 55) + "...";
    process.stdout.write(`  ${label} `);
    try {
      await run(sql);
      console.log("✓");
    } catch (e: any) {
      console.log("✗  " + e.message);
      process.exit(1);
    }
  }
  console.log("\n✅  Tablas core creadas en D1.");
})();
