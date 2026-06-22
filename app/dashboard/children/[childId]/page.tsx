import Link from 'next/link';
import {
  getChildAttempts,
  getChildOrThrow,
  getChildScoreSummary,
} from '@/lib/parent/data';
import { getCurrentParent } from '@/lib/auth/parent';

export default async function ChildOverviewPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;

  const parent = await getCurrentParent();

  const child = await getChildOrThrow(childId, parent.id);
  const attempts = await getChildAttempts(childId, parent.id, 3);
  const score = await getChildScoreSummary(childId, parent.id);

  return (
    <section className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>{child.name} 요약</h1>
        <p className='text-muted-foreground'>
          최근 학습 흐름과 주요 지표를 확인합니다.
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        <div className='rounded-lg border p-5'>
          <p className='text-sm text-muted-foreground'>총 학습 횟수</p>
          <p className='mt-2 text-2xl font-bold'>{score.totalAttempts}회</p>
        </div>

        <div className='rounded-lg border p-5'>
          <p className='text-sm text-muted-foreground'>평균 점수</p>
          <p className='mt-2 text-2xl font-bold'>
            {score.averageScore === null ? '-' : `${score.averageScore}점`}
          </p>
        </div>

        <div className='rounded-lg border p-5'>
          <p className='text-sm text-muted-foreground'>최근 점수</p>
          <p className='mt-2 text-2xl font-bold'>
            {score.latestScore === null ? '-' : `${score.latestScore}점`}
          </p>
        </div>
      </div>

      <div className='rounded-lg border p-5'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>최근 질문</h2>
          <Link
            href={`/dashboard/children/${childId}/records`}
            className='text-sm underline'
          >
            전체 보기
          </Link>
        </div>

        <div className='mt-4 space-y-3'>
          {attempts.length === 0 ? (
            <p className='text-sm text-muted-foreground'>
              아직 학습 기록이 없습니다.
            </p>
          ) : (
            attempts.map((attempt) => (
              <div key={attempt.id} className='rounded-md bg-muted p-4'>
                <p className='text-sm text-muted-foreground'>
                  {attempt.word1} · {attempt.word2}
                </p>
                <p className='mt-1 font-medium'>{attempt.question}</p>
                {attempt.feedback && (
                  <p className='mt-2 text-sm text-muted-foreground'>
                    {attempt.feedback}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
