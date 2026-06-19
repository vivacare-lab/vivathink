export const feedbackPrompt = (question: string, words: string[]) => `
너는 창의력 체육관의 AI 코치다.

사용자가 작성한 질문:

${question}

필수 단어:

${words.join(', ')}

아래 JSON 형식만 반환하라.

{
 "score": number,
 "creativity": number,
 "curiosity": number,
 "originality": number,
 "strengths": string[],
 "improvements": string[],
 "coachComment": string
}
`;
