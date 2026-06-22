import { getCurrentParent } from '@/lib/auth/parent';
import { getChildAttempts, getChildOrThrow } from '@/lib/parent/data';

export default async function ChildRecordsPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;

  const parent = await getCurrentParent();

  const child = await getChildOrThrow(childId, parent.id);
  const attempts = await getChildAttempts(childId, parent.id, 20);

  return (
    <section className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>{child.name} 학습기록</h1>
        <p className='text-muted-foreground'>
          최근 학습 기록 20개를 표시합니다. 이후 더보기 방식으로 확장하면
          됩니다.
        </p>
      </div>

      <div className='space-y-4'>
        {attempts.length === 0 ? (
          <div className='rounded-lg border p-6'>
            <p>아직 학습 기록이 없습니다.</p>
          </div>
        ) : (
          attempts.map((attempt) => (
            <article key={attempt.id} className='rounded-lg border p-5'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <p className='text-sm text-muted-foreground'>
                    {new Date(attempt.created_at).toLocaleString('ko-KR')}
                  </p>
                  <p className='mt-1 text-sm font-medium'>
                    제시 단어: {attempt.word1} / {attempt.word2}
                  </p>
                </div>

                <div className='rounded-full bg-muted px-3 py-1 text-sm font-semibold'>
                  {attempt.score === null ? '-' : `${attempt.score}점`}
                </div>
              </div>

              <div className='mt-4'>
                <p className='font-semibold'>질문</p>
                <p className='mt-1'>{attempt.question}</p>
              </div>

              {attempt.feedback && (
                <div className='mt-4'>
                  <p className='font-semibold'>피드백</p>
                  <p className='mt-1 text-muted-foreground'>
                    {attempt.feedback}
                  </p>
                </div>
              )}

              {attempt.strengths && (
                <div className='mt-4'>
                  <p className='font-semibold'>잘한 점</p>
                  <p className='mt-1 text-muted-foreground'>
                    {attempt.strengths}
                  </p>
                </div>
              )}

              {attempt.suggestion && (
                <div className='mt-4'>
                  <p className='font-semibold'>다음 제안</p>
                  <p className='mt-1 text-muted-foreground'>
                    {attempt.suggestion}
                  </p>
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
