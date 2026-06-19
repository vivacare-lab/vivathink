import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm'>
        <Sparkles className='h-5 w-5' aria-hidden='true' />
      </span>
      {showText && (
        <span className='font-heading text-xl font-bold tracking-tight text-foreground'>
          viva<span className='text-primary'>think</span>
        </span>
      )}
    </div>
  );
}
