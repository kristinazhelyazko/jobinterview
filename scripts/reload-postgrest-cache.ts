import { config } from "dotenv";
import { Client } from "pg";

config({ path: ".env.local" });

const password = process.env.SUPABASE_PASSWORD;
if (!password) {
  throw new Error("SUPABASE_PASSWORD is missing in .env.local");
}

const connectionString = `postgresql://postgres:${encodeURIComponent(password)}@db.rqiylhtojgbbqydzitfw.supabase.co:5432/postgres`;

async function main() {
  const client = new Client({ connectionString, ssl: false });
  await client.connect();
  try {
    await client.query("select pg_notify('pgrst', 'reload schema')");
    const tables = await client.query<{ table_name: string }>(
      `
        select table_name
        from information_schema.tables
        where table_schema='public'
          and table_name in ('positions','question_types','interview_stages','questions','question_steps')
        order by table_name
      `,
    );
    console.log("Schema cache reloaded. Found tables:", tables.rows.map((x) => x.table_name).join(", "));
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("Failed to reload schema cache:", error);
  process.exit(1);
});
