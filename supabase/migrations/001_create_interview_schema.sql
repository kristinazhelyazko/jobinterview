create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.positions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.question_types (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  sort_order int not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.interview_stages (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  sort_order int not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  position_id uuid not null references public.positions(id) on update cascade,
  question_type_id uuid not null references public.question_types(id) on update cascade,
  stage_id uuid not null references public.interview_stages(id) on update cascade,
  source_key text unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.question_steps (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade on update cascade,
  step_index int not null check (step_index >= 1),
  marker text,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (question_id, step_index)
);

create index if not exists idx_questions_position_id on public.questions(position_id);
create index if not exists idx_questions_question_type_id on public.questions(question_type_id);
create index if not exists idx_questions_stage_id on public.questions(stage_id);
create index if not exists idx_question_steps_question_id on public.question_steps(question_id);
create index if not exists idx_questions_text_search
  on public.questions using gin (to_tsvector('simple', text));

drop trigger if exists trg_positions_updated_at on public.positions;
create trigger trg_positions_updated_at
before update on public.positions
for each row execute function public.set_updated_at();

drop trigger if exists trg_question_types_updated_at on public.question_types;
create trigger trg_question_types_updated_at
before update on public.question_types
for each row execute function public.set_updated_at();

drop trigger if exists trg_interview_stages_updated_at on public.interview_stages;
create trigger trg_interview_stages_updated_at
before update on public.interview_stages
for each row execute function public.set_updated_at();

drop trigger if exists trg_questions_updated_at on public.questions;
create trigger trg_questions_updated_at
before update on public.questions
for each row execute function public.set_updated_at();

drop trigger if exists trg_question_steps_updated_at on public.question_steps;
create trigger trg_question_steps_updated_at
before update on public.question_steps
for each row execute function public.set_updated_at();
