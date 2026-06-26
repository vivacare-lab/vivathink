/**
 * Public API for AI functionality
 * 
 * ✨ 개선 사항:
 * - 관심사 분리: 단어 생성, 채점, 프롬프트가 분리됨
 * - 유지보수성: 각 파일이 단일 책임을 가짐
 * - 하위호환성: 기존 import는 그대로 작동
 * 
 * 구조:
 * lib/ai/
 * ├─ types.ts          (타입/스키마)
 * ├─ prompts.ts        (프롬프트)
 * ├─ word-generation.ts (단어 생성)
 * └─ scoring.ts        (채점)
 * 
 * 이 파일은 공개 API만 노출합니다.
 */

// ============================================================================
// 타입 및 스키마
// ============================================================================

export {
  difficultySchema,
  wordPairSchema,
  feedbackSchema,
  rubricSchema,
  type Difficulty,
  type WordPair,
  type AttemptRubric,
  type Feedback,
} from './ai/types';

// ============================================================================
// AI 함수 (단어 생성)
// ============================================================================

/**
 * AI를 사용하여 새로운 단어 쌍을 생성합니다.
 * 
 * ⚠️ 각 호출마다 API 비용이 발생합니다.
 * 
 * 권장 용도:
 * - 초기 로컬 풀 생성 (일회성)
 * - 관리자가 수동으로 단어 풀을 갱신할 때
 * 
 * ❌ 피할 것:
 * - 매번 새로고침할 때 (비용 증가)
 * - 로드 중에 호출 (시간 지연)
 * 
 * @example
 * const wordPair = await generateWordPair('normal');
 * // { word1: "그림자", word2: "약속", theme: "...", difficulty: "normal" }
 * 
 * @see getNewWordsAvoidingRecent (로컬 풀에서 선택하는 것이 권장)
 */
export { generateWordPair } from './ai/word-generation';

// ============================================================================
// AI 함수 (채점)
// ============================================================================

/**
 * AI 코치가 아이의 질문을 채점하고 피드백을 제공합니다.
 * 
 * 평가 항목 (4개, 각 0~25점):
 * - connection: 두 단어를 모두 사용했는가?
 * - originality: 뻔하지 않은가?
 * - clarity: 자연스럽고 이해하기 쉬운가?
 * - depth: 답이 하나로 정해지지 않은가?
 * 
 * @example
 * const feedback = await scoreQuestion({
 *   word1: "그림자",
 *   word2: "약속",
 *   question: "그림자처럼 보이지는 않지만 꼭 우리 곁에 있는 약속은?",
 *   difficulty: "normal"
 * });
 * 
 * // 반환:
 * // {
 * //   score: 78,
 * //   level: "strong",
 * //   feedback: "...",
 * //   strengths: "...",
 * //   suggestion: "...",
 * //   nextQuestionHint: "...",
 * //   rubric: { connection: 20, originality: 18, clarity: 20, depth: 20 }
 * // }
 */
export { scoreQuestion } from './ai/scoring';

// ============================================================================
// 유틸리티 함수 (프롬프트)
// ============================================================================

/**
 * 난이도별 설명을 반환합니다.
 * (프롬프트 생성 시 사용)
 */
export { getDifficultyGuide } from './ai/prompts';

/**
 * 단어 생성 프롬프트를 반환합니다.
 * (커스텀 프롬프트가 필요할 때)
 */
export { getWordGenerationPrompt } from './ai/prompts';

/**
 * 채점 시스템 프롬프트를 반환합니다.
 * (커스텀 프롬프트가 필요할 때)
 */
export { getScoringSystemPrompt } from './ai/prompts';

/**
 * 채점 프롬프트를 반환합니다.
 * (커스텀 프롬프트가 필요할 때)
 */
export { getScoringPrompt } from './ai/prompts';