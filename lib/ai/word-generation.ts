import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { wordPairSchema, type Difficulty, type WordPair } from './types';
import { getWordGenerationPrompt } from './prompts';

const model = google('gemini-2.5-flash');

/**
 * AI를 사용하여 새로운 단어 쌍을 생성합니다.
 * ⚠️ 각 호출마다 API 비용이 발생합니다.
 * 
 * 용도:
 * - 초기 로컬 풀 생성 (일회성)
 * - 관리자가 수동으로 단어 풀 갱신할 때
 * 
 * @param difficulty 난이도: 'easy' | 'normal' | 'hard' | 'creative' | 'abstract'
 * @returns 생성된 단어 쌍 { word1, word2, theme, difficulty }
 * 
 * @example
 * const wordPair = await generateWordPair('normal');
 * // { word1: "그림자", word2: "약속", theme: "...", difficulty: "normal" }
 */
export async function generateWordPair(
  difficulty: Difficulty = 'normal',
): Promise<WordPair> {
  const { object } = await generateObject({
    model,
    schema: wordPairSchema,
    temperature: 1,
    system:
      '당신은 어린이와 청소년의 창의력과 질문력을 키우는 비바씽크 창의력 체육관의 출제자입니다.',
    prompt: getWordGenerationPrompt(difficulty),
  });

  return object;
}