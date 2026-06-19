import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

const model = google('gemini-2.5-flash');
export const geminiModel = google('gemini-2.5-flash');

const wordPairSchema = z.object({
  word1: z.string(),
  word2: z.string(),
  theme: z.string(),
});

export type WordPair = z.infer<typeof wordPairSchema>;

const feedbackSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string(),
  strengths: z.string(),
  suggestion: z.string(),
});

export type Feedback = z.infer<typeof feedbackSchema>;

export async function generateWordPair(): Promise<WordPair> {
  const { object } = await generateObject({
    model,
    schema: wordPairSchema,
    temperature: 1,
    system:
      '당신은 어린이의 창의력을 키우는 비바씽크 창의력 체육관의 출제자입니다.',
    prompt: `
초등학생도 이해할 수 있는 쉬운 한국어 명사 두 개를 골라주세요.

조건:
- 서로 너무 뻔하게 관련 있지 않을 것
- 상상력을 자극할 것
- 단어는 각각 2~5글자 정도
- theme은 두 단어를 연결하는 짧은 힌트 문장

JSON 형식으로만 반환하세요.
`,
  });

  return object;
}

export async function scoreQuestion(input: {
  word1: string;
  word2: string;
  question: string;
}): Promise<Feedback> {
  const { object } = await generateObject({
    model,
    schema: feedbackSchema,
    temperature: 0.6,
    system:
      '당신은 어린이의 창의력과 사고력을 길러주는 다정한 AI 코치입니다. 모든 피드백은 쉽고 따뜻한 한국어로 작성합니다.',
    prompt: `
제시 단어:
- ${input.word1}
- ${input.word2}

아이가 만든 질문:
${input.question}

평가 기준:
1. 두 단어를 모두 사용했는가
2. 두 단어가 의미 있게 연결되었는가
3. 답이 정해져 있지 않은 열린 질문인가
4. 호기심과 상상력을 자극하는가

점수 기준:
- 두 단어가 모두 빠지면 30점 이하
- 한 단어만 있으면 50점 이하
- 두 단어가 모두 있고 열린 질문이면 70점 이상
- 상상력과 연결성이 좋으면 85점 이상

반환 필드:
- score
- feedback
- strengths
- suggestion
`,
  });

  return object;
}
