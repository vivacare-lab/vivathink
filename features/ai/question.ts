import { generateObject } from 'ai';
import { z } from 'zod';

import { geminiModel } from '@/lib/ai';

const schema = z.object({
  word1: z.string(),
  word2: z.string(),
  theme: z.string(),
});

export async function generateQuestions() {
  const result = await generateObject({
    model: geminiModel,

    schema,

    prompt: `
      초등학생이 창의적인 질문을 만들 수 있도록
      서로 어울리지 않는 단어 두 개를 생성해라.
    `,
  });

  return result.object;
}
