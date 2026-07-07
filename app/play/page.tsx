import { redirect } from 'next/navigation';
import { getChildSession } from '@/lib/child-session';
import { WordPair } from '@/lib/word-pairs/types';
import { getChildRecentAttempts, getNewWords } from '@/app/actions/play';
import PlayStudio from '@/components/play-studio';

const fallbackWords: WordPair = {
  word1: "은행",
  word2: "바다",
  theme: "가치를 저장하는 공간",
  difficulty: "normal",
  category1: "경제",
  category2: "자연",
  tags: ["경제", "자연", "비교", "상상"]
};

export default async function PlayPage() {
  const session = await getChildSession();
  if (!session) redirect('/play/access-required');

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
