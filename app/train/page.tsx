import { QuestionCard } from '@/components/question-card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TrainPage() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-4'>
      <div className='w-full max-w-xl'>
        <Button variant='ghost' size='sm'>
          <Link href='/' className='flex items-center gap-2'>
            <ArrowLeft className='size-4' />
            대시보드로 돌아가기
          </Link>
        </Button>
      </div>
      <QuestionCard words={['환경', '기술']} />
    </main>
  );
}
