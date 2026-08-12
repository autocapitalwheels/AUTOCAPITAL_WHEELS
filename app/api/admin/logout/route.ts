import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  const sessionToken = request.cookies.get('acw_admin_session')?.value;

  if (sessionToken) {
    const supabase = createAdminClient();
    await supabase
      .from('admin_users')
      .update({ session_token: null, session_expires_at: null })
      .eq('session_token', sessionToken);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set('acw_admin_session', '', { maxAge: 0, path: '/' });
  return response;
}
