import 'server-only';

import { createAdminClient } from '@/lib/supabase/admin';
import type { AttemptRecord } from './types';
import type { Difficulty, Feedback } from '@/lib/ai';

const ATTEMPT_SELECT =
  'id, word1, word2, question, feedback, score, strengths, suggestion, created_at';

export async function createAttempt(input: {
  childId: string;
  parentId: string;
  word1: string;
  word2: string;
  question: string;
  feedback: Feedback;
  difficulty: Difficulty;
}): Promise<AttemptRecord | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('attempts')
    .insert({
      child_id: input.childId,
      parent_id: input.parentId,
      word1: input.word1,
      word2: input.word2,
      question: input.question,
      feedback: input.feedback.feedback,
      score: input.feedback.score,
      strengths: input.feedback.strengths,
      suggestion: input.feedback.suggestion,
      level: input.feedback.level,
      next_question_hint: input.feedback.nextQuestionHint,
      rubric: input.feedback.rubric,
      difficulty: input.difficulty,
    })
    .select(ATTEMPT_SELECT)
    .single();

  if (error || !data) {
    console.error('attempt insert failed:', error);
    return null;
  }

  return data as AttemptRecord;
}

export async function getRecentAttemptsByChildId(
  childId: string,
  limit = 10,
): Promise<AttemptRecord[]> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('attempts')
    .select(ATTEMPT_SELECT)
    .eq('child_id', childId)
    .order('created_at', { ascending: false })
    .limit(limit);

  return (data as AttemptRecord[]) ?? [];
}
