import { createBrowserClient } from '@supabase/ssr';
import { envClient } from '@/lib/env.client';

export function createClient() {
  return createBrowserClient(
    envClient.supabase.url,
    envClient.supabase.anonKey,
  );
}
