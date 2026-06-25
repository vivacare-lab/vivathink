import { z } from 'zod';

const schema = z.object({
  supabaseUrl: z.url(),
  supabaseAnonKey: z.string(),
  supabaseRedirectUrl: z.string().optional(),
});

export const envClient = schema.parse({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,

  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

  supabaseRedirectUrl:
    process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL,
});
