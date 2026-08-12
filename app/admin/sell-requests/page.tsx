import { createAdminClient } from '@/lib/supabase/admin';
import { Mail, Phone, Tag, User, Car, ShieldAlert } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

async function getSellRequests() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('sell_requests')
    .select('*')
    .order('created_at', { ascending: false });

  return data || [];
}

export default async function AdminSellRequestsPage() {
  const requests = await getSellRequests();

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-neutral-900">Sell Requests</h1>
        <p className="text-neutral-500 text-sm mt-0.5">{requests.length} sell request{requests.length !== 1 ? 's' : ''} total</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Owner Details</th>
                <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Vehicle Specs</th>
                <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Condition & History</th>
                <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Expected Price</th>
                <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-400 font-light">
                    No sell requests received yet.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-4 text-neutral-500 whitespace-nowrap">
                      {new Date(req.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-neutral-800 flex items-center gap-1.5">
                        <User size={12} className="text-neutral-400" />
                        {req.owner_name}
                      </div>
                      <div className="text-neutral-500 mt-1 flex flex-col gap-1">
                        <span className="flex items-center gap-1">
                          <Phone size={10} /> +91 {req.owner_phone}
                        </span>
                        {req.owner_email && (
                          <span className="flex items-center gap-1">
                            <Mail size={10} /> {req.owner_email}
                          </span>
                        )}
                        <span className="text-neutral-400 text-[10px]">
                          City: {req.owner_city}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-neutral-800 flex items-center gap-1.5">
                        <Car size={13} className="text-neutral-400" />
                        {req.manufacturing_year} {req.make} {req.model}
                      </div>
                      {req.variant && (
                        <div className="text-neutral-400 text-[10px] mt-0.5">
                          Variant: {req.variant}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="text-neutral-700">
                        {req.fuel_type} • {req.transmission}
                      </div>
                      <div className="text-neutral-500 mt-1">
                        KMs: {req.kms_driven?.toLocaleString('en-IN')} km • {req.number_of_owners} Owner{req.number_of_owners !== 1 ? 's' : ''}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap font-bold text-neutral-800">
                      {req.expected_price ? (
                        <span className="flex items-center gap-1">
                          <Tag size={12} className="text-amber-500" />
                          {formatPrice(req.expected_price)}
                        </span>
                      ) : (
                        <span className="text-neutral-300 font-light italic">Not specified</span>
                      )}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-50 text-neutral-600 border border-neutral-200">
                        {req.status || 'Pending'}
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
