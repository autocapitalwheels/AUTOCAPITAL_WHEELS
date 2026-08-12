import { createAdminClient } from '@/lib/supabase/admin';
import { HelpCircle, Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getFAQs() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('faqs')
    .select('*')
    .order('sort_order', { ascending: true });

  return data || [];
}

export default async function AdminFAQsPage() {
  const faqs = await getFAQs();

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-neutral-900">Frequently Asked Questions (FAQs)</h1>
        <p className="text-neutral-500 text-sm mt-0.5">{faqs.length} question{faqs.length !== 1 ? 's' : ''} total</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Order</th>
                <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Category</th>
                <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Question</th>
                <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Answer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs text-neutral-600">
              {faqs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-neutral-400 font-light">
                    No FAQs uploaded yet.
                  </td>
                </tr>
              ) : (
                faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-4 whitespace-nowrap font-mono text-neutral-400">
                      #{faq.sort_order || 0}
                    </td>
                    <td className="p-4 whitespace-nowrap font-bold text-neutral-700">
                      {faq.category || 'General'}
                    </td>
                    <td className="p-4 font-bold text-neutral-800">
                      <div className="flex items-center gap-1.5">
                        <HelpCircle size={12} className="text-neutral-400 flex-shrink-0" />
                        {faq.question}
                      </div>
                    </td>
                    <td className="p-4 max-w-[350px] break-words font-light leading-relaxed">
                      {faq.answer}
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
