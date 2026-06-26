import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import {
  feedbackSchema,
  rubricSchema,
  type Difficulty,
  type Feedback,
} from './types';
import { getScoringSystemPrompt, getScoringPrompt } from './prompts';

const model = google('gemini-2.5-flash');

/**
 * 점수를 0~100 범위로 제한합니다.
 */
function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * 루브릭의 4개 항목을 합산하여 최종 점수를 계산합니다.
 */
function calculateScore(rubric: z.infer<typeof rubricSchema>): number {
  return clampScore(
    rubric.connection + rubric.originality + rubric.clarity + rubric.depth,
  );
}

/**
 * 점수에 따라 레벨을 결정합니다.
 */
function getLevel(score: number): Feedback['level'] {
  if (score < 50) return 'emerging';
  if (score < 70) return 'developing';
  if (score < 85) return 'strong';
  return 'excellent';
}

/**
 * AI 코치가 아이의 질문을 채점하고 피드백을 제공합니다.
 * 
 * 평가 항목:
 * - connection (0~25점): 두 단어를 모두 사용했는가?
 * - originality (0~25점): 뻔하지 않은가?
 * - clarity (0~25점): 자연스럽고 이해하기 쉬운가?
 * - depth (0~25점): 열린 질문인가?
 * 
 * @param input 아이의 답변 정보
 * @returns 점수, 레벨, 상세 피드백
 * 
 * @example
 * const feedback = await scoreQuestion({
 *   word1: "그림자",
 *   word2: "약속",
 *   question: "그림자처럼 보이지는 않지만 꼭 우리 곁에 있는 약속은?",
 *   difficulty: "normal"
 * });
 */
export async function scoreQuestion(input: {
  word1: string;
  word2: string;
  question: string;
  difficulty?: Difficulty;
}): Promise<Feedback> {
  const { object } = await generateObject({
    model,
    schema: feedbackSchema,
    temperature: 0.8,
    system: getScoringSystemPrompt(),
    prompt: getScoringPrompt({
      word1: input.word1,
      word2: input.word2,
      question: input.question,
      difficulty: input.difficulty ?? 'normal',
    }),
  });

  const score = calculateScore(object.rubric);

  return {
    ...object,
    score,
    level: getLevel(score),
  };
}