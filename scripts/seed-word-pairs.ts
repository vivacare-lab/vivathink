/**
 * 주의:
 * - 로컬 단어 쌍 데이터를 Supabase에 로드하는 스크립트입니다.
 *
 * 기능:
 * - word1 + word2 정규화 후 pair_key 생성
 * - "은행 + 바다"와 "바다 + 은행"을 같은 조합으로 처리
 * - local JSON 내부 중복 제거
 * - DB에 이미 존재하는 pair_key는 PASS
 * - 새 단어쌍만 ai_word_pairs에 INSERT
 * - tags는 word_pair_tags 테이블에 UPSERT
 * - 단어쌍과 tag는 ai_word_pair_tag_links 테이블로 연결
 *
 * 실행:
 * npm run seed:word-pairs
 * 또는
 * npx ts-node migration/seed-word-pairs.ts
 */

import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

import { createClient } from '@supabase/supabase-js';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
// import easy from '../data/easy.json' with { type: 'json' };
// import normal from '../data/normal.json' with { type: 'json' };
// import hard from '../data/hard.json' with { type: 'json' };
// import creative from '../data/creative.json' with { type: 'json' };
// import abstract from '../data/abstract.json' with { type: 'json' };

type Difficulty = 'easy' | 'normal' | 'hard' | 'creative' | 'abstract';

type LocalWordPair = {
    word1: string;
    word2: string;
    theme: string;
    category1: string;
    category2: string;
    tags: string[];
};

type SeedWordPair = LocalWordPair & {
    difficulty: Difficulty;
    pair_key: string;
};

type InsertedWordPairRow = {
    id: string;
    pair_key: string;
};

type TagRow = {
    id: string;
    name: string;
};

const difficulties: Difficulty[] = [
    'easy',
    'normal',
    'hard',
    'creative',
    'abstract',
];

const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('❌ 환경 변수가 설정되지 않았습니다.');
    console.error(
        'SUPABASE_URL 또는 NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY를 설정하세요.',
    );
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});

function normalizeWord(word: string) {
    return word.trim().replace(/\s+/g, ' ').toLowerCase();
}

function normalizePairKey(word1: string, word2: string) {
    return [normalizeWord(word1), normalizeWord(word2)].sort().join('|');
}

function normalizeTags(tags: string[]) {
    return Array.from(
        new Set(tags.map((tag) => tag.trim()).filter(Boolean)),
    );
}

function validatePair(pair: LocalWordPair, difficulty: Difficulty) {
    if (!pair.word1?.trim()) {
        throw new Error(`[${difficulty}] word1이 비어 있습니다.`);
    }

    if (!pair.word2?.trim()) {
        throw new Error(`[${difficulty}] word2가 비어 있습니다.`);
    }

    if (!pair.theme?.trim()) {
        throw new Error(
            `[${difficulty}] ${pair.word1}/${pair.word2} theme이 비어 있습니다.`,
        );
    }

    if (!pair.category1?.trim()) {
        throw new Error(
            `[${difficulty}] ${pair.word1}/${pair.word2} category1이 비어 있습니다.`,
        );
    }

    if (!pair.category2?.trim()) {
        throw new Error(
            `[${difficulty}] ${pair.word1}/${pair.word2} category2가 비어 있습니다.`,
        );
    }

    if (!Array.isArray(pair.tags) || pair.tags.length === 0) {
        throw new Error(
            `[${difficulty}] ${pair.word1}/${pair.word2} tags가 비어 있습니다.`,
        );
    }

    if (pair.category1 === pair.category2) {
        throw new Error(
            `[${difficulty}] ${pair.word1}/${pair.word2}의 category1과 category2는 서로 달라야 합니다.`,
        );
    }
}

function normalizePair(
    pair: LocalWordPair,
    difficulty: Difficulty,
): SeedWordPair {
    validatePair(pair, difficulty);

    return {
        word1: pair.word1.trim(),
        word2: pair.word2.trim(),
        theme: pair.theme.trim(),
        difficulty,
        category1: pair.category1.trim(),
        category2: pair.category2.trim(),
        tags: normalizeTags(pair.tags),
        pair_key: normalizePairKey(pair.word1, pair.word2),
    };
}

