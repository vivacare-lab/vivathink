import { Badge } from '@/components/ui/badge';
import { AttemptRecord } from '@/lib/play/types';

function scoreColor(score: number | null): string {
  if (score === null) return 'text-muted-foreground';
  if (score >= 80) return 'text-primary';
  if (score >= 50) return 'text-foreground';
  return 'text-destructive';
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function RecordItem({ record }: { record: AttemptRecord }) {
  const score = record.score ?? 0;

  return (
    <li className='rounded-lg border bg-card p-4'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex flex-1 flex-col gap-2'>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge variant='secondary'>{record.word1}</Badge>
            <Badge variant='secondary'>{record.word2}</Badge>

            <span className='text-xs text-muted-foreground'>
              {formatDate(record.created_at)}
            </span>
          </div>

          <p className='text-sm font-medium leading-relaxed text-foreground'>
            {record.question}
          </p>

          {record.feedback && (
            <p className='text-sm leading-relaxed text-muted-foreground'>
              {record.feedback}
            </p>
          )}

          {record.suggestion && (
            <p className='text-sm leading-relaxed text-muted-foreground'>
              <strong>다음 도전:</strong> {record.suggestion}
            </p>
          )}
        </div>

        <div className='shrink-0 text-right'>
          <span
            className={`text-2xl font-bold tabular-nums ${scoreColor(record.score)}`}
          >
            {score}
          </span>
          <span className='ml-0.5 text-xs text-muted-foreground'>점</span>
        </div>
      </div>
    </li>
  );
}
