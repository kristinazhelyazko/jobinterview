import { Pool } from "pg";

let pool: Pool | null = null;

function getConnectionString() {
  const fromEnv = process.env.DATABASE_URL;
  if (fromEnv) return fromEnv;

  const password = process.env.SUPABASE_PASSWORD;
  if (!password) {
    throw new Error("Missing SUPABASE_PASSWORD (or DATABASE_URL) for PostgreSQL connection.");
  }

  return `postgresql://postgres:${encodeURIComponent(password)}@db.rqiylhtojgbbqydzitfw.supabase.co:5432/postgres`;
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
