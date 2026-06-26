import { getParentSession } from '@/lib/auth/parent';
import { getChildOrThrow, getChildScoreSummary } from '@/lib/parent/data';

export default async function ChildScoresPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;

  const parent = await getParentSession();

  const child = await getChildOrThrow(childId, parent.id);
  const summary = await getChildScoreSummary(childId, parent.id);

  return (
    <section className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>{child.name} 스코어</h1>
        <p className='text-muted-foreground'>
          점수 흐름과 학습 성과를 확인합니다.
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-4'>
        <div className='rounded-lg border p-5'>
          <p className='text-sm text-muted-foreground'>학습 횟수</p>
          <p className='mt-2 text-2xl font-bold'>{summary.totalAttempts}회</p>
        </div>

        <div className='rounded-lg border p-5'>
          <p className='text-sm text-muted-foreground'>평균 점수</p>
          <p className='mt-2 text-2xl font-bold'>
            {summary.averageScore === null ? '-' : `${summary.averageScore}점`}
          </p>
        </div>

        <div className='rounded-lg border p-5'>
          <p className='text-sm text-muted-foreground'>최고 점수</p>
          <p className='mt-2 text-2xl font-bold'>
            {summary.highestScore === null ? '-' : `${summary.highestScore}점`}
          </p>
        </div>

        <div className='rounded-lg border p-5'>
          <p className='text-sm text-muted-foreground'>최근 점수</p>
          <p className='mt-2 text-2xl font-bold'>
            {summary.latestScore === null ? '-' : `${summary.latestScore}점`}
          </p>
        </div>
      </div>

      <div className='rounded-lg border p-5'>
        <h2 className='text-lg font-semibold'>최근 점수 흐름</h2>

        <div className='mt-4 space-y-3'>
          {summary.recentScores.length === 0 ? (
            <p className='text-sm text-muted-foreground'>
              아직 표시할 점수가 없습니다.
            </p>
          ) : (
            summary.recentScores.map((item) => (
              <div key={item.id} className='flex items-center gap-3'>
                <div className='w-28 text-sm text-muted-foreground'>
                  {new Date(item.created_at).toLocaleDateString('ko-KR')}
                </div>

                <div className='h-3 flex-1 rounded-full bg-muted'>
                  <div
                    className='h-3 rounded-full bg-foreground'
                    style={{ width: `${Math.max(0, item.score ?? 0)}%` }}
                  />
                </div>

                <div className='w-12 text-right text-sm font-semibold'>
                  {item.score === null ? '-' : item.score}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
