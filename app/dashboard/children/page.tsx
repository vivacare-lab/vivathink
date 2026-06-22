import Link from 'next/link';
import { getParentChildren } from '@/lib/parent/data';
import { getCurrentParent } from '@/lib/auth/parent';

export default async function ParentPage() {
  const parent = await getCurrentParent();
  const children = await getParentChildren(parent.id);

  return (
    <main className='mx-auto max-w-5xl space-y-8 p-6'>
      <section>
        <h1 className='text-2xl font-bold'>부모 대시보드</h1>
        <p className='text-muted-foreground'>
          자녀별 학습 현황을 확인하고 기록, 점수, 보상 흐름을 관리합니다.
        </p>
      </section>

      {children.length === 0 ? (
        <div className='rounded-lg border p-6'>
          <p>등록된 자녀가 없습니다.</p>
        </div>
      ) : (
        <div className='grid gap-4 md:grid-cols-2'>
          {children.map((child) => (
            <Link
              key={child.id}
              href={`/dashboard/children/${child.id}`}
              className='rounded-lg border p-5 hover:bg-muted'
            >
              <h2 className='text-lg font-semibold'>{child.name}</h2>

              <div className='mt-4 grid grid-cols-3 gap-3 text-sm'>
                <div>
                  <p className='text-muted-foreground'>학습 횟수</p>
                  <p className='font-semibold'>{child.totalAttempts}회</p>
                </div>
                <div>
                  <p className='text-muted-foreground'>평균 점수</p>
                  <p className='font-semibold'>
                    {child.averageScore === null
                      ? '-'
                      : `${child.averageScore}점`}
                  </p>
                </div>
                <div>
                  <p className='text-muted-foreground'>최근 학습</p>
                  <p className='font-semibold'>
                    {child.latestAttemptAt
                      ? new Date(child.latestAttemptAt).toLocaleDateString(
                          'ko-KR',
                        )
                      : '-'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
