import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { adminLoginSchema } from '@/lib/validations';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = adminLoginSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 400 });
    }

    const { email, password } = parseResult.data;
    const supabase = createAdminClient();

    const { data: admin, error } = await supabase
      .from('admin_users')
      .select('id, email, password_hash, full_name, role, is_active')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .single();

    if (error || !admin) {
      // Deliberate vague error to prevent email enumeration
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, admin.password_hash);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    // Generate session token
    const token = crypto.randomUUID() + '-' + crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    await supabase.from('admin_users').update({
      session_token: token,
      session_expires_at: expiresAt,
      last_login_at: new Date().toISOString(),
    }).eq('id', admin.id);

    // Log activity
    await supabase.from('admin_activity_logs').insert({
      admin_id: admin.id,
      admin_email: admin.email,
      action: 'ADMIN_LOGIN',
      ip_address: request.headers.get('x-forwarded-for')?.split(',')[0] || undefined,
    });

    const response = NextResponse.json({
      success: true,
      data: { full_name: admin.full_name, email: admin.email, role: admin.role },
    });

    // Set secure HttpOnly cookie
    response.cookies.set('acw_admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[Admin Login]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
