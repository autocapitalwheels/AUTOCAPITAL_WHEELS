import { createAdminClient } from '@/lib/supabase/admin';
import { Star, User, MessageSquare } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getTestimonials() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  return data || [];
}

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-neutral-900">Client Testimonials</h1>
        <p className="text-neutral-500 text-sm mt-0.5">{testimonials.length} review{testimonials.length !== 1 ? 's' : ''} total</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Customer</th>
                <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Rating</th>
                <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Comment</th>
                <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs">
              {testimonials.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-neutral-400 font-light">
                    No testimonials uploaded yet.
                  </td>
                </tr>
              ) : (
                testimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-neutral-800 flex items-center gap-1.5">
                        <User size={12} className="text-neutral-400" />
                        {t.name}
                      </div>
                      {t.role && (
                        <div className="text-neutral-400 text-[10px] mt-0.5">
                          {t.role}
                        </div>
                      )}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            fill={i < t.rating ? 'currentColor' : 'none'}
                            className={i < t.rating ? 'text-amber-500' : 'text-neutral-200'}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 max-w-[300px] break-words text-neutral-600 font-light leading-relaxed">
                      {t.comment}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                        Approved & Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
