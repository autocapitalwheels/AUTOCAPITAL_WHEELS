import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail, buildSellRequestEmail } from '@/lib/email/send';

const rateLimitMap = new Map<string, { count: number; reset: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.reset) { rateLimitMap.set(ip, { count: 1, reset: now + 60000 }); return true; }
  if (record.count >= 3) return false;
  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ success: false, error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const formData = await request.formData();

    // Extract text fields
    const owner_name = formData.get('owner_name') as string;
    const owner_phone = formData.get('owner_phone') as string;
    const owner_email = formData.get('owner_email') as string || null;
    const owner_city = formData.get('owner_city') as string;
    const make = formData.get('make') as string;
    const model = formData.get('model') as string;
    const variant = formData.get('variant') as string || null;
    const manufacturing_year = parseInt(formData.get('manufacturing_year') as string);
    const registration_year = formData.get('registration_year') ? parseInt(formData.get('registration_year') as string) : null;
    const fuel_type = formData.get('fuel_type') as string || null;
    const transmission = formData.get('transmission') as string || null;
    const kms_driven = formData.get('kms_driven') ? parseInt(formData.get('kms_driven') as string) : null;
    const number_of_owners = formData.get('number_of_owners') ? parseInt(formData.get('number_of_owners') as string) : 1;
    const expected_price = formData.get('expected_price') ? parseFloat(formData.get('expected_price') as string) : null;
    const vehicle_condition = formData.get('vehicle_condition') as string;
    const accident_history = formData.get('accident_history') === 'true';
    const insurance_status = formData.get('insurance_status') as string || null;
    const rc_available = formData.get('rc_available') !== 'false';
    const additional_info = formData.get('additional_info') as string || null;

    // Validate required fields
    if (!owner_name || !owner_phone || !owner_city || !make || !model || !manufacturing_year) {
      return NextResponse.json({ success: false, error: 'Required fields missing' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Handle photo uploads
    const photos = formData.getAll('photos') as File[];
    const photoUrls: string[] = [];
    const photoStoragePaths: string[] = [];

    for (const photo of photos.slice(0, 10)) {
      if (!photo.type.startsWith('image/')) continue;
      const ext = photo.name.split('.').pop() || 'jpg';
      const path = `sell-requests/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const buffer = Buffer.from(await photo.arrayBuffer());

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('sell-request-photos')
        .upload(path, buffer, { contentType: photo.type });

      if (!uploadError && uploadData) {
        const { data: { publicUrl } } = supabase.storage
          .from('sell-request-photos')
          .getPublicUrl(path);
        photoUrls.push(publicUrl);
        photoStoragePaths.push(path);
      }
    }

    // Insert sell request
    const { data: sellRequest, error } = await supabase
      .from('sell_requests')
      .insert({
        owner_name, owner_phone, owner_email, owner_city,
        make, model, variant, manufacturing_year, registration_year,
        fuel_type, transmission, kms_driven, number_of_owners,
        expected_price, vehicle_condition, accident_history,
        insurance_status, rc_available, additional_info,
        photo_urls: photoUrls,
        photo_storage_paths: photoStoragePaths,
        status: 'NEW',
        ip_address: ip,
      })
      .select('request_id, id')
      .single();

    if (error) {
      console.error('[Sell Request API]', error);
      return NextResponse.json({ success: false, error: 'Failed to save request' }, { status: 500 });
    }

    // Send email notification
    const adminEmail = process.env.EMAIL_TO || 'autocapitalwheels@gmail.com';
    sendEmail({
      to: adminEmail,
      subject: `New Sell Car Request — AutoCapital Wheels (${sellRequest.request_id})`,
      html: buildSellRequestEmail({
        request_id: sellRequest.request_id,
        owner_name, owner_phone, owner_email: owner_email || undefined, owner_city,
        make, model, variant: variant || undefined, manufacturing_year,
        fuel_type: fuel_type || undefined, transmission: transmission || undefined,
        kms_driven: kms_driven || undefined, number_of_owners,
        expected_price: expected_price || undefined, vehicle_condition,
        accident_history, insurance_status: insurance_status || undefined,
        rc_available, additional_info: additional_info || undefined,
        photo_count: photoUrls.length,
        created_at: new Date().toISOString(),
      }),
    }).catch((err) => console.error('[Sell Request Email]', err));

    // Analytics
    supabase.from('analytics_events').insert({
      event_type: 'sell_submitted',
      metadata: { request_id: sellRequest.request_id },
      ip_address: ip,
    }).then(({ error }) => {
      if (error) console.error('[Sell Request API] Analytics error:', error);
    });

    return NextResponse.json({
      success: true,
      data: { request_id: sellRequest.request_id },
      message: 'Sell request submitted successfully',
    });
  } catch (error) {
    console.error('[Sell Request API] Unexpected:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// Admin: GET sell requests
export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get('acw_admin_session')?.value;
  if (!sessionToken) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const supabase = createAdminClient();
  const { data: admin } = await supabase.from('admin_users').select('id').eq('session_token', sessionToken).eq('is_active', true).gt('session_expires_at', new Date().toISOString()).single();
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const per_page = parseInt(searchParams.get('per_page') || '20');
  const offset = (page - 1) * per_page;

  let query = supabase.from('sell_requests').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(offset, offset + per_page - 1);
  if (status) query = query.eq('status', status);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, data, total: count || 0, page, per_page, total_pages: Math.ceil((count || 0) / per_page) });
}
