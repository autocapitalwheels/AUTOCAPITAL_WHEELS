import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      customer_name,
      customer_phone,
      customer_email,
      location,
      preferred_date,
      preferred_time,
      message,
      vehicle_id,
      vehicle_snapshot,
      user_id,
    } = body;

    // Basic validation
    if (!customer_name || !customer_phone || !preferred_date) {
      return NextResponse.json(
        { success: false, error: 'Name, phone and preferred date are required.' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('test_drive_requests')
      .insert({
        customer_name,
        customer_phone,
        customer_email: customer_email || null,
        location: location || null,
        preferred_date,
        preferred_time: preferred_time || null,
        message: message || null,
        vehicle_id: vehicle_id || null,
        vehicle_snapshot: vehicle_snapshot || null,
        status: 'NEW',
        user_id: user_id || null,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[Test Drive API] DB error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to book test drive. Please try again.' },
        { status: 500 }
      );
    }

    // Track analytics (non-blocking)
    supabase.from('analytics_events').insert({
      event_type: 'test_drive_submitted',
      vehicle_id: vehicle_id || null,
      metadata: { vehicle_snapshot },
    }).then(({ error }) => {
      if (error) console.error('[Test Drive API] Analytics error:', error);
    });

    return NextResponse.json({ success: true, data: { id: data?.id } });
  } catch (err) {
    console.error('[Test Drive API] Unexpected error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
