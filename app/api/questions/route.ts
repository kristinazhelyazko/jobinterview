import { NextResponse } from "next/server";
import { getPgPool } from "@/lib/db/postgres";
import { STAGE_CODE_TO_NAME, STAGE_NAME_TO_CODE } from "@/lib/questions/constants";
import type { PlanItem, Question, QuestionType, Role, Stage } from "@/lib/questions/types";

type DictionaryRow = { id: string; code: string; name: string };

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

async function getDictionaries() {
  const pool = getPgPool();
  const [positionsRes, typesRes, stagesRes] = await Promise.all([
    pool.query<DictionaryRow>("select id, code, name from public.positions where is_active = true order by code"),
    pool.query<DictionaryRow>(
      "select id, code, name from public.question_types where is_active = true order by sort_order, code",
    ),
    pool.query<DictionaryRow>(
      "select id, code, name from public.interview_stages where is_active = true order by sort_order, code",
    ),
  ]);

  return {
    positions: positionsRes.rows,
    questionTypes: typesRes.rows,
    stages: stagesRes.rows,
  };
}

export async function GET() {
  try {
    const pool = getPgPool();
    const dictionaries = await getDictionaries();
    const questionRows = await pool.query<{
      id: string;
      text: string;
      role: string;
      type: string;
      stage_code: string;
      step_index: number | null;
      marker: string | null;
      content: string | null;
    }>(
      `
      select
        q.id,
        q.text,
        p.code as role,
        qt.code as type,
        s.code as stage_code,
        qs.step_index,
        qs.marker,
        qs.content
      from public.questions q
      join public.positions p on p.id = q.position_id
      join public.question_types qt on qt.id = q.question_type_id
      join public.interview_stages s on s.id = q.stage_id
      left join public.question_steps qs on qs.question_id = q.id
      where q.is_active = true
      order by q.created_at asc, qs.step_index asc
      `,
    );

    const byId = new Map<string, Question>();
    for (const row of questionRows.rows) {
      if (!byId.has(row.id)) {
        byId.set(row.id, {
          id: row.id,
          q: row.text,
          role: row.role as Role,
          type: row.type as QuestionType,
          stage: (STAGE_CODE_TO_NAME[row.stage_code] ?? row.stage_code) as Stage,
          plan: [],
        });
      }
      if (row.step_index && row.content) {
        byId.get(row.id)!.plan.push({ n: row.marker ?? "", t: row.content } satisfies PlanItem);
      }
    }
    const questions = [...byId.values()];

    return NextResponse.json({
      questions,
      positions: dictionaries.positions.map((x: DictionaryRow) => ({ code: x.code, name: x.name })),
      questionTypes: dictionaries.questionTypes.map((x: DictionaryRow) => ({ code: x.code, name: x.name })),
      stages: dictionaries.stages.map((x: DictionaryRow) => ({ code: x.code, name: x.name })),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load questions from Supabase. Check env vars and database schema." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Omit<Question, "id"> & { id?: string };
    if (!payload?.q?.trim()) return badRequest("Question text is required.");

    const pool = getPgPool();
    const dictionaries = await getDictionaries();
    const position = dictionaries.positions.find((x: DictionaryRow) => x.code === payload.role);
    const questionType = dictionaries.questionTypes.find((x: DictionaryRow) => x.code === payload.type);
    const stageCode = STAGE_NAME_TO_CODE[payload.stage] ?? payload.stage;
    const stage = dictionaries.stages.find((x: DictionaryRow) => x.code === stageCode);

    if (!position || !questionType || !stage) {
      return badRequest("Invalid dictionary value for role/type/stage.");
    }

    const inserted = await pool.query<{ id: string }>(
      `
      insert into public.questions (text, position_id, question_type_id, stage_id)
      values ($1, $2, $3, $4)
      returning id
      `,
      [payload.q.trim(), position.id, questionType.id, stage.id],
    );
    const questionId = inserted.rows[0]?.id;
    if (!questionId) throw new Error("Question insert failed.");

    const steps = (payload.plan ?? []).filter((x) => x.t?.trim());
    if (steps.length) {
      for (let index = 0; index < steps.length; index += 1) {
        const step = steps[index];
        await pool.query(
          `
          insert into public.question_steps (question_id, step_index, marker, content)
          values ($1, $2, $3, $4)
          `,
          [questionId, index + 1, step.n?.trim() || null, step.t.trim()],
        );
      }
    }

    return NextResponse.json({ id: questionId }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create question." }, { status: 500 });
  }
}
