import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { getChildSession } from '@/lib/child-session';
import { getChildRecentAttempts } from '@/app/actions/play';
import { RecordItem } from '@/components/record-item';
import { Button } from '@/components/ui/button';

export default async function RecordsPage() {
  const session = await getChildSession();
  if (!session) redirect('/');

  const records = await getChildRecentAttempts(100);

  return (
    <main className='min-h-screen bg-background p-4 py-10 sm:p-8'>
      <div className='mx-auto w-full max-w-3xl'>
        <Button variant='ghost' size='sm' className='mb-4' asChild>
          <Link href='/play' className='flex items-center gap-2'>
            <ArrowLeft className='size-4' />
            훈련소로 돌아가기
          </Link>
        </Button>

        <header className='mb-8'>
          <h1 className='text-3xl font-bold tracking-tight text-foreground'>
            나의 훈련 기록
          </h1>
          <p className='mt-2 text-muted-foreground'>
            지금까지 만든 질문과 AI 코치 피드백을 확인하세요. 총{' '}
            {records.length}개
          </p>
        </header>

        {records.length === 0 ? (
          <div className='rounded-lg border bg-muted/30 p-6 text-sm text-muted-foreground'>
            아직 훈련 기록이 없어요. 첫 번째 창의력 운동을 시작해 보세요.
          </div>
        ) : (
          <ul className='flex flex-col gap-3'>
            {records.map((record) => (
              <RecordItem key={record.id} record={record} />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
