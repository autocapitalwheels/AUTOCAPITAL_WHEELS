import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

async function checkAdminAuth(request: NextRequest) {
  const sessionToken = request.cookies.get('acw_admin_session')?.value;
  if (!sessionToken) return null;
  const supabase = createAdminClient();
  const { data } = await supabase.from('admin_users').select('id, email').eq('session_token', sessionToken).eq('is_active', true).gt('session_expires_at', new Date().toISOString()).single();
  return data;
}

export async function POST(request: NextRequest) {
  const admin = await checkAdminAuth(request);
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const supabase = createAdminClient();
  const formData = await request.formData();
  const slug = formData.get('slug') as string;
  const images = formData.getAll('images') as File[];

  if (!slug || images.length === 0) {
    return NextResponse.json({ success: false, error: 'slug and images are required' }, { status: 400 });
  }

  // Get vehicle ID
  const { data: vehicle } = await supabase.from('vehicles').select('id').eq('slug', slug).single();
  if (!vehicle) return NextResponse.json({ success: false, error: 'Vehicle not found' }, { status: 404 });

  // Get existing image count
  const { count: existingCount } = await supabase.from('vehicle_images').select('id', { count: 'exact' }).eq('vehicle_id', vehicle.id);
  let sortOrder = existingCount || 0;
  const isFirst = sortOrder === 0;

  const uploadedImages = [];
  for (const image of images.slice(0, 20 - sortOrder)) {
    if (!image.type.startsWith('image/')) continue;

    const ext = image.name.split('.').pop() || 'jpg';
    const path = `vehicles/${slug}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer = Buffer.from(await image.arrayBuffer());

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('vehicle-images')
      .upload(path, buffer, { contentType: image.type, upsert: false });

    if (uploadError) {
      console.error('[Image upload]', uploadError);
      continue;
    }

    const { data: { publicUrl } } = supabase.storage.from('vehicle-images').getPublicUrl(path);

    const { data: imgRecord } = await supabase.from('vehicle_images').insert({
      vehicle_id: vehicle.id,
      url: publicUrl,
      storage_path: path,
      is_main: isFirst && sortOrder === 0,
      sort_order: sortOrder++,
    }).select('id, url, is_main, sort_order').single();

    if (imgRecord) {
      uploadedImages.push(imgRecord);

      // Update vehicle main_image_url if this is first image
      if (imgRecord.is_main) {
        await supabase.from('vehicles').update({ main_image_url: publicUrl }).eq('id', vehicle.id);
      }
    }
  }

  return NextResponse.json({ success: true, data: uploadedImages });
}
