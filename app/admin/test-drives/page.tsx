'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Mail, Phone, Calendar, User, MapPin, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function AdminTestDrivesPage() {
  const [testDrives, setTestDrives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  const supabase = createClient();

  const loadTestDrives = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('test_drive_requests')
        .select(`
          *,
          vehicles(make, model, variant, year, price)
        `)
        .order('created_at', { ascending: false });

      if (data) setTestDrives(data);
      if (error) console.error(error);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestDrives();
  }, []);

  const handleUpdate = async (id: string, updates: { status: string; admin_notes: string }) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from('test_drive_requests')
        .update({
          status: updates.status,
          admin_notes: updates.admin_notes || null,
        })
        .eq('id', id);

      if (error) {
        alert('Failed to update status: ' + error.message);
      } else {
        // Reload list
        await loadTestDrives();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Format date helper
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-neutral-900">Test Drive Bookings</h1>
        <p className="text-neutral-500 text-sm mt-0.5">{testDrives.length} total test drive request{testDrives.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-amber-500" size={32} />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Requested Date</th>
                  <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Customer Info</th>
                  <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Vehicle Details</th>
                  <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Booking Slot</th>
                  <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Dealer Notes / Feedback</th>
                  <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {testDrives.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-neutral-400 font-light">
                      No test drive requests received yet.
                    </td>
                  </tr>
                ) : (
                  testDrives.map((td) => {
                    const car = td.vehicles || td.vehicle_snapshot || {};
                    return (
                      <tr key={td.id} className="hover:bg-neutral-50/30 transition-colors align-top">
                        
                        {/* Booking Date */}
                        <td className="p-4 text-neutral-600 font-medium whitespace-nowrap">
                          {formatDate(td.preferred_date)}
                          <div className="text-[10px] text-neutral-400 mt-1">Booked: {formatDate(td.created_at)}</div>
                        </td>

                        {/* Customer */}
                        <td className="p-4">
                          <div className="font-bold text-neutral-800 flex items-center gap-1.5">
                            <User size={12} className="text-neutral-400" />
                            {td.customer_name}
                          </div>
                          <div className="text-neutral-500 mt-1.5 flex flex-col gap-1">
                            <span className="flex items-center gap-1">
                              <Phone size={10} /> +91 {td.customer_phone}
                            </span>
                            {td.customer_email && (
                              <span className="flex items-center gap-1">
                                <Mail size={10} /> {td.customer_email}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <MapPin size={10} /> {td.location || 'N/A'}
                            </span>
                          </div>
                        </td>

                        {/* Vehicle */}
                        <td className="p-4">
                          {car.make ? (
                            <div>
                              <div className="font-bold text-neutral-800">
                                {car.year} {car.make} {car.model}
                              </div>
                              <div className="text-[10px] text-neutral-400 mt-1">
                                {car.variant} • {car.price ? `₹${(car.price / 100000).toFixed(2)} Lakh` : ''}
                              </div>
                              <div className="text-[9px] text-neutral-500 mt-1 font-mono uppercase">#{td.request_id}</div>
                            </div>
                          ) : (
                            <span className="text-neutral-400 italic">Unknown Vehicle</span>
                          )}
                        </td>

                        {/* Booking Slot */}
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 font-semibold text-neutral-700">
                            <Clock size={11} className="text-neutral-400" />
                            {td.preferred_time || 'Any Time'}
                          </div>
                          {td.message && (
                            <div className="text-[10px] text-neutral-400 mt-2 bg-neutral-50 p-2 rounded border border-neutral-100 max-w-[200px] break-words">
                              {td.message}
                            </div>
                          )}
                        </td>

                        {/* Dealer Notes Input */}
                        <td className="p-4">
                          <textarea
                            defaultValue={td.admin_notes || ''}
                            placeholder="Add approval slot or rejection reason..."
                            className="w-full form-input text-xs p-2 border border-neutral-200 rounded resize-y max-w-[220px]"
                            id={`notes-input-${td.id}`}
                            rows={2}
                          />
                        </td>

                        {/* Status Select Actions */}
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex flex-col gap-2">
                            <select
                              defaultValue={td.status}
                              className="form-input text-xs py-1.5 px-2.5 max-w-[130px] cursor-pointer font-semibold"
                              id={`status-select-${td.id}`}
                            >
                              <option value="NEW">Pending Review</option>
                              <option value="CONFIRMED">Confirm Slot</option>
                              <option value="CANCELLED">Cancel / Reject</option>
                              <option value="COMPLETED">Completed</option>
                              <option value="RESCHEDULED">Rescheduled</option>
                            </select>
                            
                            <button
                              disabled={updatingId === td.id}
                              onClick={() => {
                                const selectEl = document.getElementById(`status-select-${td.id}`) as HTMLSelectElement;
                                const notesEl = document.getElementById(`notes-input-${td.id}`) as HTMLTextAreaElement;
                                handleUpdate(td.id, {
                                  status: selectEl.value,
                                  admin_notes: notesEl.value,
                                });
                              }}
                              className="inline-flex items-center justify-center gap-1 bg-[#171717] hover:bg-neutral-800 text-white font-bold px-3 py-1.5 rounded text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                            >
                              {updatingId === td.id ? (
                                <Loader2 className="animate-spin" size={10} />
                              ) : (
                                'Save Action'
                              )}
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
