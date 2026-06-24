import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { createClient } from '@/lib/supabase/server';
import { getChildSession } from '@/lib/child-session';
import { signOutChild } from '@/app/actions/child-auth';
import { signOutParent } from '@/app/actions/parent-auth';

export async function GlobalHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const childSession = await getChildSession();

  const isParent = Boolean(user);
  const isChild = !isParent && Boolean(childSession);

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <Link href={isParent ? '/dashboard' : isChild ? '/play' : '/'}>
          <Logo />
        </Link>

        <div className="hidden text-lg font-bold sm:block">
          창의력 체육관
        </div>

        <nav className="flex items-center gap-2">
          {!isParent && !isChild && (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth/login">로그인</Link>
              </Button>

              <Button asChild size="sm">
                <Link href="/auth/sign-up">회원가입</Link>
              </Button>
            </>
          )}

          {isParent && (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard">대시보드</Link>
              </Button>

              {/* <Button asChild variant="ghost" size="sm">
                <Link href="/profile">
                  <UserIcon className="size-4" />
                </Link>
              </Button>

              <Button asChild variant="ghost" size="sm">
                <Link href="/settings">
                  <Settings2Icon className="size-4" />
                </Link>
              </Button> */}

              <form action={signOutParent}>
                <Button type="submit" variant="ghost" size="sm">
                  <LogOut className="size-4" />
                </Button>
              </form>
            </div>
          )}

          {isChild && childSession && (
            <>
              <span className="hidden rounded-full bg-muted px-3 py-1 text-sm font-medium sm:inline">
                {childSession.name}
              </span>

              {/* <Button asChild variant="ghost" size="sm">
                <Link href="/play" className="flex items-center gap-2">
                  <Dumbbell className="size-4" />
                  <span className="hidden sm:inline">훈련소</span>
                </Link>
              </Button>

              <Button asChild variant="ghost" size="sm">
                <Link href="/records">내 기록</Link>
              </Button> */}

              <form action={signOutChild}>
                <Button type="submit" variant="ghost" size="sm">
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">나가기</span>
                </Button>
              </form>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
