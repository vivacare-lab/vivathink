'use server';

import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  createChildSession,
  clearChildSession,
  hashPin,
  verifyPin,
} from '@/lib/child-session';

type ActionResult = { error?: string; needsPin?: boolean };

// Look up a child by invite token. Used to render the join page.
export async function getChildByToken(token: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('children')
    .select('id, name, activated, parent_id')
    .eq('invite_token', token)
    .maybeSingle();
  if (error || !data) return null;
  return data;
}

// First-time activation: child sets a PIN, then is logged in.
export async function activateChild(
  token: string,
  pin: string,
  pinConfirm: string,
): Promise<ActionResult> {
  if (!/^\d{4}$/.test(pin))
    return { error: 'PIN은 숫자 4자리로 입력해 주세요.' };
  if (pin !== pinConfirm) return { error: 'PIN이 일치하지 않습니다.' };

  const supabase = createAdminClient();
  const { data: child } = await supabase
    .from('children')
    .select('id, name, parent_id, activated')
    .eq('invite_token', token)
    .maybeSingle();

  if (!child) return { error: '유효하지 않은 초대 링크입니다.' };
  if (child.activated)
    return { error: '이미 등록된 계정입니다. 로그인해 주세요.' };

  const { error: updateError } = await supabase
    .from('children')
    .update({ pin_hash: hashPin(pin), activated: true })
    .eq('id', child.id);

  if (updateError)
    return { error: '등록 중 문제가 발생했습니다. 다시 시도해 주세요.' };

  await createChildSession({
    childId: child.id,
    parentId: child.parent_id,
    name: child.name,
  });
  redirect('/play');
}

// Returning child: log in with PIN.
export async function loginChild(
  token: string,
  pin: string,
): Promise<ActionResult> {
  const supabase = createAdminClient();
  const { data: child } = await supabase
    .from('children')
    .select('id, name, parent_id, pin_hash, activated')
    .eq('invite_token', token)
    .maybeSingle();

  if (!child || !child.activated || !child.pin_hash) {
    return { error: '먼저 PIN을 설정해 주세요.' };
  }
  if (!verifyPin(pin, child.pin_hash)) {
    return { error: 'PIN이 올바르지 않습니다.' };
  }

  await createChildSession({
    childId: child.id,
    parentId: child.parent_id,
    name: child.name,
  });
  redirect('/play');
}

export async function signOutChild() {
  await clearChildSession();
  redirect('/play/access-required?reason=signed-out');
}
