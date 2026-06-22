import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

const model = google('gemini-2.5-flash');
export const geminiModel = model;

export const difficultySchema = z.enum([
  'easy',
  'normal',
  'hard',
  'creative',
  'abstract',
]);

export type Difficulty = z.infer<typeof difficultySchema>;

const wordPairSchema = z.object({
  word1: z.string().min(1),
  word2: z.string().min(1),
  theme: z.string().min(1),
  difficulty: difficultySchema,
});

export type WordPair = z.infer<typeof wordPairSchema>;

const rubricSchema = z.object({
  connection: z.number().min(0).max(25),
  originality: z.number().min(0).max(25),
  clarity: z.number().min(0).max(25),
  depth: z.number().min(0).max(25),
});

const feedbackSchema = z.object({
  score: z.number().min(0).max(100),
  level: z.enum(['emerging', 'developing', 'strong', 'excellent']),
  feedback: z.string(),
  strengths: z.string(),
  suggestion: z.string(),
  nextQuestionHint: z.string(),
  rubric: rubricSchema,
});

export type Feedback = z.infer<typeof feedbackSchema> & { score: number };

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function calculateScore(rubric: z.infer<typeof rubricSchema>) {
  return clampScore(
    rubric.connection + rubric.originality + rubric.clarity + rubric.depth,
  );
}

function getLevel(score: number): Feedback['level'] {
  if (score < 50) return 'emerging';
  if (score < 70) return 'developing';
  if (score < 85) return 'strong';
  return 'excellent';
}

function getDifficultyGuide(difficulty: Difficulty) {
  switch (difficulty) {
    case 'easy':
      return '구체적이고 일상적인 쉬운 명사. 예: 사과, 학교, 친구, 고양이';
    case 'normal':
      return '일상적이지만 생각이 필요한 명사. 예: 약속, 규칙, 선택, 변화';
    case 'hard':
      return '개념적 사고가 필요한 명사. 예: 책임, 공정, 기억, 습관';
    case 'creative':
      return '상상력과 비유를 자극하는 명사. 예: 그림자, 비밀, 목소리, 시간';
    case 'abstract':
      return '철학적이고 추상적인 명사. 예: 자유, 관계, 가치, 가능성';
  }
}

export async function generateWordPair(
  difficulty: Difficulty = 'normal',
): Promise<WordPair> {
  const { object } = await generateObject({
    model,
    schema: wordPairSchema,
    temperature: 1,
    system:
      '당신은 어린이와 청소년의 창의력과 질문력을 키우는 비바씽크 창의력 체육관의 출제자입니다.',
    prompt: `
난이도: ${difficulty}
난이도 설명: ${getDifficultyGuide(difficulty)}

한국어 명사 두 개를 골라주세요.

조건:
- 두 단어가 너무 뻔하게 연결되지 않을 것
- 질문 만들기를 자극할 것
- 단어는 각각 2~5글자 정도
- 너무 유아적이거나 지나치게 쉬운 단어는 피할 것
- difficulty는 반드시 "${difficulty}"로 반환할 것
- theme은 두 단어를 연결하는 짧은 힌트 문장

반환 예시:
{
  "word1": "그림자",
  "word2": "약속",
  "theme": "보이지 않는 것이 마음을 움직일 때",
  "difficulty": "${difficulty}"
}
`,
  });

  return object;
}

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
    system:
      '당신은 어린이와 청소년의 창의력, 질문력, 사고력을 길러주는 다정하지만 정확한 AI 코치입니다. 반복적인 칭찬을 피하고, 아이의 실제 질문 내용에 근거해 구체적으로 피드백합니다.',
    prompt: `
제시 단어:
- ${input.word1}
- ${input.word2}

난이도:
${input.difficulty ?? 'normal'}

아이가 만든 질문:
${input.question}

평가 기준:
1. connection: 두 단어를 모두 사용하고 의미 있게 연결했는가? 0~25점
2. originality: 뻔하지 않고 자기만의 관점이 있는가? 0~25점
3. clarity: 질문이 자연스럽고 이해하기 쉬운가? 0~25점
4. depth: 답이 하나로 정해지지 않고 더 깊은 생각으로 이어지는가? 0~25점

점수 규칙:
- score는 rubric 네 항목의 합계와 일치해야 합니다.
- 두 단어가 모두 빠지면 connection은 5점 이하, score는 30점 이하입니다.
- 한 단어만 사용하면 connection은 12점 이하, score는 55점 이하입니다.
- 두 단어를 모두 사용했지만 단순 설명형이면 score는 60~75점입니다.
- 두 단어를 창의적으로 연결하고 열린 질문이면 score는 80점 이상입니다.
- 아주 독창적이고 깊이 있는 질문만 90점 이상입니다.

level 기준:
- 0~49: emerging
- 50~69: developing
- 70~84: strong
- 85~100: excellent

피드백 작성 규칙:
- "참 잘했어요", "좋은 질문이에요" 같은 일반적 표현을 반복하지 마세요.
- 아이가 쓴 질문의 구체적인 부분을 언급하세요.
- feedback은 1~2문장
- strengths는 잘한 점 1문장
- suggestion은 다음에 개선할 점 1문장
- nextQuestionHint는 아이가 이어서 만들 수 있는 새 질문 힌트 1개
`,
  });
  const score = calculateScore(object.rubric);

  return {
    ...object,
    score,
    level: getLevel(score),
  };
}
