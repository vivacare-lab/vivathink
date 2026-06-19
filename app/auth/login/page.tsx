'use client';

import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Logo } from '@/components/ui/logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const supabase = createClient();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
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
          <CardTitle className='font-heading text-2xl'>부모 로그인</CardTitle>
          <CardDescription>
            vivathink에 다시 오신 것을 환영합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className='flex flex-col gap-5'>
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
            {error && <p className='text-sm text-destructive'>{error}</p>}
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
            <p className='text-center text-sm text-muted-foreground'>
              아직 계정이 없으신가요?{' '}
              <Link
                href='/auth/sign-up'
                className='font-medium text-primary underline underline-offset-4'
              >
                회원가입
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
