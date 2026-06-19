import { redirect } from 'next/navigation';

import { getChildSession } from '@/lib/child-session';
import { getChildRecentAttempts, getNewWords } from '@/app/actions/play';
import PlayStudio from '@/components/play-studio';
import type { WordPair } from '@/lib/ai';

const fallbackWords: WordPair = {
  word1: '구름',
  word2: '고양이',
  theme: '하늘과 동물이 만나는 상상',
  difficulty: 'creative',
};

export default async function PlayPage() {
  const session = await getChildSession();
  if (!session) redirect('/');

  const [initialWords, recent] = await Promise.all([
    getNewWords().catch(() => fallbackWords),
    getChildRecentAttempts(10),
  ]);

  return (
    <PlayStudio
      childName={session.name}
      initialWords={initialWords ?? fallbackWords}
      initialRecent={recent}
    />
  );
}
