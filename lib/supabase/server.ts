import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { envClient } from '@/lib/env.client';

/**
 * Always create a new client within each function (don't store in a global).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    envClient.NEXT_PUBLIC_SUPABASE_URL,
    envClient.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — can be ignored with proxy refreshing sessions.
          }
        },
      },
    },
  );
}
