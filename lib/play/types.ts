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
};

export type SubmitResult =
  | { ok: true; attempt: AttemptRecord }
  | { ok: false; error: string };
