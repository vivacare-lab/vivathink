import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function PlayAccessRequiredPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;

  const title =
    reason === 'invalid-token'
      ? '초대 링크가 올바르지 않아요'
      : reason === 'expired-token'
        ? '초대 링크가 만료되었어요'
        : '자녀 초대 링크가 필요해요';

  const description =
    reason === 'invalid-token'
      ? '주소가 잘못되었거나 사용할 수 없는 초대 링크입니다. 부모님에게 새 링크를 다시 받아 주세요.'
      : reason === 'expired-token'
        ? '이 초대 링크는 더 이상 사용할 수 없습니다. 부모님에게 새 링크를 다시 받아 주세요.'
        : '이 페이지는 부모님이 만들어준 자녀 전용 링크로 접속해야 사용할 수 있어요.';

  return (
    <main className='mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-5 p-6 text-center'>
      <div className='space-y-2'>
        <p className='text-sm font-medium text-muted-foreground'>
          VivaThink 자녀 학습공간
        </p>

        <h1 className='text-2xl font-bold'>{title}</h1>

        <p className='text-sm leading-relaxed text-muted-foreground'>
          {description}
        </p>
      </div>

      <div className='rounded-lg border bg-muted/40 p-4 text-left text-sm text-muted-foreground'>
        <p className='font-medium text-foreground'>접속 방법</p>
        <ol className='mt-2 list-decimal space-y-1 pl-5'>
          <li>부모님이 VivaThink에 로그인합니다.</li>
          <li>대시보드에서 자녀 초대 링크를 확인합니다.</li>
          <li>그 링크로 다시 접속하면 학습을 시작할 수 있습니다.</li>
        </ol>
      </div>

      <Button asChild variant='outline'>
        <Link href='/'>홈으로 돌아가기</Link>
      </Button>
    </main>
  );
}
