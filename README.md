# Interview Zoom (Supabase-backed)

The app now stores all data in Supabase tables:
- `positions`
- `question_types`
- `interview_stages`
- `questions`
- `question_steps`

## 1) Install dependencies

```bash
npm install
```

## 2) Configure environment variables

Copy `.env.example` to `.env.local` and set your project values:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## 3) Apply database migrations in Supabase

Run SQL files in order from `supabase/migrations`:
1. `001_create_interview_schema.sql`
2. `002_seed_dictionaries.sql`

## 4) Migrate existing local questions

After migrations and env setup:

```bash
npm run migrate:default-questions
```

This imports `app/data/questions.ts` into `questions` and `question_steps`.

## 5) Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build check

```bash
npm run build
```
