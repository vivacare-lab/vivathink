import type { Difficulty, WordPair } from './types';
import { easyWordPairs } from './data/easy';
import { normalWordPairs } from './data/normal';
import { hardWordPairs } from './data/hard';
// import { creativeWordPairs } from './data/creative';
// import { abstractWordPairs } from './data/abstract';

export const localWordPairsByDifficulty: Record<Difficulty, WordPair[]> = {
    easy: easyWordPairs,
    normal: [],
    hard: [],
    creative: [],
    abstract: [],
};

export function getLocalWordPairs(difficulty: Difficulty) {
    return localWordPairsByDifficulty[difficulty];
}