// components/parent/word-pair-manager.tsx
'use client';

import { useState } from 'react';
import { generateAndSaveAiWordPair } from '@/app/actions/admin';
import { Difficulty } from '@/lib/ai/types';

export function WordPairManager() {
    const [isLoading, setIsLoading] = useState(false);

    const difficulties: Difficulty[] = ['easy', 'normal', 'hard', 'creative', 'abstract'];

    const handleGenerate = async (difficulty: Difficulty) => {
        setIsLoading(true);
        const result = await generateAndSaveAiWordPair(difficulty);
        if (result.ok) {
            alert(`✨ "${result.data.word1}" & "${result.data.word2}" 추가됨`);
        } else {
            alert(`❌ ${result.error}`);
        }
        setIsLoading(false);
    };

    return (
        <div className='space-y-4'>
            <h3 className='font-semibold'>AI 단어 갱신</h3>
            <div className='grid grid-cols-5 gap-2'>
                {difficulties.map((diff) => (
                    <button
                        key={diff}
                        onClick={() => handleGenerate(diff)}
                        disabled={isLoading}
                        className='rounded bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50'
                    >
                        {diff === 'easy' && '쉬움'}
                        {diff === 'normal' && '보통'}
                        {diff === 'hard' && '어려움'}
                        {diff === 'creative' && '창의'}
                        {diff === 'abstract' && '추상'}
                    </button>
                ))}
            </div>
        </div>
    );
}