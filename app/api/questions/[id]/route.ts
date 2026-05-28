import { NextResponse } from "next/server";
import { getPgPool } from "@/lib/db/postgres";
import { STAGE_NAME_TO_CODE } from "@/lib/questions/constants";
import type { Question } from "@/lib/questions/types";

async function resolveDictionaryIds(payload: Question) {
  const pool = getPgPool();
  const stageCode = STAGE_NAME_TO_CODE[payload.stage] ?? payload.stage;
  const [positionRes, typeRes, stageRes] = await Promise.all([
    pool.query<{ id: string; code: string }>("select id, code from public.positions"),
    pool.query<{ id: string; code: string }>("select id, code from public.question_types"),
    pool.query<{ id: string; code: string }>("select id, code from public.interview_stages"),
  ]);

  const positions = positionRes.rows as Array<{ id: string; code: string }>;
  const questionTypes = typeRes.rows as Array<{ id: string; code: string }>;
  const stages = stageRes.rows as Array<{ id: string; code: string }>;

  const positionId = positions.find((x) => x.code === payload.role)?.id;
  const questionTypeId = questionTypes.find((x) => x.code === payload.type)?.id;
  const stageId = stages.find((x) => x.code === stageCode)?.id;

  if (!positionId || !questionTypeId || !stageId) {
    throw new Error("Dictionary reference not found.");
  }

  return {
    positionId,
    questionTypeId,
    stageId,
  };
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const payload = (await request.json()) as Question;
    if (!payload.q?.trim() || !payload.role || !payload.type || !payload.stage) {
      return NextResponse.json({ error: "Question text is required." }, { status: 400 });
    }

    const pool = getPgPool();
    const refs = await resolveDictionaryIds(payload);
    await pool.query(
      `
      update public.questions
      set text = $1,
          position_id = $2,
          question_type_id = $3,
          stage_id = $4
      where id = $5
      `,
      [payload.q.trim(), refs.positionId, refs.questionTypeId, refs.stageId, id],
    );

    await pool.query("delete from public.question_steps where question_id = $1", [id]);

    const cleanedSteps = (payload.plan ?? []).filter((step) => step.t?.trim());
    if (cleanedSteps.length) {
      for (let index = 0; index < cleanedSteps.length; index += 1) {
        const step = cleanedSteps[index];
        await pool.query(
          `
          insert into public.question_steps (question_id, step_index, marker, content)
          values ($1, $2, $3, $4)
          `,
          [id, index + 1, step.n?.trim() || null, step.t.trim()],
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update question." }, { status: 500 });
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const pool = getPgPool();
    await pool.query("delete from public.questions where id = $1", [id]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete question." }, { status: 500 });
  }
}
