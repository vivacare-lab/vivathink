import type { Difficulty } from '@/lib/ai';
import type { AttemptRecord } from '@/lib/play/types';

const difficultyOrder: Difficulty[] = [
  'easy',
  'normal',
  'hard',
  'creative',
  'abstract',
];

function moveDifficulty(
  current: Difficulty,
  direction: 'up' | 'down' | 'same',
): Difficulty {
  const index = difficultyOrder.indexOf(current);

  if (direction === 'up') {
    return difficultyOrder[Math.min(index + 1, difficultyOrder.length - 1)];
  }

  if (direction === 'down') {
    return difficultyOrder[Math.max(index - 1, 0)];
  }

  return current;
}

export function recommendDifficulty(
  attempts: AttemptRecord[],
  fallback: Difficulty = 'normal',
): Difficulty {
  const recent = attempts.slice(0, 5);

  if (recent.length < 3) {
    return fallback;
  }

  const scores = recent
    .map((attempt) => attempt.score)
    .filter((score): score is number => typeof score === 'number');

  if (scores.length === 0) {
    return fallback;
  }

  const averageScore =
    scores.reduce((sum, score) => sum + score, 0) / scores.length;

  const averageDepth =
    recent.reduce((sum, attempt) => sum + (attempt.rubric?.depth ?? 0), 0) /
    recent.length;

  const averageQuestionLength =
    recent.reduce((sum, attempt) => sum + attempt.question.length, 0) /
    recent.length;

  const currentDifficulty =
    (recent[0]?.difficulty as Difficulty | null) ?? fallback;

  if (averageScore >= 85 && averageDepth >= 18 && averageQuestionLength >= 20) {
    return moveDifficulty(currentDifficulty, 'up');
  }

  if (averageScore < 60 || averageQuestionLength < 10) {
    return moveDifficulty(currentDifficulty, 'down');
  }

  return currentDifficulty;
}
