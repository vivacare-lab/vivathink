import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { envServer } from '@/lib/env.server';
import { envClient } from '@/lib/env.client';

/**
 * Service-role client. Bypasses RLS — use ONLY in trusted server code
 * (e.g. child runtime where there is no auth.users session). Never expose
 * the service role key to the browser.
 */
export function createAdminClient() {
  return createSupabaseClient(
    envClient.supabaseUrl,
    envServer.supabase.serviceRoleKey,
    // 로그인 여부 세션에 저장 비활성, 자동 리프레시 토큰 갱신 비활성
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}
