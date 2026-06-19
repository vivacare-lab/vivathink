import Link from 'next/link';
import { MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Logo } from '@/components/ui/logo';

export default function SignUpSuccessPage() {
  return (
    <div className='flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-10'>
      <Link href='/' className='mb-8'>
        <Logo />
      </Link>
      <Card className='w-full max-w-md text-center'>
        <CardHeader>
          <span className='mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary'>
            <MailCheck className='h-7 w-7' aria-hidden='true' />
          </span>
          <CardTitle className='font-heading text-2xl'>
            이메일을 확인해주세요
          </CardTitle>
          <CardDescription>
            가입을 완료하려면 메일함의 확인 링크를 눌러주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <p className='text-sm leading-relaxed text-muted-foreground'>
            확인을 마친 후 로그인하면 자녀를 등록하고 초대 링크를 보낼 수
            있습니다.
          </p>
          <Button asChild className='w-full'>
            <Link href='/auth/login'>로그인하러 가기</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
