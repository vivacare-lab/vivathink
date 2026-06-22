'use server';

import { getChildSession } from '@/lib/child-session';
import { Difficulty, generateWordPair, scoreQuestion } from '@/lib/ai';
import { createAttempt, getRecentAttemptsByChildId } from '@/lib/play/attempts';
import { normalizeQuestion, validateQuestion } from '@/lib/play/validation';
import type { AttemptRecord, SubmitResult } from '@/lib/play/types';
import { recommendDifficulty } from '@/lib/play/difficulty';

export async function getNewWords() {
  const session = await getChildSession();

  if (!session) {
    throw new Error('로그인이 필요합니다.');
  }

  const attempts = await getRecentAttemptsByChildId(session.childId, 5);
  const difficulty = recommendDifficulty(attempts);

  return generateWordPair(difficulty);
}

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
    const feedback = await scoreQuestion({
      word1: input.word1,
      word2: input.word2,
      question,
      difficulty: input.difficulty,
    });

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

    return { ok: true, attempt };
  } catch (error) {
    console.error('submitQuestion failed:', error);

    return {
      ok: false,
      error: '채점 중 문제가 발생했어요. 다시 시도해 주세요.',
    };
  }
}

export async function getChildRecentAttempts(
  limit = 10,
): Promise<AttemptRecord[]> {
  const session = await getChildSession();

  if (!session) {
    return [];
  }

  return getRecentAttemptsByChildId(session.childId, limit);
}
