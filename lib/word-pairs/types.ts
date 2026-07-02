import { z } from 'zod';

export const difficultySchema = z.enum([
    'easy',
    'normal',
    'hard',
    'creative',
    'abstract',
]);

export type Difficulty = z.infer<typeof difficultySchema>;

export const wordCategorySchema = z.enum([
    '일상',
    '경제',
    '사회',
    '역사',
    '자연',
    '과학',
    '수학',
    '기술',
    '예술',
    '음악',
    '문학',
    '심리',
    '철학',
    '언어',
    '교통',
    '음식',
    '동물',
    '식물',
    '우주',
    '스포츠',
    '직업',
    '건축',
    '문화',
    '환경',
    '도구',
    '놀이',
    '감정',
    '신체',
    '날씨',
    '계절',
    '가정',
    '공간'
]);

export type WordCategory = z.infer<typeof wordCategorySchema>;

// export const thinkingTagSchema = z.enum([
//     '비교',
//     '상상',
//     '추론',
//     '원인',
//     '결과',
//     '관찰',
//     '문제해결',
//     '창의',
//     '감정',
//     '관계',
//     '선택',
//     '미래',
//     '과거',
//     '패턴',
//     '연결',
// ]);

// export type ThinkingTag = z.infer<typeof thinkingTagSchema>;
export const tagSchema = z.string().trim().min(1).max(30);

export const wordPairSchema = z.object({
    word1: z.string().min(1).max(30),
    word2: z.string().min(1).max(30),
    theme: z.string().min(1).max(100),
    difficulty: difficultySchema,
    category1: wordCategorySchema,
    category2: wordCategorySchema,
    tags: z.array(tagSchema)
        .min(2)
        .max(8),
});

export type WordPair = z.infer<typeof wordPairSchema>;

export type WordPairRow = WordPair & {
    id: string;
    pair_key: string;
    created_at: string;
};