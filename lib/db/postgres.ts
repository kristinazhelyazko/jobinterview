import { Pool } from "pg";

let pool: Pool | null = null;

function getConnectionString() {
  const fromEnv = process.env.DATABASE_URL;
  if (!fromEnv) {
    throw new Error("Missing DATABASE_URL for PostgreSQL connection.");
  }
  return fromEnv;
}

export function getPgPool() {
  if (!pool) {
    const connectionString = getConnectionString();
    const isLocalConnection =
      connectionString.includes("localhost") || connectionString.includes("127.0.0.1");

    pool = new Pool({
      connectionString,
      // Supabase managed Postgres requires TLS in cloud runtimes (e.g. Vercel).
      ssl: isLocalConnection ? false : { rejectUnauthorized: false },
      max: 5,
    });
  }
  return pool;
}
