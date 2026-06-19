import 'server-only';

import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import type { ChildSummary, ParentAttempt, ScoreSummary } from './types';

const ATTEMPT_SELECT =
  'id, child_id, parent_id, word1, word2, question, feedback, score, strengths, suggestion, created_at';

export async function getParentChildren(
  parentId: string,
): Promise<ChildSummary[]> {
  const supabase = createAdminClient();

  const { data: children, error } = await supabase
    .from('children')
    .select('id, name, created_at')
    .eq('parent_id', parentId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('getParentChildren failed:', error);
    return [];
  }

  const result: ChildSummary[] = [];

  for (const child of children ?? []) {
    const { data: attempts } = await supabase
      .from('attempts')
      .select('score, created_at')
      .eq('child_id', child.id)
      .eq('parent_id', parentId)
      .order('created_at', { ascending: false });

    const scores = (attempts ?? [])
      .map((item) => item.score)
      .filter((score): score is number => typeof score === 'number');

    result.push({
      id: child.id,
      name: child.name,
      created_at: child.created_at,
      totalAttempts: attempts?.length ?? 0,
      averageScore:
        scores.length > 0
          ? Math.round(
              scores.reduce((sum, score) => sum + score, 0) / scores.length,
            )
          : null,
      latestAttemptAt: attempts?.[0]?.created_at ?? null,
    });
  }

  return result;
}

export async function getChildOrThrow(childId: string, parentId: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('children')
    .select('id, name, created_at')
    .eq('id', childId)
    .eq('parent_id', parentId)
    .single();

  if (error || !data) {
    notFound();
  }

  return data;
}

export async function getChildAttempts(
  childId: string,
  parentId: string,
  limit = 20,
): Promise<ParentAttempt[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('attempts')
    .select(ATTEMPT_SELECT)
    .eq('child_id', childId)
    .eq('parent_id', parentId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('getChildAttempts failed:', error);
    return [];
  }

  return (data ?? []) as ParentAttempt[];
}

export async function getChildScoreSummary(
  childId: string,
  parentId: string,
): Promise<ScoreSummary> {
  const attempts = await getChildAttempts(childId, parentId, 100);

  const scores = attempts
    .map((attempt) => attempt.score)
    .filter((score): score is number => typeof score === 'number');

  return {
    totalAttempts: attempts.length,
    averageScore:
      scores.length > 0
        ? Math.round(
            scores.reduce((sum, score) => sum + score, 0) / scores.length,
          )
        : null,
    highestScore: scores.length > 0 ? Math.max(...scores) : null,
    latestScore: attempts[0]?.score ?? null,
    recentScores: attempts.slice(0, 10).map((attempt) => ({
      id: attempt.id,
      score: attempt.score,
      created_at: attempt.created_at,
    })),
  };
}