async function upsertTags(tagNames: string[]) {
    const uniqueTagNames = Array.from(
        new Set(tagNames.map((tag) => tag.trim()).filter(Boolean)),
    );

    if (uniqueTagNames.length === 0) {
        return new Map<string, string>();
    }

    const { error: upsertError } = await supabase
        .from('word_pair_tags')
        .upsert(
            uniqueTagNames.map((name) => ({ name })),
            { onConflict: 'name' },
        );

    if (upsertError) {
        throw new Error(`태그 UPSERT 실패: ${upsertError.message}`);
    }

    const { data: tagRows, error: selectError } = await supabase
        .from('word_pair_tags')
        .select('id, name')
        .in('name', uniqueTagNames);

    if (selectError) {
        throw new Error(`태그 조회 실패: ${selectError.message}`);
    }

    return new Map(
        ((tagRows ?? []) as TagRow[]).map((tag) => [tag.name, tag.id]),
    );
}

function chunkArray<T>(array: T[], size: number) {
    const chunks: T[][] = [];

    for (let index = 0; index < array.length; index += size) {
        chunks.push(array.slice(index, index + size));
    }

    return chunks;
}

async function insertTagLinks(
    insertedPairs: InsertedWordPairRow[],
    rowsToInsert: SeedWordPair[],
    tagIdByName: Map<string, string>,
) {
    const wordPairIdByPairKey = new Map(
        insertedPairs.map((pair) => [pair.pair_key, pair.id]),
    );

    const links = rowsToInsert.flatMap((pair) => {
        const wordPairId = wordPairIdByPairKey.get(pair.pair_key);

        if (!wordPairId) {
            return [];
        }

        return pair.tags.flatMap((tagName) => {
            const tagId = tagIdByName.get(tagName);

            if (!tagId) {
                return [];
            }

            return [
                {
                    word_pair_id: wordPairId,
                    tag_id: tagId,
                },
            ];
        });
    });

    if (links.length === 0) {
        return 0;
    }

    for (const linkChunk of chunkArray(links, 100)) {
        const { error } = await supabase
            .from('ai_word_pair_tag_links')
            .upsert(linkChunk, {
                onConflict: 'word_pair_id,tag_id',
            });

        if (error) {
            console.error('태그 링크 INSERT 실패 상세:', error);
            throw new Error(`태그 링크 INSERT 실패: ${error.message}`);
        }
    }

    return links.length;
}

async function loadWordPairsFile(
    difficulty: Difficulty,
): Promise<LocalWordPair[]> {
    const filePath = path.join(process.cwd(), 'data', `${difficulty}.json`);

    let raw = '';

    try {
        raw = await readFile(filePath, 'utf8');
    } catch {
        console.warn(`⚠️  [${difficulty}] 파일 없음: ${filePath}`);
        return [];
    }

    if (!raw.trim()) {
        console.warn(`⚠️  [${difficulty}] JSON 파일이 비어 있어 PASS합니다.`);
        return [];
    }

    try {
        const parsed = JSON.parse(raw) as unknown;

        if (!Array.isArray(parsed)) {
            throw new Error('JSON 루트는 배열이어야 합니다.');
        }

        return parsed as LocalWordPair[];
    } catch (error) {
        throw new Error(
            `[${difficulty}] JSON 파싱 실패: ${error instanceof Error ? error.message : String(error)
            }`,
        );
    }
}

