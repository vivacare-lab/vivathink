import { generateObject } from 'ai';
import { z } from 'zod';

import { geminiModel } from '@/lib/ai';

const schema = z.object({
  score: z.number(),

  strengths: z.array(z.string()),

  improvements: z.array(z.string()),

  coachComment: z.string(),
});

export async function creativityFeedback(question: string, words: string[]) {
  const result = await generateObject({
    model: geminiModel,

    schema,

    prompt: `
      단어:
      ${words.join(',')}

      질문:
      ${question}

      창의력을 평가해라.
    `,
  });

  return result.object;
}
