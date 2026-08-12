import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import VehicleForm from '@/components/admin/VehicleForm';

export default async function EditVehiclePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: vehicle } = await supabase
    .from('vehicles')
    .select('*, vehicle_images(id, url, thumbnail_url, caption, alt_text, is_main, sort_order), vehicle_features(id, category, feature)')
    .eq('slug', slug)
    .single();

  if (!vehicle) notFound();

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-gray-900">Edit Vehicle</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </p>
      </div>
      <VehicleForm vehicle={vehicle} />
    </div>
  );
}
