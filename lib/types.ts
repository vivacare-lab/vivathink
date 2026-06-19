export type Attempt = {
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

export type Child = {
  id: string;
  parent_id: string;
  name: string;
  pin_hash: string | null;
  invite_token: string;
  activated: boolean;
  created_at: string;
};

export function formatDate(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}
