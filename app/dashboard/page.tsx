import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Attempt, Child } from '@/lib/types';
import { ChildrenManager } from '@/components/children-manager';
import { AttemptCard } from '@/components/attempt-card';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const displayName =
    (user.user_metadata?.display_name as string) ||
    user.email?.split('@')[0] ||
    '부모님';

  const [{ data: children }, { data: attempts }] = await Promise.all([
    supabase
      .from('children')
      .select('*')
      .eq('parent_id', user.id)
      .order('created_at', { ascending: true }),
    supabase
      .from('attempts')
      .select('*')
      .eq('parent_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  const childMap = new Map((children ?? []).map((c: Child) => [c.id, c.name]));

  const hdrs = await headers();
  const host = hdrs.get('x-forwarded-host') ?? hdrs.get('host') ?? '';
  const proto = hdrs.get('x-forwarded-proto') ?? 'https';
  const origin = host ? `${proto}://${host}` : '';

  return (
    <div className='flex min-h-dvh flex-col bg-background'>
      <header className='border-b border-border bg-card'>
        <div className='mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4'>
          <Logo />
          <form action='/auth/sign-out' method='post'>
            <Button type='submit' variant='ghost' size='sm'>
              <LogOut className='h-4 w-4' aria-hidden='true' />
              로그아웃
            </Button>
          </form>
        </div>
      </header>

      <main className='mx-auto w-full max-w-5xl flex-1 px-4 py-8'>
        <div className='mb-8'>
          <h1 className='font-heading text-2xl font-bold text-foreground md:text-3xl'>
            안녕하세요, {displayName}님
          </h1>
          <p className='mt-1 text-muted-foreground'>
            자녀의 창의력 질문 훈련을 관리하고 기록을 확인하세요.
          </p>
        </div>

        <div className='grid gap-8 lg:grid-cols-[1.1fr_1fr]'>
          {/* Left: children management */}
          <section className='flex flex-col gap-8'>
            <ChildrenManager
              children={(children ?? []) as Child[]}
              origin={origin}
            />
          </section>

          {/* Right: recent attempts */}
          <section className='flex flex-col gap-4'>
            <h2 className='font-heading text-lg font-bold text-foreground'>
              최근 질문 기록
            </h2>
            {(attempts ?? []).length === 0 ? (
              <div className='flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center'>
                <span className='flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary'>
                  <Sparkles className='h-6 w-6' aria-hidden='true' />
                </span>
                <p className='text-sm text-muted-foreground'>
                  아직 진행한 질문이 없어요.
                  <br />
                  자녀가 질문 훈련소에서 질문을 만들면 여기에 표시됩니다.
                </p>
              </div>
            ) : (
              <div className='flex flex-col gap-3'>
                {(attempts as Attempt[]).map((a) => (
                  <AttemptCard
                    key={a.id}
                    attempt={a}
                    childName={childMap.get(a.child_id)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        <div className='mt-10 rounded-3xl bg-secondary p-6 text-center md:p-8'>
          <h3 className='font-heading text-lg font-bold text-secondary-foreground'>
            자녀의 입장 방식이 궁금하신가요?
          </h3>
          <p className='mx-auto mt-2 max-w-xl text-sm leading-relaxed text-secondary-foreground/80'>
            자녀 옆의 &lsquo;초대 링크&rsquo;를 복사해 자녀에게 보내주세요.
            자녀는 링크 접속 후 이름을 확인하고 4자리 PIN을 만들어 질문 훈련소에
            입장합니다.
          </p>
          <Button asChild variant='outline' className='mt-4 bg-card'>
            <Link href='/'>서비스 소개 보기</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
