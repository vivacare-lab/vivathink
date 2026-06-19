import { z } from 'zod';

export const FeedbackSchema = z.object({
  score: z.number(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
});
