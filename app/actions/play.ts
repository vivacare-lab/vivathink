'use server';

import { getChildSession } from '@/lib/child-session';
import { scoreQuestion, type Difficulty } from '@/lib/ai';
import {
  getNewWordsAvoidingRecent,
  recordWordPairUsage,
} from '@/lib/play/word-selection';
import { createAttempt, getRecentAttemptsByChildId } from '@/lib/play/attempts';
import { normalizeQuestion, validateQuestion } from '@/lib/play/validation';
import type { AttemptRecord, SubmitResult } from '@/lib/play/types';
import { recommendDifficulty } from '@/lib/play/difficulty';

/**
 * 새로운 단어 쌍을 가져옵니다.
 * 
 * ✨ 개선된 점:
 * - DB의 로컬 풀에서만 선택 (API 비용 없음)
 * - 아이가 최근 30일에 사용한 단어 제외
 * - 난이도는 최근 시도 성적 기반으로 추천
 * 
 * @returns 선택된 단어 쌍 { word1, word2, theme, difficulty }
 */
export async function getNewWords() {
  const session = await getChildSession();

  if (!session) {
    throw new Error('로그인이 필요합니다.');
  }

  // 1. 최근 시도 조회
  const attempts = await getRecentAttemptsByChildId(session.childId, 5);

  // 2. 난이도 추천
  const difficulty = recommendDifficulty(attempts);

  // 3. ✨ 로컬 풀에서 중복 제외하고 선택 (API 호출 없음!)
  const wordPair = await getNewWordsAvoidingRecent(
    session.childId,
    difficulty,
  );

  if (!wordPair) {
    throw new Error(
      '사용 가능한 단어가 없습니다. 부모님께 단어 추가 요청을 하세요.',
    );
  }

  // 4. ✨ 사용 기록 저장 (다음 번에 중복 방지용)
  await recordWordPairUsage(
    session.childId,
    wordPair.word1,
    wordPair.word2,
  );

  return wordPair;
}

/**
 * 아이의 질문을 제출하고 AI 코치의 피드백을 받습니다.
 * 
 * 흐름:
 * 1. 로그인 확인
 * 2. 질문 유효성 검사
 * 3. AI 코치가 채점
 * 4. 기록 저장
 * 5. 사용한 단어 조합 기록 (중복 방지)
 * 
 * @param input 제출할 답변
 * @returns { ok: true, attempt } 또는 { ok: false, error }
 */
export async function submitQuestion(input: {
  word1: string;
  word2: string;
  question: string;
  difficulty: Difficulty;
}): Promise<SubmitResult> {
  const session = await getChildSession();

  if (!session) {
    return { ok: false, error: '로그인이 필요합니다.' };
  }

  const question = normalizeQuestion(input.question);
  const validationError = validateQuestion(question);

  if (validationError) {
    return { ok: false, error: validationError };
  }

  try {
    // 1. AI 코치가 채점
    const feedback = await scoreQuestion({
      word1: input.word1,
      word2: input.word2,
      question,
      difficulty: input.difficulty,
    });

    // 2. 기록 저장
    const attempt = await createAttempt({
      childId: session.childId,
      parentId: session.parentId,
      word1: input.word1,
      word2: input.word2,
      question,
      feedback,
      difficulty: input.difficulty,
    });

    if (!attempt) {
      return {
        ok: false,
        error: '기록 저장에 실패했어요. 다시 시도해 주세요.',
      };
    }

    // 3. ✨ 사용한 단어 조합 기록 (자동으로 중복 방지)
    await recordWordPairUsage(
      session.childId,
      input.word1,
      input.word2,
    );

    return { ok: true, attempt };
  } catch (error) {
    console.error('submitQuestion failed:', error);

    return {
      ok: false,
      error: '채점 중 문제가 발생했어요. 다시 시도해 주세요.',
    };
  }
}

/**
 * 아이의 최근 시도 기록을 가져옵니다.
 * 
 * @param limit 조회 개수 (기본값: 10)
 * @returns 최근 기록 목록
 */
export async function getChildRecentAttempts(
  limit = 10,
): Promise<AttemptRecord[]> {
  const session = await getChildSession();

  if (!session) {
    return [];
  }

  return getRecentAttemptsByChildId(session.childId, limit);
}