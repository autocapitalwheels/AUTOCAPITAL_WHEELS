import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

async function checkAdminAuth(request: NextRequest) {
  const sessionToken = request.cookies.get('acw_admin_session')?.value;
  if (!sessionToken) return null;
  const supabase = createAdminClient();
  const { data } = await supabase.from('admin_users').select('id').eq('session_token', sessionToken).eq('is_active', true).gt('session_expires_at', new Date().toISOString()).single();
  return data;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdminAuth(request);
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const supabase = createAdminClient();

  // Get image record
  const { data: image } = await supabase.from('vehicle_images').select('id, storage_path, is_main, vehicle_id').eq('id', id).single();
  if (!image) return NextResponse.json({ success: false, error: 'Image not found' }, { status: 404 });

  // Delete from storage
  if (image.storage_path) {
    await supabase.storage.from('vehicle-images').remove([image.storage_path]);
  }

  // Delete record
  await supabase.from('vehicle_images').delete().eq('id', id);

  // If it was the main image, promote the next one
  if (image.is_main) {
    const { data: nextImage } = await supabase
      .from('vehicle_images')
      .select('id, url')
      .eq('vehicle_id', image.vehicle_id)
      .order('sort_order', { ascending: true })
      .limit(1)
      .single();

    if (nextImage) {
      await supabase.from('vehicle_images').update({ is_main: true }).eq('id', nextImage.id);
      await supabase.from('vehicles').update({ main_image_url: nextImage.url }).eq('id', image.vehicle_id);
    } else {
      await supabase.from('vehicles').update({ main_image_url: null }).eq('id', image.vehicle_id);
    }
  }

  return NextResponse.json({ success: true });
}
