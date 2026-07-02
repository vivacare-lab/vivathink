import type { WordPair } from './types';

export function normalizeWord(word: string) {
    return word.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function normalizePairKey(word1: string, word2: string) {
    return [normalizeWord(word1), normalizeWord(word2)].sort().join('|');
}

export function normalizeTags(tags: string[]) {
    return Array.from(
        new Set(
            tags
                .map((tag) => tag.trim())
                .filter(Boolean),
        ),
    );
}

export function normalizeWordPair(pair: WordPair) {
    return {
        ...pair,
        word1: pair.word1.trim(),
        word2: pair.word2.trim(),
        theme: pair.theme.trim(),
        tags: normalizeTags(pair.tags),
        pair_key: normalizePairKey(pair.word1, pair.word2),
    };
}