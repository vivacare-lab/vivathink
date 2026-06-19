export type AttemptRecord = {
  id: string;
  word1: string;
  word2: string;
  question: string;
  feedback: string | null;
  score: number | null;
  strengths: string | null;
  suggestion: string | null;
  created_at: string;
  level: string | null;
  next_question_hint: string | null;
  rubric: Record<string, number> | null;
  difficulty: string | null;
};

export type SubmitResult =
  | { ok: true; attempt: AttemptRecord }
  | { ok: false; error: string };
