'use client';

import { useState } from 'react';
import { activateChild, loginChild } from '@/app/actions/child-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ChildJoinForm({
  token,
  name,
  activated,
}: {
  token: string;
  name: string;
  activated: boolean;
}) {
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = activated
      ? await loginChild(token, pin)
      : await activateChild(token, pin, pinConfirm);
    // If the action redirects, code below won't run. Otherwise show error.
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className='w-full max-w-sm rounded-3xl border border-border bg-card p-8'>
      <div className='text-center'>
        <p className='font-heading text-lg font-semibold text-primary'>
          {name} 친구, 환영해요!
        </p>
        <h1 className='mt-1 font-heading text-2xl font-bold text-card-foreground'>
          {activated ? 'PIN을 입력해 주세요' : '나만의 PIN을 만들어요'}
        </h1>
        <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
          {activated
            ? '이전에 만든 4자리 PIN으로 입장해요.'
            : '숫자 4자리로 비밀 PIN을 정해요. 다음부터 이 PIN으로 입장해요.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className='mt-6 flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='pin'>PIN (숫자 4자리)</Label>
          <Input
            id='pin'
            inputMode='numeric'
            maxLength={4}
            required
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder='••••'
            className='text-center text-2xl tracking-[0.5em]'
            autoFocus
          />
        </div>

        {!activated && (
          <div className='flex flex-col gap-2'>
            <Label htmlFor='pinConfirm'>PIN 다시 입력</Label>
            <Input
              id='pinConfirm'
              inputMode='numeric'
              maxLength={4}
              required
              value={pinConfirm}
              onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, ''))}
              placeholder='••••'
              className='text-center text-2xl tracking-[0.5em]'
            />
          </div>
        )}

        {error && <p className='text-sm text-destructive'>{error}</p>}

        <Button
          type='submit'
          size='lg'
          className='mt-2 rounded-full'
          disabled={loading}
        >
          {loading ? '잠시만요...' : activated ? '입장하기' : '시작하기'}
        </Button>
      </form>
    </div>
  );
}
