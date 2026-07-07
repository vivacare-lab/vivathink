import type { Difficulty, WordPair } from './types';
import { easyWordPairs } from './data/easy';
import { normalWordPairs } from './data/normal';
import { hardWordPairs } from './data/hard';
import { creativeWordPairs } from './data/creative';
import { abstractWordPairs } from './data/abstract';

export const localWordPairsByDifficulty: Record<Difficulty, WordPair[]> = {
    easy: easyWordPairs,
    normal: normalWordPairs,
    hard: hardWordPairs,
    creative: creativeWordPairs,
    abstract: abstractWordPairs,
};

export function getLocalWordPairs(difficulty: Difficulty) {
    return localWordPairsByDifficulty[difficulty];
}