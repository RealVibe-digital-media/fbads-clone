/**
 * Apply supabase/schema.sql to the database in DATABASE_URL (.env.local).
 * Idempotent — safe to run repeatedly.  Run with:  node scripts/setup-db.js
 */
const fs = require("fs");
const path = require("path");
const postgres = require("postgres");
const { loadEnvLocal } = require("./env");

async function main() {
  loadEnvLocal();
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set — add it to .env.local");
    process.exit(1);
  }

  const sql = postgres(process.env.DATABASE_URL, {
    ssl: "require",
    prepare: false,
  });
  const schema = fs.readFileSync(
    path.join(__dirname, "..", "supabase", "schema.sql"),
    "utf8"
  );

  await sql.unsafe(schema);
  const [{ count }] = await sql`select count(*)::int as count from public.invoices`;
  console.log(`Schema applied. invoices table has ${count} row(s).`);
  await sql.end();
}

main().catch((e) => {
  console.error("setup-db failed:", e.message);
  process.exit(1);
});
