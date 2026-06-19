'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function addChild(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  if (!name) return { error: '이름을 입력해주세요.' };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: '로그인이 필요합니다.' };

  const { error } = await supabase
    .from('children')
    .insert({ parent_id: user.id, name });
  if (error) return { error: error.message };

  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteChild(childId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: '로그인이 필요합니다.' };

  const { error } = await supabase
    .from('children')
    .delete()
    .eq('id', childId)
    .eq('parent_id', user.id);
  if (error) return { error: error.message };

  revalidatePath('/dashboard');
  return { success: true };
}
