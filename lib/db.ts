import postgres from "postgres";

/**
 * Postgres client singleton (Supabase over DATABASE_URL).
 * Returns null when DATABASE_URL isn't configured — callers fall back to the
 * file manifest so local dev works without the database.
 */
declare global {
  // eslint-disable-next-line no-var
  var __fbcloneSql: ReturnType<typeof postgres> | undefined;
}

export function getSql() {
  if (!process.env.DATABASE_URL) return null;
  if (!global.__fbcloneSql) {
    global.__fbcloneSql = postgres(process.env.DATABASE_URL, {
      ssl: "require",
      prepare: false, // required for Supabase transaction pooler (port 6543)
      max: 5,
    });
  }
  return global.__fbcloneSql;
}
