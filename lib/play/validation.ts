export function normalizeQuestion(question: string) {
  return question.trim();
}

export function validateQuestion(question: string): string | null {
  if (question.length < 10) {
    return '질문을 조금 더 길게 적어볼까요?';
  }

  return null;
}
