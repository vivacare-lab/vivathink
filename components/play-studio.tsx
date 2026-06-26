'use client';

import { useState, useTransition } from 'react';
import { Sparkles, Send, RotateCcw, Gift } from 'lucide-react';
import { getNewWords, submitQuestion } from '@/app/actions/play';

import { AttemptRecord } from '@/lib/play/types';
import { WordPair } from '@/lib/ai';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RecordItem } from '@/components/record-item';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type PlayStudioProps = {
  childName: string;
  initialWords: WordPair;
  initialRecent: AttemptRecord[];
};

export default function PlayStudio({
  childName,
  initialWords,
  initialRecent,
}: PlayStudioProps) {
  const [words, setWords] = useState<WordPair>(initialWords);
  const [isRefreshingWords, setIsRefreshingWords] = useState(false);
  const [question, setQuestion] = useState('');
  const [recent, setRecent] = useState<AttemptRecord[]>(initialRecent);
  const [result, setResult] = useState<AttemptRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isEmpty = question.trim().length < 5;

  function handleSubmit() {
    if (isEmpty || isPending) return;

    setError(null);
    setResult(null);

    startTransition(async () => {
      const response = await submitQuestion({
        word1: words.word1,
        word2: words.word2,
        question,
        difficulty: words.difficulty,
      });

      if (!response.ok) {
        setError(response.error);
        return;
      }

      setResult(response.attempt);
      setRecent((prev) => [response.attempt, ...prev].slice(0, 10));
    });
  }
  async function handleRefreshWords() {
    if (isPending || isRefreshingWords) return;

    setIsRefreshingWords(true);
    setError(null);
    setResult(null);
    setQuestion('');

    try {
      const nextWords = await getNewWords();
      setWords(nextWords);
    } catch (error) {
      console.error('refresh words failed:', error);
      setError('새 단어를 불러오지 못했어요. 다시 시도해 주세요.');
    } finally {
      setIsRefreshingWords(false);
    }
  }
  function handleReset() {
    setQuestion('');
    setResult(null);
    setError(null);
  }

  return (
    <main className='mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8'>
      <section className='space-y-2'>
        <Badge variant='secondary' className='w-fit'>
          VivaThink 창의력 체육관
        </Badge>

        <h1 className='text-2xl font-bold tracking-tight'>
          {childName}의 창의력 운동장 !
        </h1>

        <p className='text-sm text-muted-foreground'>
          질문을 만들고, AI 코치에게 피드백을 받아보세요.
        </p>
      </section>

      <Tabs defaultValue='training' className='w-full'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='training'>훈련소</TabsTrigger>
          <TabsTrigger value='records'>내 기록</TabsTrigger>
          <TabsTrigger value='rewards'>보상함</TabsTrigger>
        </TabsList>

        <TabsContent value='training' className='mt-6 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <Sparkles className='size-5' />
                오늘의 단어
              </CardTitle>
            </CardHeader>

            <CardContent className='space-y-5'>
              <div className='flex flex-wrap gap-3'>
                <span className='rounded-xl bg-secondary px-5 py-3 text-xl font-bold text-secondary-foreground'>
                  {words.word1}
                </span>
                <span className='rounded-xl bg-secondary px-5 py-3 text-xl font-bold text-secondary-foreground'>
                  {words.word2}
                </span>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={handleRefreshWords}
                  disabled={isPending || isRefreshingWords}
                >
                  <RotateCcw className='size-4' />
                  {isRefreshingWords ? '바꾸는 중...' : '단어 바꾸기'}
                </Button>
              </div>

              <div className='rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground'>
                힌트: {words.theme}
              </div>

              <Textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                rows={6}
                placeholder={`예: ${words.word1}와 ${words.word2}가 만나면 어떤 일이 생길까요?`}
                className='resize-none'
              />

              {error && (
                <p className='rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive'>
                  {error}
                </p>
              )}

              <div className='flex gap-2'>
                <Button
                  type='button'
                  onClick={handleSubmit}
                  disabled={isEmpty || isPending}
                  className='flex-1'
                >
                  <Send className='size-4' />
                  {isPending ? 'AI 코치가 보는 중...' : 'AI 코치에게 제출'}
                </Button>

                <Button type='button' variant='outline' onClick={handleReset}>
                  <RotateCcw className='size-4' />
                  다시 쓰기
                </Button>
              </div>
            </CardContent>
          </Card>

          {result && (
            <Card className='border-primary/30'>
              <CardHeader>
                <CardTitle className='text-lg'>AI 코치 피드백</CardTitle>
              </CardHeader>

              <CardContent className='space-y-4'>
                <div className='flex items-end gap-1'>
                  <span className='text-4xl font-bold'>{result.score}</span>
                  <span className='pb-1 text-sm text-muted-foreground'>점</span>
                </div>

                <p className='text-sm leading-relaxed'>{result.feedback}</p>

                {result.strengths && (
                  <p className='text-sm'>
                    <strong>잘한 점:</strong> {result.strengths}
                  </p>
                )}

                {result.suggestion && (
                  <p className='text-sm'>
                    <strong>다음 도전:</strong> {result.suggestion}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value='records' className='mt-6'>
          {recent.length === 0 ? (
            <Card>
              <CardContent className='p-6 text-sm text-muted-foreground'>
                아직 기록이 없어요. 첫 질문을 만들어 보세요.
              </CardContent>
            </Card>
          ) : (
            <ul className='flex flex-col gap-3'>
              {recent.map((record) => (
                <RecordItem key={record.id} record={record} />
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value='rewards' className='mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <Gift className='size-5' />
                보상함
              </CardTitle>
            </CardHeader>

            <CardContent className='space-y-3'>
              <p className='text-sm text-muted-foreground'>
                포인트, 쿠폰, 뱃지 기능이 이곳에 추가될 예정입니다.
              </p>

              <div className='rounded-lg border bg-muted/30 p-4'>
                <p className='text-sm font-medium'>현재 포인트</p>
                <p className='mt-1 text-3xl font-bold'>0P</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
