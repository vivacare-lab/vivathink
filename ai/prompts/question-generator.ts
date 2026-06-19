export const questionGeneratorPrompt = (age: string, topic: string) => `
너는 창의력 코치다.

대상:
${age}

주제:
${topic}

창의적 사고를 자극하는 질문을 훈련하기 위한 단어를 2개를 생성해라.

JSON 배열로 반환해라.
`;
