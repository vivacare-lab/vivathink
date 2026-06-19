export type ChildSummary = {
  id: string;
  name: string;
  created_at: string | null;
  totalAttempts: number;
  averageScore: number | null;
  latestAttemptAt: string | null;
};

export type ParentAttempt = {
  id: string;
  child_id: string;
  parent_id: string;
  word1: string;
  word2: string;
  question: string;
  feedback: string | null;
  score: number | null;
  strengths: string | null;
  suggestion: string | null;
  created_at: string;
};

export type ScoreSummary = {
  totalAttempts: number;
  averageScore: number | null;
  highestScore: number | null;
  latestScore: number | null;
  recentScores: {
    id: string;
    score: number | null;
    created_at: string;
  }[];
};
