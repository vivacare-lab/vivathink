'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';

export interface QuestionCardProps {
  /** 질문에 반드시 포함되어야 하는 두 개의 단어 */
  words: [string, string];
}

interface Feedback {
  score: number;

  creativity: number;
  curiosity: number;
  originality: number;

  strengths: string[];
  improvements: string[];

  coachComment: string;
}

export function QuestionCard({ words }: QuestionCardProps) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const isEmpty = value.trim().length === 0;

  async function handleSubmit() {
    if (isEmpty || loading) return;
    setLoading(true);
    setFeedback(null);

    const response = await fetch('/api/ai/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: value,
        words,
      }),
    });

    const result = await response.json();

    setFeedback(result);
  }

  return (
    <Card className='w-full max-w-xl'>
      <CardHeader>
        <CardTitle className='text-base font-medium text-muted-foreground'>
          다음 두 단어를 포함하여 질문을 만들어 보세요
        </CardTitle>
        {/* 1. 질문 단어 */}
        <div className='mt-3 flex flex-wrap items-center gap-3'>
          {words.map((word) => (
            <span
              key={word}
              className='rounded-lg bg-secondary px-4 py-2 text-lg font-semibold text-secondary-foreground'
            >
              {word}
            </span>
          ))}
        </div>
        <div className='flex justify-end'>힌트받기</div>
      </CardHeader>

      <CardContent className='flex flex-col gap-4'>
        {/* 2. 질문 입력 textarea */}
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder='여기에 질문을 입력하세요...'
          rows={5}
          className='resize-none'
          aria-label='질문 입력'
        />

        {/* 3. 전송 버튼 */}
        <Button
          onClick={handleSubmit}
          disabled={isEmpty || loading}
          className='w-full'
        >
          {loading ? (
            <>
              <Loader2 className='size-4 animate-spin' />
              검증 중...
            </>
          ) : (
            <>
              <Send className='size-4' />
              전송
            </>
          )}
        </Button>

        {/* 4. 피드백 영역 */}
        {feedback && (
          <div className='space-y-4'>
            <div>
              <div>창의성</div>
              <div>{feedback.creativity}점</div>
            </div>

            <div>
              <div>호기심</div>
              <div>{feedback.curiosity}점</div>
            </div>

            <div>
              <div>독창성</div>
              <div>{feedback.originality}점</div>
            </div>

            <div>
              <h4>잘한 점</h4>

              <ul>
                {feedback.strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4>개선 포인트</h4>

              <ul>
                {feedback.improvements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4>AI 코치</h4>
              <p>{feedback.coachComment}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
