import { z } from 'zod';

const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL: z.string().optional(),
});

function required(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  return value;
}

export const envClient = schema.parse({
  NEXT_PUBLIC_SUPABASE_URL: required('NEXT_PUBLIC_SUPABASE_URL'),

  NEXT_PUBLIC_SUPABASE_ANON_KEY: required('NEXT_PUBLIC_SUPABASE_ANON_KEY'),

  NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL:
    required('NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL') ??
    `${window.location.origin}/auth/callback`,
});
