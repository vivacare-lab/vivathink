import { ChildTabs } from '@/components/parent/child-tabs';

export default async function ChildLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;

  return (
    <main className='mx-auto max-w-5xl space-y-6 p-6'>
      <ChildTabs childId={childId} />
      {children}
    </main>
  );
}
