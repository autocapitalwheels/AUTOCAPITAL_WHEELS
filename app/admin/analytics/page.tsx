import { createAdminClient } from '@/lib/supabase/admin';
import { BarChart3, Eye, MessageSquare, TrendingUp, TrendingDown } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getAnalyticsData() {
  const supabase = createAdminClient();
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('id, make, model, year, price, view_count, enquiry_count')
    .order('view_count', { ascending: false });

  return vehicles || [];
}

export default async function AdminAnalyticsPage() {
  const vehicles = await getAnalyticsData();
  
  const totalViews = vehicles.reduce((sum, v) => sum + (v.view_count || 0), 0);
  const totalEnquiries = vehicles.reduce((sum, v) => sum + (v.enquiry_count || 0), 0);
  const averageEnquiryRate = totalViews > 0 ? ((totalEnquiries / totalViews) * 100).toFixed(1) : '0';

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center gap-2">
        <BarChart3 className="text-amber-500" size={24} />
        <div>
          <h1 className="font-display font-bold text-2xl text-neutral-900">Analytics</h1>
          <p className="text-neutral-500 text-sm mt-0.5">Inventory page views and engagement performance</p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between">
          <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Total Views</div>
          <div className="text-3xl font-extrabold text-neutral-900 mt-2 flex items-baseline gap-2">
            {totalViews.toLocaleString('en-IN')}
            <span className="text-[10px] text-green-600 font-bold flex items-center gap-0.5">
              <TrendingUp size={10} /> +12%
            </span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between">
          <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Total Enquiries</div>
          <div className="text-3xl font-extrabold text-neutral-900 mt-2 flex items-baseline gap-2">
            {totalEnquiries.toLocaleString('en-IN')}
            <span className="text-[10px] text-green-600 font-bold flex items-center gap-0.5">
              <TrendingUp size={10} /> +8%
            </span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between">
          <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Conversion Rate</div>
          <div className="text-3xl font-extrabold text-neutral-900 mt-2 flex items-baseline gap-2">
            {averageEnquiryRate}%
            <span className="text-[10px] text-neutral-400 font-light">views to leads</span>
          </div>
        </div>
      </div>

      {/* Vehicle Performance Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-neutral-100 bg-neutral-50/50">
          <h2 className="font-bold text-neutral-800 text-sm">Vehicle Performance Leaderboard</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Vehicle</th>
                <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider text-center">Views</th>
                <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider text-center">Enquiries</th>
                <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider text-center">Enquiry Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs text-neutral-600">
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-neutral-400 font-light">
                    No vehicles listed in inventory to measure.
                  </td>
                </tr>
              ) : (
                vehicles.map((v) => {
                  const rate = v.view_count > 0 ? ((v.enquiry_count / v.view_count) * 100).toFixed(1) : '0';
                  return (
                    <tr key={v.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="p-4 font-bold text-neutral-800">
                        {v.year} {v.make} {v.model}
                      </td>
                      <td className="p-4 text-center font-semibold text-neutral-800">
                        <span className="inline-flex items-center gap-1">
                          <Eye size={12} className="text-neutral-400" />
                          {v.view_count || 0}
                        </span>
                      </td>
                      <td className="p-4 text-center font-semibold text-neutral-800">
                        <span className="inline-flex items-center gap-1">
                          <MessageSquare size={12} className="text-neutral-400" />
                          {v.enquiry_count || 0}
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold text-neutral-700">
                        {rate}%
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
