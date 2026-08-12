import { createAdminClient } from '@/lib/supabase/admin';
import { Mail, Phone, Calendar, User } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getTestDrives() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('enquiries')
    .select(`
      id, customer_name, customer_phone, customer_email, customer_city,
      message, preferred_contact, preferred_time, test_drive_requested,
      status, created_at,
      vehicles(make, model, variant, year, price)
    `)
    .eq('test_drive_requested', true)
    .order('created_at', { ascending: false });

  return data || [];
}

export default async function AdminTestDrivesPage() {
  const testDrives = await getTestDrives();

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-neutral-900">Test Drive Requests</h1>
        <p className="text-neutral-500 text-sm mt-0.5">{testDrives.length} test drive booking{testDrives.length !== 1 ? 's' : ''} total</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Customer</th>
                <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Requested Vehicle</th>
                <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Message & Notes</th>
                <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Preferred Timing</th>
                <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs">
              {testDrives.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-400 font-light">
                    No test drive bookings received yet.
                  </td>
                </tr>
              ) : (
                testDrives.map((enq) => {
                  const car = enq.vehicles as any;
                  return (
                    <tr key={enq.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="p-4 text-neutral-500 whitespace-nowrap">
                        {new Date(enq.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-neutral-800 flex items-center gap-1.5">
                          <User size={12} className="text-neutral-400" />
                          {enq.customer_name}
                        </div>
                        <div className="text-neutral-500 mt-1 flex flex-col gap-1">
                          <span className="flex items-center gap-1">
                            <Phone size={10} /> +91 {enq.customer_phone}
                          </span>
                          {enq.customer_email && (
                            <span className="flex items-center gap-1">
                              <Mail size={10} /> {enq.customer_email}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        {car ? (
                          <div>
                            <div className="font-bold text-neutral-800">
                              {car.year} {car.make} {car.model}
                            </div>
                            <div className="text-[10px] text-neutral-400 mt-0.5">
                              {car.variant} • ₹{(car.price / 100000).toFixed(2)} Lakh
                            </div>
                          </div>
                        ) : (
                          <span className="text-neutral-400 font-light italic">General Interest</span>
                        )}
                      </td>
                      <td className="p-4 max-w-[250px] break-words text-neutral-600 leading-relaxed font-light">
                        {enq.message || <span className="text-neutral-300 italic">No notes left</span>}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="font-medium text-neutral-700">
                          {enq.preferred_contact}
                        </div>
                        {enq.preferred_time && (
                          <div className="text-[10px] text-neutral-400 mt-0.5 flex items-center gap-0.5">
                            <Calendar size={9} /> {enq.preferred_time}
                          </div>
                        )}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Pending Review
                        </span>
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
