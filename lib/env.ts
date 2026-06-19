function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  nodeEnv: (required('NODE_ENV') || 'development') as
    | 'development'
    | 'production'
    | 'test',
  supabase: {
    url: required('NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: required('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    serviceRoleKey: required('SUPABASE_SERVICE_ROLE_KEY'),
    redirectUrl: required('NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL'),
  },

  gemini: {
    apiKey: required('GEMINI_API_KEY'),
  },

  session: {
    childSecret: required('CHILD_SESSION_SECRET'),
  },
} as const;
