import { cn } from '@/lib/utils';

export function ScoreBadge({
  score,
  className,
}: {
  score: number | null;
  className?: string;
}) {
  const value = score ?? 0;
  const tone =
    value >= 80
      ? 'bg-[oklch(0.6_0.12_145)] text-[oklch(0.99_0.01_145)]'
      : value >= 60
        ? 'bg-accent text-accent-foreground'
        : value >= 40
          ? 'bg-[oklch(0.78_0.15_85)] text-[oklch(0.27_0.05_85)]'
          : 'bg-secondary text-secondary-foreground';

  return (
    <span
      className={cn(
        'inline-flex h-9 min-w-9 items-center justify-center rounded-full px-2.5 font-heading text-sm font-bold tabular-nums',
        tone,
        className,
      )}
    >
      {score === null ? '—' : value}
    </span>
  );
}
