import { getChildByToken } from '@/app/actions/child-auth';
import { ChildJoinForm } from '@/components/child-join-form';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';

export default async function JoinPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const child = await getChildByToken(token);

  return (
    <main className='flex min-h-dvh flex-col items-center justify-center gap-8 bg-background px-4 py-10'>
      <Link href='/'>
        <Logo />
      </Link>
      {child ? (
        <ChildJoinForm
          token={token}
          name={child.name}
          activated={child.activated}
        />
      ) : (
        <div className='w-full max-w-sm rounded-3xl border border-border bg-card p-8 text-center'>
          <h1 className='font-heading text-2xl font-bold text-card-foreground'>
            앗, 링크를 찾을 수 없어요
          </h1>
          <p className='mt-3 text-pretty leading-relaxed text-muted-foreground'>
            초대 링크가 올바르지 않거나 만료되었어요. 부모님께 새 초대 링크를
            요청해 주세요.
          </p>
        </div>
      )}
    </main>
  );
}
