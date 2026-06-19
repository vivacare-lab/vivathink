import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual, randomBytes, scryptSync } from 'crypto';

const CHILD_COOKIE = 'vt_child_session';

function getSessionSecret() {
  const secret = process.env.CHILD_SESSION_SECRET;

  if (!secret) {
    throw new Error('Missing CHILD_SESSION_SECRET or SUPABASE_JWT_SECRET');
  }

  return secret;
}
export type ChildSession = {
  childId: string;
  parentId: string;
  name: string;
};

function sign(payload: string) {
  return createHmac('sha256', getSessionSecret())
    .update(payload)
    .digest('base64url');
}

export async function createChildSession(session: ChildSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  const signature = sign(payload);
  const token = `${payload}.${signature}`;
  const cookieStore = await cookies();
  cookieStore.set(CHILD_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getChildSession(): Promise<ChildSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CHILD_COOKIE)?.value;
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  const expected = sign(payload);
  try {
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected)))
      return null;
  } catch {
    return null;
  }
  try {
    return JSON.parse(
      Buffer.from(payload, 'base64url').toString(),
    ) as ChildSession;
  } catch {
    return null;
  }
}

export async function clearChildSession() {
  const cookieStore = await cookies();
  cookieStore.delete(CHILD_COOKIE);
}

// --- PIN hashing (scrypt) ---
export function hashPin(pin: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(pin, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPin(pin: string, stored: string) {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const candidate = scryptSync(pin, salt, 64).toString('hex');
  try {
    return timingSafeEqual(
      Buffer.from(candidate, 'hex'),
      Buffer.from(hash, 'hex'),
    );
  } catch {
    return false;
  }
}
