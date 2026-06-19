import 'server-only';

import { redirect } from 'next/navigation';
import { createClient as createServerClient } from '@/lib/supabase/server';

export async function getCurrentParent() {
  const supabase = await createServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/auth/login');
  }

  return {
    id: user.id,
    email: user.email,
  };
}
