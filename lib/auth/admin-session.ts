import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import type { AdminUser } from '@/types';

const ADMIN_SESSION_COOKIE = 'acw_admin_session';

export async function getAdminSession(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!sessionToken) return null;

  const supabase = createAdminClient();

  try {
    // Verify session token against admin_users table
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('session_token', sessionToken)
      .eq('is_active', true)
      .gt('session_expires_at', new Date().toISOString())
      .single();

    if (error || !data) return null;

    return data as AdminUser;
  } catch {
    return null;
  }
}

export async function requireAdminSession(): Promise<AdminUser> {
  const admin = await getAdminSession();
  if (!admin) {
    redirect('/admin/login');
  }
  return admin;
}

export async function setAdminSession(adminId: string): Promise<string> {
  const supabase = createAdminClient();
  const token = crypto.randomUUID() + '-' + crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  await supabase
    .from('admin_users')
    .update({
      session_token: token,
      session_expires_at: expiresAt,
      last_login_at: new Date().toISOString(),
    })
    .eq('id', adminId);

  return token;
}

export async function clearAdminSession(sessionToken: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from('admin_users')
    .update({ session_token: null, session_expires_at: null })
    .eq('session_token', sessionToken);
}

export function getAdminSessionCookieName(): string {
  return ADMIN_SESSION_COOKIE;
}
