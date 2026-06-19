'use client';

import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Logo } from '@/components/ui/logo';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { env } from '@/lib/env';

export default function SignUpPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== repeatPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    const supabase = createClient();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            env.supabase.redirectUrl ??
            `${window.location.origin}/auth/callback`,
          data: { display_name: displayName },
        },
      });
      if (error) throw error;
      router.push('/auth/sign-up-success');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-10'>
      <Link href='/' className='mb-8'>
        <Logo />
      </Link>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='font-heading text-2xl'>부모 회원가입</CardTitle>
          <CardDescription>
            자녀의 창의력 여정을 함께 시작해보세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className='flex flex-col gap-5'>
            <div className='grid gap-2'>
              <Label htmlFor='displayName'>이름</Label>
              <Input
                id='displayName'
                placeholder='홍길동'
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='email'>이메일</Label>
              <Input
                id='email'
                type='email'
                placeholder='parent@example.com'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='password'>비밀번호</Label>
              <Input
                id='password'
                type='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='repeatPassword'>비밀번호 확인</Label>
              <Input
                id='repeatPassword'
                type='password'
                required
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
            </div>
            {error && <p className='text-sm text-destructive'>{error}</p>}
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? '가입 중...' : '회원가입'}
            </Button>
            <p className='text-center text-sm text-muted-foreground'>
              이미 계정이 있으신가요?{' '}
              <Link
                href='/auth/login'
                className='font-medium text-primary underline underline-offset-4'
              >
                로그인
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
