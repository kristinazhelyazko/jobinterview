import { createClient } from "@supabase/supabase-js";
import { defaultQuestions } from "../app/data/questions";
import { STAGE_NAME_TO_CODE } from "../lib/questions/constants";

type DictionaryLookup = Record<string, string>;

async function getLookup(client: any, table: "positions" | "question_types" | "interview_stages"): Promise<DictionaryLookup> {
  const db = client;
  const { data, error } = await db.from(table).select("id, code");
  if (error) throw error;
  return Object.fromEntries(((data ?? []) as Array<{ id: string; code: string }>).map((x) => [x.code, x.id]));
}

async function run() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before migration.");
  }

  const client = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const db = client as any;

  const [positions, types, stages] = await Promise.all([
    getLookup(client, "positions"),
    getLookup(client, "question_types"),
    getLookup(client, "interview_stages"),
  ]);

  for (const item of defaultQuestions) {
    const stageCode = STAGE_NAME_TO_CODE[item.stage] ?? item.stage;
    const positionId = positions[item.role];
    const questionTypeId = types[item.type];
    const stageId = stages[stageCode];

    if (!positionId || !questionTypeId || !stageId) {
      throw new Error(`Missing dictionary mapping for question ${item.id}.`);
    }

    const { data: savedQuestion, error: saveQuestionError } = await db
      .from("questions")
      .upsert(
        {
          source_key: item.id,
          text: item.q,
          position_id: positionId,
          question_type_id: questionTypeId,
          stage_id: stageId,
          is_active: true,
        },
        { onConflict: "source_key" },
      )
      .select("id")
      .single();

    if (saveQuestionError || !savedQuestion) {
      throw saveQuestionError ?? new Error(`Failed to upsert question ${item.id}.`);
    }

    const questionId = savedQuestion.id as string;
    const { error: deleteStepsError } = await db.from("question_steps").delete().eq("question_id", questionId);
    if (deleteStepsError) throw deleteStepsError;

    const steps = item.plan
      .filter((step) => step.t.trim())
      .map((step, index) => ({
        question_id: questionId,
        step_index: index + 1,
        marker: step.n?.trim() || null,
        content: step.t.trim(),
      }));

    if (steps.length) {
      const { error: insertStepsError } = await db.from("question_steps").insert(steps);
      if (insertStepsError) throw insertStepsError;
    }
  }

  console.log(`Migrated ${defaultQuestions.length} questions into Supabase.`);
}

run().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
