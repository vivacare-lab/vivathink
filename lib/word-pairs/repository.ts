import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Difficulty, WordPairRow } from './types';

const WORD_PAIR_SELECT =
    'id, word1, word2, theme, difficulty, category1, category2, tags, pair_key, created_at';

// TODO : 사용하지 않는 함수이므로 추후 제거 예정
export async function getRandomWordPairFromDb(
    childId: string,
    difficulty: Difficulty,
): Promise<WordPairRow | null> {
    const supabase = createAdminClient();

    const { count, error: countError } = await supabase
        .from('ai_word_pairs')
        .select('id', { count: 'exact', head: true })
        .eq('difficulty', difficulty);

    if (countError) {
        console.error('word pair count failed:', countError);
        return null;
    }

    if (!count || count < 1) {
        return null;
    }

    const randomOffset = Math.floor(Math.random() * count);

    const { data, error } = await supabase
        .from('ai_word_pairs')
        .select(WORD_PAIR_SELECT)
        .eq('difficulty', difficulty)
        .range(randomOffset, randomOffset)
        .maybeSingle();

    if (error) {
        console.error('random word pair fetch failed:', error);
        return null;
    }

    return data as WordPairRow | null;
}