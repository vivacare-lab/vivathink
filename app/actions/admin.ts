'use server';

import { generateWordPair } from '@/lib/ai/word-generation';
import type { Difficulty, WordPair } from '@/lib/ai/types';
import { createAdminClient } from '@/lib/supabase/admin';
import { getParentSession } from '@/lib/auth/parent';

type AdminResult<T> = { ok: true; data: T } | { ok: false; error: string };

/**
 * 관리자/부모만 호출 가능한 함수입니다.
 * 로그인한 사용자가 부모인지 확인합니다.
 */
async function requireParentSession() {
  const session = await getParentSession();
  if (!session) {
    throw new Error('부모 권한이 필요합니다.');
  }
  return session;
}

/**
 * AI를 사용하여 새로운 단어 쌍을 생성하고 DB에 저장합니다.
 * 
 * ✨ 용도:
 * - 초기 로컬 풀 생성 (대량)
 * - 부모가 단어 풀을 주기적으로 갱신할 때 (수동)
 * 
 * 🔐 부모만 호출 가능
 * 
 * @param difficulty 난이도
 * @returns { ok: true, data: WordPair } 또는 { ok: false, error }
 * 
 * @example
 * const result = await generateAndSaveAiWordPair('normal');
 * if (result.ok) {
 *   console.log('✨ 새 단어:', result.data);
 * }
 */
export async function generateAndSaveAiWordPair(
  difficulty: Difficulty,
): Promise<AdminResult<WordPair>> {
  try {
    // 1. 부모 권한 확인
    await requireParentSession();

    // 2. AI로 새 단어 쌍 생성 (⚠️ API 비용 발생)
    const wordPair = await generateWordPair(difficulty);

    // 3. DB에 저장 (UNIQUE constraint 확인)
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('ai_word_pairs')
      .insert({
        word1: wordPair.word1,
        word2: wordPair.word2,
        theme: wordPair.theme,
        difficulty: wordPair.difficulty,
        source: 'ai',
      })
      .select('word1, word2, theme, difficulty')
      .single();

    if (error) {
      // 중복 오류 처리
      if (error.code === '23505') {
        return {
          ok: false,
          error: `이미 존재하는 단어 조합입니다: "${wordPair.word1}" & "${wordPair.word2}"`,
        };
      }
      throw error;
    }

    if (!data) {
      throw new Error('데이터 저장에 실패했습니다.');
    }

    return {
      ok: true,
      data: {
        word1: data.word1,
        word2: data.word2,
        theme: data.theme,
        difficulty: data.difficulty,
      },
    };
  } catch (error) {
    console.error('generateAndSaveAiWordPair failed:', error);

    if (error instanceof Error) {
      return { ok: false, error: error.message };
    }

    return {
      ok: false,
      error: '단어 생성에 실패했습니다. 다시 시도해주세요.',
    };
  }
}

/**
 * 여러 난이도에 대해 대량으로 AI 단어를 생성하고 저장합니다.
 * 
 * ✨ 용도: 초기 로컬 풀 설정 (대량 생성)
 * 
 * 🔐 부모만 호출 가능
 * 
 * @param difficulties 난이도 배열
 * @param countPerDifficulty 난이도당 생성 개수
 * @returns { ok: true, data: 생성된 단어 쌍 배열 } 또는 { ok: false, error }
 * 
 * @example
 * const result = await batchGenerateAiWordPairs(
 *   ['easy', 'normal', 'hard'],
 *   5 // 각 난이도당 5개씩 = 총 15개
 * );
 */
export async function batchGenerateAiWordPairs(
  difficulties: Difficulty[],
  countPerDifficulty: number,
): Promise<AdminResult<WordPair[]>> {
  try {
    // 1. 부모 권한 확인
    await requireParentSession();

    const allWordPairs: WordPair[] = [];
    const errors: string[] = [];

    // 2. 난이도별로 순차 생성
    for (const difficulty of difficulties) {
      for (let i = 0; i < countPerDifficulty; i++) {
        try {
          const result = await generateAndSaveAiWordPair(difficulty);
          if (result.ok) {
            allWordPairs.push(result.data);
          } else {
            errors.push(`[${difficulty}] ${result.error}`);
          }
          // API 레이트 제한 회피
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
          errors.push(
            `[${difficulty}] ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
          );
        }
      }
    }

    if (allWordPairs.length === 0) {
      return {
        ok: false,
        error: `생성 실패: ${errors.join(', ')}`,
      };
    }

    // 일부 성공, 일부 실패한 경우에도 성공으로 반환
    if (errors.length > 0) {
      console.warn('Partial batch generation succeeded:', errors);
    }

    return {
      ok: true,
      data: allWordPairs,
    };
  } catch (error) {
    console.error('batchGenerateAiWordPairs failed:', error);
    return {
      ok: false,
      error: '대량 생성에 실패했습니다. 다시 시도해주세요.',
    };
  }
}

/**
 * 특정 난이도의 AI 단어 쌍 개수를 조회합니다.
 * (관리자가 풀 상태를 확인할 때)
 * 
 * 🔐 부모만 호출 가능
 * 
 * @param difficulty 난이도
 * @returns { ok: true, data: 개수 } 또는 { ok: false, error }
 */
export async function getAiWordPairCount(
  difficulty: Difficulty,
): Promise<AdminResult<number>> {
  try {
    await requireParentSession();

    const supabase = createAdminClient();
    const { count, error } = await supabase
      .from('ai_word_pairs')
      .select('*', { count: 'exact', head: true })
      .eq('difficulty', difficulty);

    if (error) {
      throw error;
    }

    return { ok: true, data: count ?? 0 };
  } catch (error) {
    console.error('getAiWordPairCount failed:', error);
    return {
      ok: false,
      error: '조회에 실패했습니다.',
    };
  }
}

/**
 * 모든 난이도별 단어 풀 상태를 조회합니다.
 * 
 * 🔐 부모만 호출 가능
 * 
 * @returns { ok: true, data: { difficulty: count } } 또는 { ok: false, error }
 * 
 * @example
 * const result = await getWordPoolStatus();
 * // { ok: true, data: { easy: 100, normal: 150, hard: 140, ... } }
 */
export async function getWordPoolStatus(): Promise<
  AdminResult<Record<Difficulty, number>>
> {
  try {
    await requireParentSession();

    const difficulties: Difficulty[] = [
      'easy',
      'normal',
      'hard',
      'creative',
      'abstract',
    ];

    const status: Record<Difficulty, number> = {} as Record<Difficulty, number>;

    for (const difficulty of difficulties) {
      const result = await getAiWordPairCount(difficulty);
      status[difficulty] = result.ok ? result.data : 0;
    }

    return { ok: true, data: status };
  } catch (error) {
    console.error('getWordPoolStatus failed:', error);
    return {
      ok: false,
      error: '풀 상태 조회에 실패했습니다.',
    };
  }
}