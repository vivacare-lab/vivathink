import { getChildOrThrow, getChildScoreSummary } from '@/lib/parent/data';

const TEMP_PARENT_ID = 'replace-with-parent-id';

export default async function ChildGiftsPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;

  const child = await getChildOrThrow(childId, TEMP_PARENT_ID);
  const summary = await getChildScoreSummary(childId, TEMP_PARENT_ID);

  const canGiveGift = summary.totalAttempts >= 10;

  return (
    <section className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>{child.name} 선물하기</h1>
        <p className='text-muted-foreground'>
          학습 성취에 따라 칭찬과 보상을 줄 수 있는 임시 페이지입니다.
        </p>
      </div>

      <div className='rounded-lg border p-6'>
        <h2 className='text-lg font-semibold'>현재 달성 상태</h2>

        <div className='mt-4 grid gap-4 md:grid-cols-3'>
          <div className='rounded-md bg-muted p-4'>
            <p className='text-sm text-muted-foreground'>학습 횟수</p>
            <p className='mt-1 text-xl font-bold'>{summary.totalAttempts}회</p>
          </div>

          <div className='rounded-md bg-muted p-4'>
            <p className='text-sm text-muted-foreground'>평균 점수</p>
            <p className='mt-1 text-xl font-bold'>
              {summary.averageScore === null
                ? '-'
                : `${summary.averageScore}점`}
            </p>
          </div>

          <div className='rounded-md bg-muted p-4'>
            <p className='text-sm text-muted-foreground'>선물 가능 여부</p>
            <p className='mt-1 text-xl font-bold'>
              {canGiveGift ? '가능' : '아직'}
            </p>
          </div>
        </div>
      </div>

      <div className='rounded-lg border p-6'>
        <h2 className='text-lg font-semibold'>임시 보상</h2>

        <div className='mt-4 space-y-3'>
          <div className='rounded-md border p-4'>
            <p className='font-medium'>칭찬 쿠폰</p>
            <p className='text-sm text-muted-foreground'>
              오늘의 멋진 질문을 칭찬하는 메시지를 보냅니다.
            </p>
          </div>

          <div className='rounded-md border p-4'>
            <p className='font-medium'>10회 학습 달성 선물</p>
            <p className='text-sm text-muted-foreground'>
              학습 10회 이상 달성 시 활성화할 수 있습니다.
            </p>
          </div>
        </div>

        <button
          disabled={!canGiveGift}
          className='mt-6 rounded-md border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {canGiveGift ? '선물하기' : '10회 학습 후 가능'}
        </button>
      </div>
    </section>
  );
}
