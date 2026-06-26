import 'server-only';

import { createAdminClient } from '@/lib/supabase/admin';
import type { Difficulty, WordPair } from '@/lib/ai/types';

const RECENT_LOOKBACK_DAYS = 30; // 30일 이내 중복 방지
const RECENT_LIMIT = 50; // 최근 50개까지만 추적

/**
 * 아이가 최근 30일 동안 사용한 단어 조합을 모두 가져옵니다.
 * 
 * @param childId 아이 ID
 * @returns "word1|word2" 형식의 Set
 */
export async function getRecentWordPairCombinations(
  childId: string,
): Promise<Set<string>> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('recent_word_pair_usage')
    .select('word1, word2')
    .eq('child_id', childId)
    .gte(
      'used_at',
      new Date(Date.now() - RECENT_LOOKBACK_DAYS * 86400000).toISOString(),
    )
    .order('used_at', { ascending: false })
    .limit(RECENT_LIMIT);

  if (error) {
    console.error('Failed to fetch recent word pair combinations:', error);
    return new Set();
  }

  const combinations = new Set(
    (data ?? []).map(({ word1, word2 }) => `${word1}|${word2}`),
  );

  return combinations;
}

/**
 * 아이가 새로운 단어 쌍을 사용했음을 기록합니다.
 * 같은 조합이 이미 있으면 시간만 업데이트합니다.
 * 
 * @param childId 아이 ID
 * @param word1 첫 번째 단어
 * @param word2 두 번째 단어
 */
export async function recordWordPairUsage(
  childId: string,
  word1: string,
  word2: string,
): Promise<void> {
  const supabase = createAdminClient();

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
    console.error('Failed to record word pair usage:', error);
  }
}

/**
 * 로컬 풀에서 아이가 최근에 사용하지 않은 단어 쌍을 선택합니다.
 * 
 * 알고리즘:
 * 1. 최근 사용 단어 조합 로드 (30일)
 * 2. 해당 난이도의 모든 단어 쌍 중에서 랜덤 선택
 * 3. 최대 5회 재시도하여 미사용 쌍 찾기
 * 4. 5회 실패 시 제약 없이 반환 (거의 발생하지 않음)
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

  // 재시도: 미사용 단어 쌍을 찾을 때까지 최대 5회 시도
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data, error } = await supabase
      .from('ai_word_pairs')
      .select('word1, word2, theme')
      .eq('difficulty', difficulty)
      .order('RANDOM()')
      .limit(1)
      .single();

    if (error) {
      console.error('Failed to fetch word pair:', error);
      return null;
    }

    if (!data) {
      return null;
    }

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

  // 최대 재시도 실패: 제약 없이 반환
  const { data, error } = await supabase
    .from('ai_word_pairs')
    .select('word1, word2, theme')
    .eq('difficulty', difficulty)
    .order('RANDOM()')
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    word1: data.word1,
    word2: data.word2,
    theme: data.theme,
    difficulty,
  };
}

/**
 * 특정 아이의 최근 사용 단어 조합을 모두 조회합니다.
 * (관리자 대시보드 등에서 확인할 때)
 * 
 * @param childId 아이 ID
 * @param limit 조회 개수
 * @returns 최근 사용 단어 조합 목록
 */
export async function getChildRecentWordPairs(
  childId: string,
  limit = 50,
): Promise<Array<{ word1: string; word2: string; used_at: string }>> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('recent_word_pair_usage')
    .select('word1, word2, used_at')
    .eq('child_id', childId)
    .order('used_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch child recent word pairs:', error);
    return [];
  }

  return (
    data?.map((item) => ({
      word1: item.word1,
      word2: item.word2,
      used_at: item.used_at,
    })) ?? []
  );
}