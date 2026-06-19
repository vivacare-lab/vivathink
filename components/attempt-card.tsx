import { Lightbulb, ArrowRight } from 'lucide-react';
import { type Attempt, formatDate } from '@/lib/types';
import { ScoreBadge } from './score-badge';

export function AttemptCard({
  attempt,
  childName,
}: {
  attempt: Attempt;
  childName?: string;
}) {
  return (
    <article className='rounded-2xl border border-border bg-card p-5 shadow-sm'>
      <div className='mb-3 flex items-start justify-between gap-3'>
        <div className='flex flex-wrap items-center gap-2'>
          <span className='rounded-lg bg-secondary px-2.5 py-1 font-heading text-sm font-bold text-secondary-foreground'>
            {attempt.word1}
          </span>
          <ArrowRight
            className='h-4 w-4 text-muted-foreground'
            aria-hidden='true'
          />
          <span className='rounded-lg bg-secondary px-2.5 py-1 font-heading text-sm font-bold text-secondary-foreground'>
            {attempt.word2}
          </span>
        </div>
        <ScoreBadge score={attempt.score} />
      </div>

      <p className='mb-3 text-pretty leading-relaxed text-card-foreground'>
        {attempt.question}
      </p>

      {attempt.feedback && (
        <div className='rounded-xl bg-muted p-3'>
          <p className='flex gap-2 text-sm leading-relaxed text-muted-foreground'>
            <Lightbulb
              className='mt-0.5 h-4 w-4 shrink-0 text-primary'
              aria-hidden='true'
            />
            <span>{attempt.feedback}</span>
          </p>
        </div>
      )}

      <div className='mt-3 flex items-center justify-between text-xs text-muted-foreground'>
        {childName ? (
          <span className='font-medium'>{childName}</span>
        ) : (
          <span />
        )}
        <time dateTime={attempt.created_at}>
          {formatDate(attempt.created_at)}
        </time>
      </div>
    </article>
  );
}
