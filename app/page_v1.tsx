// import { Dashboard } from '@/components/dashboard';
// import { Header } from '@/components/header';

// export default function Home() {
//   return (
//     <main className='flex min-h-screen items-center justify-center bg-background p-4 flex-col gap-4'>
//       <Header />
//       <div className='py-6'></div>
//       <Dashboard />
//     </main>
//   );
// }

import Link from 'next/link';
import Image from 'next/image';
// import { redirect } from 'next/navigation';
import {
  Sparkles,
  MessageCircleQuestion,
  LineChart,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
// import { createClient } from '@/lib/supabase/server';
// import { getChildSession } from '@/lib/child-session';

export default async function HomePage() {
  // Already signed in? Send to the right place.
  // const supabase = await createClient();
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();
  // if (user) redirect('/dashboard');
  // const child = await getChildSession();
  // if (child) redirect('/studio');

  return (
    <div className='flex min-h-dvh flex-col bg-background'>
      <main className='flex-1'>
        {/* Hero */}
        <section className='mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20'>
          <div className='flex flex-col gap-6'>
            <span className='inline-flex w-fit items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground'>
              <Sparkles className='h-4 w-4 text-primary' aria-hidden='true' />
              창의력 질문 훈련소
            </span>
            <h1 className='text-balance font-heading text-2xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl'>
              두 단어로 시작하는 우리 아이의{' '}
              <span className='text-primary'>질문하는 힘</span>
            </h1>
            <p className='text-pretty text-lg leading-relaxed text-muted-foreground'>
              vivathink는 매일 새로운 두 개의 단어를 제시합니다. 아이는 그
              단어로 호기심 가득한 질문을 만들고, AI 선생님에게 따뜻한 피드백과
              점수를 받아요. 부모님은 아이의 성장을 한눈에 확인할 수 있습니다.
            </p>
            <div className='flex flex-col gap-3 sm:flex-row'>
              <Button asChild size='lg' className='text-base'>
                <Link href='/auth/sign-up'>부모 회원가입</Link>
              </Button>
              <Button asChild size='lg' variant='outline' className='text-base'>
                <Link href='/auth/login'>이미 계정이 있어요</Link>
              </Button>
            </div>
          </div>
          <div className='relative'>
            <Image
              src='/hero-kids.png'
              alt='부모와 아이가 함께 태블릿으로 질문을 만드는 모습'
              width={640}
              height={640}
              className='w-full rounded-3xl'
              priority
            />
          </div>
        </section>

        {/* Features */}
        <section className='mx-auto w-full max-w-6xl px-4 py-12 md:py-16'>
          <h2 className='mb-10 text-center font-heading text-2xl font-bold text-foreground md:text-3xl'>
            어떻게 창의력을 키우나요?
          </h2>
          <div className='grid gap-6 md:grid-cols-3'>
            {[
              {
                icon: MessageCircleQuestion,
                title: '두 단어, 무한한 질문',
                desc: '전혀 다른 두 단어를 연결해 답이 정해지지 않은 열린 질문을 만들어요.',
              },
              {
                icon: Sparkles,
                title: 'AI 선생님의 피드백',
                desc: '질문마다 창의성과 사고력을 평가하고 더 좋은 질문을 위한 힌트를 줍니다.',
              },
              {
                icon: LineChart,
                title: '성장 기록',
                desc: '지금까지 만든 단어, 질문, 점수, 피드백을 모두 다시 확인할 수 있어요.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className='rounded-2xl border border-border bg-card p-6 shadow-sm'
              >
                <span className='mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary'>
                  <f.icon className='h-6 w-6' aria-hidden='true' />
                </span>
                <h3 className='mb-2 font-heading text-lg font-bold text-card-foreground'>
                  {f.title}
                </h3>
                <p className='leading-relaxed text-muted-foreground'>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className='mx-auto w-full max-w-4xl px-4 py-12 md:py-16'>
          <div className='rounded-3xl bg-secondary p-8 md:p-12'>
            <h2 className='mb-8 text-center font-heading text-2xl font-bold text-secondary-foreground'>
              부모와 아이가 함께해요
            </h2>
            <ol className='grid gap-6 md:grid-cols-3'>
              {[
                { step: '1', text: '부모님이 회원가입하고 자녀를 등록해요.' },
                {
                  step: '2',
                  text: '초대 링크를 자녀에게 보내고 이름과 PIN으로 입장해요.',
                },
                {
                  step: '3',
                  text: '아이는 질문 훈련소에서 매일 새로운 질문을 만들어요.',
                },
              ].map((s) => (
                <li
                  key={s.step}
                  className='flex flex-col items-center gap-3 text-center'
                >
                  <span className='flex h-10 w-10 items-center justify-center rounded-full bg-primary font-heading text-lg font-bold text-primary-foreground'>
                    {s.step}
                  </span>
                  <p className='leading-relaxed text-secondary-foreground'>
                    {s.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className='mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground'>
        <Logo />
        <p className='flex items-center gap-1'>
          아이의 호기심을 응원합니다{' '}
          <Heart className='h-4 w-4 text-primary' aria-hidden='true' />
        </p>
      </footer>
    </div>
  );
}
