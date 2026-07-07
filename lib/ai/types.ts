import { z } from 'zod';

export const rubricSchema = z.object({
  connection: z.number().min(0).max(25),
  originality: z.number().min(0).max(25),
  clarity: z.number().min(0).max(25),
  depth: z.number().min(0).max(25),
});

export type AttemptRubric = z.infer<typeof rubricSchema>;

export const feedbackSchema = z.object({
  score: z.number().min(0).max(100),
  level: z.enum(['emerging', 'developing', 'strong', 'excellent']),
  feedback: z.string(),
  strengths: z.string(),
  suggestion: z.string(),
  nextQuestionHint: z.string(),
  rubric: rubricSchema,
});

export type Feedback = z.infer<typeof feedbackSchema> & { score: number };