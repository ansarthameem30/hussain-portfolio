import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'hussain_admin_session';
const DEFAULT_ADMIN_PASS = process.env.ADMIN_PASSWORD || 'malik@admin2026';

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!sessionToken) return false;

  // Verify token (Simple secure base64 hash check matching secret)
  const expectedToken = Buffer.from(`admin:${DEFAULT_ADMIN_PASS}`).toString('base64');
  return sessionToken === expectedToken;
}

export async function setAdminSession(password: string): Promise<boolean> {
  if (password !== DEFAULT_ADMIN_PASS) {
    return false;
  }

  const token = Buffer.from(`admin:${DEFAULT_ADMIN_PASS}`).toString('base64');
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return true;
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
