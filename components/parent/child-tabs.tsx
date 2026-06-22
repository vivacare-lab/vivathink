import Link from 'next/link';

const tabs = [
  { label: '요약', href: '' },
  { label: '학습기록', href: '/records' },
  { label: '스코어', href: '/scores' },
  { label: '선물하기', href: '/gifts' },
];

export function ChildTabs({ childId }: { childId: string }) {
  return (
    <nav className='flex gap-2 border-b pb-3'>
      {tabs.map((tab) => (
        <Link
          key={tab.label}
          href={`/dashboard/children/${childId}${tab.href}`}
          className='rounded-full border px-4 py-2 text-sm hover:bg-muted'
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
