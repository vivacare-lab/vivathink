'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { Difficulty, WordPair } from '@/lib/word-pairs/types';

const RECENT_LOOKBACK_DAYS = 30; // 30일 이내 중복 방지
const RECENT_LIMIT = 50; // 최근 50개까지만 추적
const CANDIDATE_LIMIT = 100;

function pairKey(word1: string, word2: string) {
  return [word1, word2].sort().join('|');
}

function pickRandom<T>(items: T[]): T | null {
  if (items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
}

export async function getRecentWordPairCombinations(
  childId: string,
): Promise<Set<string>> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('recent_word_pair_usage')
    .select('word1, word2')
    .eq('child_id', childId)
    .gte('used_at', new Date(Date.now() - RECENT_LOOKBACK_DAYS * 86400000).toISOString())
    .order('used_at', { ascending: false })
    .limit(RECENT_LIMIT);

  if (error) {
    console.error('getRecentWordPairCombinations failed:', error);
    return new Set();
  }

  const combinations = new Set(
    (data ?? []).map(({ word1, word2 }) => pairKey(word1, word2)),
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
  const { error } = await supabase.from('recent_word_pair_usage').upsert(
    {
      child_id: childId,
      word1,
      word2,
      used_at: new Date().toISOString(),
    },
    { onConflict: 'child_id,word1,word2' },
  );

  if (error) {
    console.error('recordWordPairUsage failed:', error);
  }
}

/**
 * 로컬 풀에서 아이가 최근에 사용하지 않은 단어 쌍을 선택합니다.
 * 
 * 알고리즘:
 * // 추후 기재
 * 
 * @param childId 아이 ID
 * @param difficulty 난이도
 * @returns 선택된 단어 쌍 또는 null (풀이 비어있을 경우)
 */
export async function getNewWordsAvoidingRecent(
  childId: string,
  difficulty: Difficulty,
): Promise<WordPair | null> {
  const supabase = createAdminClient();
  const recentCombinations = await getRecentWordPairCombinations(childId);

  const { data, error } = await supabase
    .from('ai_word_pairs')
    .select('word1, word2, theme, difficulty, category1, category2, tags')
    .eq('difficulty', difficulty)
    .limit(CANDIDATE_LIMIT);

  if (error) {
    console.error('getNewWordsAvoidingRecent failed:', error);
    return null;
  }

  const candidates = (data ?? []).filter(
    (pair) => !recentCombinations.has(pairKey(pair.word1, pair.word2)),
  );

  const picked = pickRandom(candidates.length > 0 ? candidates : data ?? []);

  if (!picked) {
    console.warn('No word pairs found for difficulty:', difficulty);
    return null;
  }

  return data
    ? {
      word1: picked.word1,
      word2: picked.word2,
      theme: picked.theme,
      difficulty: picked.difficulty as Difficulty,
      category1: picked.category1,
      category2: picked.category2,
      tags: picked.tags,
    }
    : null;
}