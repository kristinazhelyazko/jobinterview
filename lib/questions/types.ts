export type QuestionType = "about" | "soft" | "hard";
export type Role = "all" | "qa" | "pm" | "bsa";
export type Stage = "Phone Screen" | "HR" | "Technical" | "HM Interview" | "Final Round";

export interface PlanItem {
  n: string;
  t: string;
}

export interface Question {
  id: string;
  q: string;
  role: Role;
  type: QuestionType;
  stage: Stage;
  plan: PlanItem[];
}

export interface DictionaryItem {
  code: string;
  name: string;
}

export interface QuestionsApiResponse {
  questions: Question[];
  positions: DictionaryItem[];
  questionTypes: DictionaryItem[];
  stages: DictionaryItem[];
}
