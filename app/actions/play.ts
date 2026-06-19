'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { getChildSession } from '@/lib/child-session';
import {
  generateWordPair,
  scoreQuestion,
  type WordPair,
  type Feedback,
} from '@/lib/ai';

export async function getNewWords(): Promise<WordPair> {
  // Require a child session to prevent abuse.
  const session = await getChildSession();
  if (!session) throw new Error('로그인이 필요합니다.');
  return generateWordPair();
}

export type SubmitResult =
  | { ok: true; attempt: AttemptRecord }
  | { ok: false; error: string };

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

export async function submitQuestion(input: {
  word1: string;
  word2: string;
  question: string;
}): Promise<SubmitResult> {
  const session = await getChildSession();
  if (!session) return { ok: false, error: '로그인이 필요합니다.' };

  const question = input.question.trim();
  if (question.length < 5) {
    return { ok: false, error: '질문을 조금 더 길게 적어볼까요?' };
  }

  let feedback: Feedback;
  try {
    feedback = await scoreQuestion({
      word1: input.word1,
      word2: input.word2,
      question,
    });
  } catch (error) {
    console.error('scoreQuestion failed:', error);

    return {
      ok: false,
      error: '채점 중 문제가 발생했어요. 다시 시도해 주세요.',
    };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('attempts')
    .insert({
      child_id: session.childId,
      parent_id: session.parentId,
      word1: input.word1,
      word2: input.word2,
      question,
      feedback: feedback.feedback,
      score: feedback.score,
      strengths: feedback.strengths,
      suggestion: feedback.suggestion,
    })
    .select(
      'id, word1, word2, question, feedback, score, strengths, suggestion, created_at',
    )
    .single();

  if (error || !data) {
    console.error('attempt insert failed:', error);

    return { ok: false, error: '기록 저장에 실패했어요. 다시 시도해 주세요.' };
  }

  return { ok: true, attempt: data as AttemptRecord };
}

export async function getChildRecentAttempts(
  limit = 10,
): Promise<AttemptRecord[]> {
  const session = await getChildSession();
  if (!session) return [];
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('attempts')
    .select(
      'id, word1, word2, question, feedback, score, strengths, suggestion, created_at',
    )
    .eq('child_id', session.childId)
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data as AttemptRecord[]) ?? [];
}
