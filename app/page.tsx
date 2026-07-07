import Link from 'next/link';
import Image from 'next/image';
// import { redirect } from 'next/navigation';
import {
    Sparkles,
    MessageCircleQuestion,
    LineChart,
    Heart,
    Brain,
    Network,
    Lightbulb,
    BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
// import { createClient } from '@/lib/supabase/server';
// import { getChildSession } from '@/lib/child-session';

const thinkingPrinciples = [
    {
        icon: Brain,
        title: '확산적 사고',
        desc: '하나의 정답을 고르는 대신, 여러 가능성을 떠올리고 생각의 방향을 넓히는 연습을 합니다.',
    },
    {
        icon: Network,
        title: '개념 연결',
        desc: '서로 관련 없어 보이는 두 단어를 연결하며 낯선 관점과 새로운 아이디어를 만들어봅니다.',
    },
    {
        icon: MessageCircleQuestion,
        title: '질문 생성',
        desc: '“왜?”, “만약에?”, “어떻게 하면?”처럼 아이가 스스로 생각을 시작하는 질문을 만듭니다.',
    },
];

const features = [
    {
        icon: MessageCircleQuestion,
        title: '두 단어, 무한한 질문',
        desc: '매일 제시되는 단어쌍을 보고 아이가 직접 열린 질문을 만들어요.',
    },
    {
        icon: Sparkles,
        title: 'AI 선생님의 따뜻한 피드백',
        desc: '질문의 장점을 알려주고, 더 깊게 생각해볼 수 있는 힌트를 제공합니다.',
    },
    {
        icon: LineChart,
        title: '성장 기록 확인',
        desc: '부모님은 아이가 만든 질문과 피드백을 보며 생각의 변화를 확인할 수 있어요.',
    },
];

const steps = [
    { step: '1', text: '부모님이 회원가입하고 자녀를 등록해요.' },
    {
        step: '2',
        text: '자녀는 이름과 PIN으로 질문 훈련소에 입장해요.',
    },
    {
        step: '3',
        text: '매일 두 단어를 연결해 새로운 질문을 만들어요.',
    },
];

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
                            연구 기반 창의력 질문 훈련소
                        </span>
                        <h1 className='text-balance font-heading text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl'>
                            우리 아이 창의력,
                            <br />
                            정답보다{' '}
                            <span className='text-primary'>좋은 질문</span>에서 시작됩니다.
                        </h1>
                        <p className='text-pretty text-lg leading-relaxed text-muted-foreground'>
                            vivathink는 두 개의 단어를 연결해 아이가 직접 질문을 만드는 AI
                            창의 사고 훈련소입니다. 창의성 연구에서 다뤄지는 확산적 사고,
                            질문 생성, 개념 연결 원리를 아이 눈높이에 맞춘 하루 5분 루틴으로
                            만들었습니다.
                        </p>

                        <div className='rounded-2xl border border-border bg-card p-5 shadow-sm'>
                            <p className='mb-3 text-sm font-semibold text-muted-foreground'>
                                오늘의 질문 예시
                            </p>
                            <div className='flex flex-wrap items-center gap-2 text-base font-bold text-card-foreground'>
                                <span className='rounded-full bg-secondary px-3 py-1'>사과</span>
                                <span className='text-muted-foreground'>+</span>
                                <span className='rounded-full bg-secondary px-3 py-1'>우주</span>
                            </div>
                            <p className='mt-4 text-pretty text-lg font-medium leading-relaxed text-card-foreground'>
                                “우주에서 사과나무를 키우면 어떤 맛이 날까?”
                            </p>
                        </div>

                        <div className='flex flex-col gap-3 sm:flex-row'>
                            <Button asChild size='lg' className='text-base'>
                                <Link href='/auth/sign-up'>오늘의 질문 훈련 시작하기</Link>
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

                {/* Research principles */}
                <section className='mx-auto w-full max-w-6xl px-4 py-12 md:py-16'>
                    <div className='mx-auto mb-10 max-w-3xl text-center'>
                        <span className='inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground'>
                            <BookOpen className='h-4 w-4 text-primary' aria-hidden='true' />
                            왜 질문 훈련인가요?
                        </span>
                        <h2 className='mt-4 font-heading text-2xl font-bold text-foreground md:text-3xl'>
                            창의성 연구에서 말하는 사고 과정을 아이의 놀이 루틴으로
                        </h2>
                        <p className='mt-4 text-pretty leading-relaxed text-muted-foreground'>
                            창의력은 막연한 재능만이 아니라 반복해서 연습할 수 있는 사고
                            습관입니다. vivathink는 아이가 많이 떠올리고, 다르게 바라보고,
                            새롭게 연결하는 경험을 짧게 반복하도록 돕습니다.
                        </p>
                    </div>

                    <div className='grid gap-6 md:grid-cols-3'>
                        {thinkingPrinciples.map((principle) => (
                            <div
                                key={principle.title}
                                className='rounded-2xl border border-border bg-card p-6 shadow-sm'
                            >
                                <span className='mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary'>
                                    <principle.icon className='h-6 w-6' aria-hidden='true' />
                                </span>
                                <h3 className='mb-2 font-heading text-lg font-bold text-card-foreground'>
                                    {principle.title}
                                </h3>
                                <p className='leading-relaxed text-muted-foreground'>
                                    {principle.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Features */}
                <section className='mx-auto w-full max-w-6xl px-4 py-12 md:py-16'>
                    <h2 className='mb-10 text-center font-heading text-2xl font-bold text-foreground md:text-3xl'>
                        아이는 재미있게, 부모님은 한눈에
                    </h2>
                    <div className='grid gap-6 md:grid-cols-3'>
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className='rounded-2xl border border-border bg-card p-6 shadow-sm'
                            >
                                <span className='mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary'>
                                    <feature.icon className='h-6 w-6' aria-hidden='true' />
                                </span>
                                <h3 className='mb-2 font-heading text-lg font-bold text-card-foreground'>
                                    {feature.title}
                                </h3>
                                <p className='leading-relaxed text-muted-foreground'>
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* How it works */}
                <section className='mx-auto w-full max-w-4xl px-4 py-12 md:py-16'>
                    <div className='rounded-3xl bg-secondary p-8 md:p-12'>
                        <div className='mx-auto mb-8 max-w-2xl text-center'>
                            <Lightbulb
                                className='mx-auto mb-3 h-8 w-8 text-primary'
                                aria-hidden='true'
                            />
                            <h2 className='font-heading text-2xl font-bold text-secondary-foreground'>
                                하루 5분이면 충분해요
                            </h2>
                            <p className='mt-3 leading-relaxed text-secondary-foreground/80'>
                                공부처럼 어렵게 느끼지 않아도 됩니다. 놀이처럼 질문을 만들다
                                보면 아이는 자연스럽게 생각을 넓히는 연습을 하게 됩니다.
                            </p>
                        </div>

                        <ol className='grid gap-6 md:grid-cols-3'>
                            {steps.map((step) => (
                                <li
                                    key={step.step}
                                    className='flex flex-col items-center gap-3 text-center'
                                >
                                    <span className='flex h-10 w-10 items-center justify-center rounded-full bg-primary font-heading text-lg font-bold text-primary-foreground'>
                                        {step.step}
                                    </span>
                                    <p className='leading-relaxed text-secondary-foreground'>
                                        {step.text}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>
            </main>

            <footer className='mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row'>
                <Logo />
                <p className='flex items-center gap-1'>
                    아이의 좋은 질문을 응원합니다{' '}
                    <Heart className='h-4 w-4 text-primary' aria-hidden='true' />
                </p>
            </footer>
        </div>
    );
}