async function seedWordPairs() {
    console.log('🌱 로컬 단어 쌍 데이터 로드 시작...\n');

    // const source = {
    //     easy,
    //     normal,
    //     hard,
    //     creative,
    //     abstract,
    // } as unknown as LocalWordPairsJson;

    let totalSource = 0;
    let totalFileDuplicate = 0;
    let totalDbDuplicate = 0;
    let totalInserted = 0;
    let totalTagLinks = 0;

    for (const difficulty of difficulties) {
        const pairs = await loadWordPairsFile(difficulty);

        if (pairs.length === 0) {
            console.warn(`⚠️  [${difficulty}] 업로드할 데이터 없음\n`);
            continue;
        }

        totalSource += pairs.length;

        console.log(`📝 [${difficulty}] ${pairs.length}개 검사 중...`);

        const seenInFile = new Set<string>();
        const uniquePairs: SeedWordPair[] = [];
        const duplicatedInFile: SeedWordPair[] = [];

        for (const pair of pairs) {
            const normalized = normalizePair(pair, difficulty);

            if (seenInFile.has(normalized.pair_key)) {
                duplicatedInFile.push(normalized);
                continue;
            }

            seenInFile.add(normalized.pair_key);
            uniquePairs.push(normalized);
        }

        totalFileDuplicate += duplicatedInFile.length;

        const pairKeys = uniquePairs.map((pair) => pair.pair_key);

        const existingRows: { pair_key: string }[] = [];

        for (const pairKeyChunk of chunkArray(pairKeys, 30)) { // 30씩 나누어 작업 -> 문제 없는 경우 50 또는 100으로 변경 가능
            const { data, error } = await supabase
                .from('ai_word_pairs')
                .select('pair_key')
                .in('pair_key', pairKeyChunk);

            if (error) {
                console.error(`[${difficulty}] 기존 데이터 조회 실패 상세:`, error);

                throw new Error(
                    `[${difficulty}] 기존 데이터 조회 실패: ${error.message}`,
                );
            }

            existingRows.push(...((data ?? []) as { pair_key: string }[]));
        }

        const existingKeys = new Set(
            existingRows.map((row) => row.pair_key),
        );

        const rowsToInsert = uniquePairs.filter(
            (pair) => !existingKeys.has(pair.pair_key),
        );

        totalDbDuplicate += existingKeys.size;

        const insertedPairs: InsertedWordPairRow[] = [];
        let insertedTagLinks = 0;

        if (rowsToInsert.length > 0) {
            const allTagNames = rowsToInsert.flatMap((pair) => pair.tags);
            const tagIdByName = await upsertTags(allTagNames);

            const wordPairRows = rowsToInsert.map((pair) => ({
                word1: pair.word1,
                word2: pair.word2,
                theme: pair.theme,
                difficulty: pair.difficulty,
                category1: pair.category1,
                category2: pair.category2,
                pair_key: pair.pair_key,
                source: 'local',
            }));

            for (const wordPairRowChunk of chunkArray(wordPairRows, 50)) {
                const { data, error: insertError } = await supabase
                    .from('ai_word_pairs')
                    .insert(wordPairRowChunk)
                    .select('id, pair_key');

                if (insertError) {
                    console.error(`[${difficulty}] ai_word_pairs INSERT 실패 상세:`, insertError);

                    throw new Error(
                        `[${difficulty}] ai_word_pairs INSERT 실패: ${insertError.message}`,
                    );
                }

                insertedPairs.push(...((data ?? []) as InsertedWordPairRow[]));
            }

            insertedTagLinks = await insertTagLinks(
                insertedPairs,
                rowsToInsert,
                tagIdByName,
            );

            totalInserted += insertedPairs.length;
            totalTagLinks += insertedTagLinks;
        }

        console.log(`  원본: ${pairs.length}개`);
        console.log(`  파일 내부 중복 PASS: ${duplicatedInFile.length}개`);
        console.log(`  DB 기존 중복 PASS: ${existingKeys.size}개`);
        console.log(`  신규 단어쌍 INSERT: ${insertedPairs.length}개`);
        console.log(`  신규 태그 링크 UPSERT: ${insertedTagLinks}개\n`);
    }

    console.log('📊 최종 통계:');
    console.log(`  원본 전체: ${totalSource}개`);
    console.log(`  파일 내부 중복 PASS: ${totalFileDuplicate}개`);
    console.log(`  DB 기존 중복 PASS: ${totalDbDuplicate}개`);
    console.log(`  신규 단어쌍 INSERT: ${totalInserted}개`);
    console.log(`  태그 링크 UPSERT: ${totalTagLinks}개\n`);

    console.log('📦 DB 난이도별 개수:');

    for (const difficulty of difficulties) {
        const { count, error } = await supabase
            .from('ai_word_pairs')
            .select('*', { count: 'exact', head: true })
            .eq('difficulty', difficulty);

        if (error) {
            console.error(`  ❌ [${difficulty}] 조회 실패: ${error.message}`);
            continue;
        }

        console.log(`  [${difficulty}] ${count ?? 0}개`);
    }

    console.log('\n🏷️ DB 태그 개수:');

    const { count: tagCount, error: tagCountError } = await supabase
        .from('word_pair_tags')
        .select('*', { count: 'exact', head: true });

    if (tagCountError) {
        console.error(`  ❌ 태그 조회 실패: ${tagCountError.message}`);
    } else {
        console.log(`  tags: ${tagCount ?? 0}개`);
    }

    console.log('\n✨ 로드 완료!');
}

seedWordPairs().catch((error) => {
    console.error('\n❌ 스크립트 실행 실패:');
    console.error(error);
    process.exit(1);
});