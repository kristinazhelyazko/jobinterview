import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "dotenv";
import { Client } from "pg";
import { defaultQuestions } from "../app/data/questions";

config({ path: resolve(process.cwd(), ".env.example") });
config({ path: resolve(process.cwd(), ".env.local"), override: true });

const password = process.env.Supabase_Password || process.env.SUPABASE_PASSWORD;

if (!password) {
  throw new Error("Supabase password is missing. Add Supabase_Password or SUPABASE_PASSWORD in .env.local/.env.example.");
}

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://postgres:${encodeURIComponent(password)}@db.rqiylhtojgbbqydzitfw.supabase.co:5432/postgres`;

const stageNameToCode: Record<string, string> = {
  "Phone Screen": "phone_screen",
  HR: "hr",
  Technical: "technical",
  "HM Interview": "hm_interview",
  "Final Round": "final_round",
};

async function applySqlFile(client: Client, relativePath: string) {
  const filePath = resolve(process.cwd(), relativePath);
  const sql = readFileSync(filePath, "utf8");
  await client.query(sql);
}

async function seedQuestions(client: Client) {
  for (const question of defaultQuestions) {
    const positionRes = await client.query<{ id: string }>(
      "select id from public.positions where code = $1 limit 1",
      [question.role],
    );
    const typeRes = await client.query<{ id: string }>(
      "select id from public.question_types where code = $1 limit 1",
      [question.type],
    );
    const stageCode = stageNameToCode[question.stage] ?? question.stage;
    const stageRes = await client.query<{ id: string }>(
      "select id from public.interview_stages where code = $1 limit 1",
      [stageCode],
    );

    if (!positionRes.rowCount || !typeRes.rowCount || !stageRes.rowCount) {
      throw new Error(`Dictionary mapping not found for question ${question.id}`);
    }

    const questionUpsert = await client.query<{ id: string }>(
      `
      insert into public.questions (source_key, text, position_id, question_type_id, stage_id, is_active)
      values ($1, $2, $3, $4, $5, true)
      on conflict (source_key)
      do update set
        text = excluded.text,
        position_id = excluded.position_id,
        question_type_id = excluded.question_type_id,
        stage_id = excluded.stage_id,
        is_active = true
      returning id
      `,
      [
        question.id,
        question.q,
        positionRes.rows[0].id,
        typeRes.rows[0].id,
        stageRes.rows[0].id,
      ],
    );

    const questionId = questionUpsert.rows[0].id;
    await client.query("delete from public.question_steps where question_id = $1", [questionId]);

    for (let index = 0; index < question.plan.length; index += 1) {
      const step = question.plan[index];
      if (!step.t.trim()) continue;
      await client.query(
        `
        insert into public.question_steps (question_id, step_index, marker, content)
        values ($1, $2, $3, $4)
        on conflict (question_id, step_index)
        do update set
          marker = excluded.marker,
          content = excluded.content
        `,
        [questionId, index + 1, step.n?.trim() || null, step.t.trim()],
      );
    }
  }
}

async function main() {
  const client = new Client({
    connectionString,
    ssl: false,
  });

  await client.connect();
  try {
    await applySqlFile(client, "supabase/migrations/001_create_interview_schema.sql");
    await applySqlFile(client, "supabase/migrations/002_seed_dictionaries.sql");
    await seedQuestions(client);
    await client.query("select pg_notify('pgrst', 'reload schema')");
    console.log(`Supabase setup completed. Migrated ${defaultQuestions.length} questions.`);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("Supabase setup failed:", error);
  process.exit(1);
});
