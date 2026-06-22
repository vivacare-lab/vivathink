'use client';

import { useState, useTransition } from 'react';
import { Copy, Check, Trash2, Plus, UserPlus, CircleDot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { addChild, deleteChild } from '@/app/actions/children';
import { Child } from '@/lib/types';
import { ChildSummary } from '@/lib/parent/types';

export function ChildrenManager({
  children,
  summaries,
  origin,
}: {
  children: Child[];
  summaries: ChildSummary[];
  origin: string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [isPending, startTransition] = useTransition();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const summaryMap = new Map(summaries.map((item) => [item.id, item]));

  const handleAdd = () => {
    if (!name.trim()) {
      toast.error('이름을 입력해주세요.');
      return;
    }
    const formData = new FormData();
    formData.set('name', name.trim());
    startTransition(async () => {
      const res = await addChild(formData);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(`${name.trim()} 님을 등록했어요!`);
        setName('');
        setOpen(false);
      }
    });
  };

  const inviteUrl = (token: string) => `${origin}/join/${token}`;

  const copyInvite = async (token: string, id: string) => {
    try {
      await navigator.clipboard.writeText(inviteUrl(token));
      setCopiedId(id);
      toast.success('초대 링크를 복사했어요!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('복사에 실패했어요.');
    }
  };

  const handleDelete = (child: Child) => {
    startTransition(async () => {
      const res = await deleteChild(child.id);
      if (res?.error) toast.error(res.error);
      else toast.success(`${child.name} 님을 삭제했어요.`);
    });
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h2 className='font-heading text-lg font-bold text-foreground'>
          자녀 관리
        </h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size='sm'>
              <Plus className='h-4 w-4' aria-hidden='true' />
              자녀 추가
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className='font-heading'>자녀 등록</DialogTitle>
              <DialogDescription>
                자녀의 이름을 입력하면 초대 링크가 생성됩니다.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-2 py-2'>
              <Label htmlFor='childName'>이름</Label>
              <Input
                id='childName'
                placeholder='예: 지우'
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
            </div>
            <DialogFooter>
              <Button
                onClick={handleAdd}
                disabled={isPending}
                className='w-full'
              >
                {isPending ? '등록 중...' : '등록하기'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {children.length === 0 ? (
        <div className='flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center'>
          <span className='flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary'>
            <UserPlus className='h-6 w-6' aria-hidden='true' />
          </span>
          <p className='text-sm text-muted-foreground'>
            아직 등록된 자녀가 없어요.
            <br />
            자녀를 추가하고 초대 링크를 보내보세요.
          </p>
        </div>
      ) : (
        <ul className='flex flex-col gap-3'>
          {children.map((child) => {
            const summary = summaryMap.get(child.id);
            return (
              <li
                key={child.id}
                className='flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm'
              >
                <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                  <div className='flex items-center gap-3'>
                    <span className='flex h-10 w-10 items-center justify-center rounded-full bg-primary font-heading text-base font-bold text-primary-foreground'>
                      {child.name.charAt(0)}
                    </span>

                    <div>
                      <p className='font-medium text-card-foreground'>
                        {child.name}
                      </p>
                      <p className='flex items-center gap-1 text-xs text-muted-foreground'>
                        <CircleDot
                          className={
                            child.activated
                              ? 'h-3 w-3 text-[oklch(0.6_0.12_145)]'
                              : 'h-3 w-3 text-muted-foreground'
                          }
                          aria-hidden='true'
                        />
                        {child.activated
                          ? '입장 완료 (PIN 설정됨)'
                          : '초대 대기 중'}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => copyInvite(child.invite_token, child.id)}
                    >
                      {copiedId === child.id ? (
                        <Check
                          className='h-4 w-4 text-[oklch(0.6_0.12_145)]'
                          aria-hidden='true'
                        />
                      ) : (
                        <Copy className='h-4 w-4' aria-hidden='true' />
                      )}
                      초대 링크
                    </Button>

                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleDelete(child)}
                      disabled={isPending}
                      aria-label={`${child.name} 삭제`}
                    >
                      <Trash2
                        className='h-4 w-4 text-destructive'
                        aria-hidden='true'
                      />
                    </Button>
                  </div>
                </div>

                <a
                  href={`/dashboard/children/${child.id}`}
                  className='grid grid-cols-3 gap-3 rounded-xl border border-border bg-muted/30 p-3 text-sm transition-colors hover:bg-muted'
                >
                  <div>
                    <p className='text-xs text-muted-foreground'>학습 횟수</p>
                    <p className='font-semibold'>
                      {summary?.totalAttempts ?? 0}회
                    </p>
                  </div>

                  <div>
                    <p className='text-xs text-muted-foreground'>평균 점수</p>
                    <p className='font-semibold'>
                      {summary?.averageScore == null
                        ? '-'
                        : `${summary.averageScore}점`}
                    </p>
                  </div>

                  <div>
                    <p className='text-xs text-muted-foreground'>최근 학습</p>
                    <p className='font-semibold'>
                      {summary?.latestAttemptAt
                        ? new Date(summary.latestAttemptAt).toLocaleDateString(
                            'ko-KR',
                          )
                        : '-'}
                    </p>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
