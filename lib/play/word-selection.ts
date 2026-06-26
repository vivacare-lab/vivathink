'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { Difficulty, WordPair } from '@/lib/ai';

const RECENT_LOOKBACK_DAYS = 30; // 30일 이내 중복 방지
const RECENT_LIMIT = 50; // 최근 50개까지만 추적

export async function getRecentWordPairCombinations(
  childId: string,
): Promise<Set<string>> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('recent_word_pair_usage')
    .select('word1, word2')
    .eq('child_id', childId)
    .gte('used_at', new Date(Date.now() - RECENT_LOOKBACK_DAYS * 86400000).toISOString())
    .order('used_at', { ascending: false })
    .limit(RECENT_LIMIT);

  const combinations = new Set(
    (data ?? []).map(({ word1, word2 }) => `${word1}|${word2}`),
  );

  return combinations;
}

export async function recordWordPairUsage(
  childId: string,
  word1: string,
  word2: string,
): Promise<void> {
  const supabase = createAdminClient();

  // UPSERT: 이미 있으면 시간만 업데이트, 없으면 새로 추가
  await supabase.from('recent_word_pair_usage').upsert(
    {
      child_id: childId,
      word1,
      word2,
      used_at: new Date().toISOString(),
    },
    { onConflict: 'child_id,word1,word2' },
  );
}

export async function getNewWordsAvoidingRecent(
  childId: string,
  difficulty: Difficulty,
): Promise<WordPair | null> {
  const supabase = createAdminClient();
  const recentCombinations = await getRecentWordPairCombinations(childId);

  // 재시도 로직 (최대 5회)
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data } = await supabase
      .from('ai_word_pairs')
      .select('*')
      .eq('difficulty', difficulty)
      .order('RANDOM()')
      .limit(1)
      .single();

    if (!data) return null;

    const combo = `${data.word1}|${data.word2}`;
    if (!recentCombinations.has(combo)) {
      return {
        word1: data.word1,
        word2: data.word2,
        theme: data.theme,
        difficulty,
      };
    }
  }

  // 최대 시도 실패 시 제약 없이 반환
  const { data } = await supabase
    .from('ai_word_pairs')
    .select('*')
    .eq('difficulty', difficulty)
    .order('RANDOM()')
    .limit(1)
    .single();

  return data
    ? {
        word1: data.word1,
        word2: data.word2,
        theme: data.theme,
        difficulty,
      }
    : null;
}