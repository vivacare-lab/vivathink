// export interface TrainingRecord {
//   id: string;
//   /** 제시되었던 두 개의 질문 단어 */
//   words: [string, string];
//   /** 사용자가 작성한 질문 */
//   question: string;
//   /** AI 점수 (0-100) */
//   score: number;
//   /** AI 피드백 내용 */
//   coachComment: string;
//   /** 훈련 일시 (ISO 문자열) */
//   createdAt: string;
// }

// /**
//  * 임시 훈련 기록 데이터.
//  * TODO: 추후 데이터베이스 연동으로 교체 예정.
//  */
// export const trainingRecords: TrainingRecord[] = [
//   {
//     id: '1',
//     words: ['환경', '기술'],
//     question: '환경 오염을 줄이기 위해 어떤 기술이 가장 효과적일까요?',
//     score: 100,
//     coachComment:
//       '제시된 단어 "환경"과 "기술"을 모두 포함한 훌륭한 질문입니다.',
//     createdAt: '2026-06-15T09:30:00Z',
//   },
//   {
//     id: '2',
//     words: ['교육', '미래'],
//     question: '미래의 교육은 어떻게 바뀌어야 한다고 생각하나요?',
//     score: 100,
//     coachComment: '두 단어를 자연스럽게 녹여낸 좋은 질문입니다.',
//     createdAt: '2026-06-14T14:10:00Z',
//   },
//   {
//     id: '3',
//     words: ['건강', '습관'],
//     question: '건강을 지키기 위해 매일 실천하는 것은 무엇인가요?',
//     score: 50,
//     coachComment: '"습관" 단어가 빠졌어요. 두 단어를 모두 포함해 보세요.',
//     createdAt: '2026-06-13T20:05:00Z',
//   },
//   {
//     id: '4',
//     words: ['경제', '성장'],
//     question: '지속 가능한 경제 성장을 위해 무엇이 필요할까요?',
//     score: 100,
//     coachComment: '명확하고 구체적인 질문입니다. 잘했어요!',
//     createdAt: '2026-06-12T11:45:00Z',
//   },
//   {
//     id: '5',
//     words: ['예술', '감정'],
//     question: '예술 작품은 우리의 감정에 어떤 영향을 주나요?',
//     score: 100,
//     coachComment: '두 단어를 모두 포함한 사려 깊은 질문입니다.',
//     createdAt: '2026-06-11T16:20:00Z',
//   },
//   {
//     id: '6',
//     words: ['여행', '문화'],
//     question: '여행을 통해 다른 나라의 문화를 배운 경험이 있나요?',
//     score: 100,
//     coachComment: '훌륭합니다. 두 단어가 자연스럽게 연결되었어요.',
//     createdAt: '2026-06-10T08:00:00Z',
//   },
//   {
//     id: '7',
//     words: ['운동', '에너지'],
//     question: '규칙적인 운동이 하루의 활력에 어떤 도움을 주나요?',
//     score: 50,
//     coachComment: '"에너지" 단어가 포함되지 않았어요. 다시 시도해 보세요.',
//     createdAt: '2026-06-09T19:30:00Z',
//   },
// ];

// export function getRecentRecords(limit = 5): TrainingRecord[] {
//   return [...trainingRecords]
//     .sort(
//       (a, b) =>
//         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
//     )
//     .slice(0, limit);
// }

// export function formatDate(iso: string): string {
//   return new Date(iso).toLocaleDateString('ko-KR', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//   });
// }
