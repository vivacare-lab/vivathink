import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Logo } from '@/components/ui/logo';

export default function AuthErrorPage() {
  return (
    <div className='flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-10'>
      <Link href='/' className='mb-8'>
        <Logo />
      </Link>
      <Card className='w-full max-w-md text-center'>
        <CardHeader>
          <CardTitle className='font-heading text-2xl'>
            문제가 발생했어요
          </CardTitle>
          <CardDescription>
            인증 과정에서 오류가 생겼습니다. 다시 시도해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className='w-full'>
            <Link href='/auth/login'>로그인으로 돌아가기</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
