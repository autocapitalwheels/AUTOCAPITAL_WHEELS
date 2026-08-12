import { createAdminClient } from '@/lib/supabase/admin';
import { Image, Video, File, HardDrive } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getMediaItems() {
  const supabase = createAdminClient();
  
  // Fetch from vehicle_images table to list assets in use
  const { data } = await supabase
    .from('vehicle_images')
    .select('id, url, thumbnail_url, is_main, vehicle_id, vehicles(make, model, year)')
    .order('created_at', { ascending: false });

  return data || [];
}

export default async function AdminMediaPage() {
  const mediaItems = await getMediaItems();

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-neutral-900">Media Library</h1>
        <p className="text-neutral-500 text-sm mt-0.5">{mediaItems.length} media file{mediaItems.length !== 1 ? 's' : ''} in use</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
        {mediaItems.length === 0 ? (
          <div className="text-center py-12 text-neutral-400 font-light">
            <HardDrive size={32} className="mx-auto mb-3 text-neutral-300" />
            No uploaded vehicle media items found in storage.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mediaItems.map((item) => {
              const car = item.vehicles as any;
              const isVideo = item.url.toLowerCase().endsWith('.mp4') || item.url.toLowerCase().endsWith('.webm');
              return (
                <div key={item.id} className="group relative rounded-xl border border-neutral-200 overflow-hidden bg-neutral-50 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="aspect-square w-full relative flex items-center justify-center overflow-hidden bg-neutral-950">
                    {isVideo ? (
                      <video src={item.url} className="w-full h-full object-cover" muted />
                    ) : (
                      <img src={item.url} alt="Vehicle Media" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    )}
                    <span className="absolute top-2 right-2 p-1 bg-black/60 backdrop-blur-sm rounded text-white text-[9px] font-bold">
                      {isVideo ? <Video size={10} /> : <Image size={10} />}
                    </span>
                  </div>
                  <div className="p-2 border-t border-neutral-200 text-[10px]">
                    <div className="font-bold text-neutral-800 truncate">
                      {car ? `${car.year} ${car.make} ${car.model}` : 'Generic Image'}
                    </div>
                    {item.is_main && (
                      <span className="inline-block mt-1 px-1.5 py-0.5 bg-amber-500/10 text-amber-600 font-bold rounded text-[8px] uppercase">
                        Main Image
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
