import 'server-only';

function required(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  return value;
}

export const envServer = {
  supabase: {
    serviceRoleKey: required('SUPABASE_SERVICE_ROLE_KEY'),
  },
  session: {
    childSecret: required('CHILD_SESSION_SECRET'),
  },
  gemini: {
    apiKey: required('GEMINI_API_KEY'),
  },
};
