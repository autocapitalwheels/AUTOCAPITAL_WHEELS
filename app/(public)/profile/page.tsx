'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useWishlist } from '@/lib/hooks/useWishlist';
import VehicleCard from '@/components/public/VehicleCard';
import { Loader2, Heart, User, LogOut, Phone, Mail, Award } from 'lucide-react';
import Link from 'next/link';

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  const supabase = createClient();
  const { user, wishlistItems, toggleWishlist, loading: wLoading } = useWishlist();
  
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [userProfile, setUserProfile] = useState<any>({ name: '', email: '', phone: '' });

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUserProfile({
          name: session.user.user_metadata?.full_name || 'Valued Customer',
          email: session.user.email || '',
          phone: session.user.user_metadata?.phone || 'Not Added',
        });
      }
    };
    checkSession();
  }, [router, supabase.auth]);

  // Load vehicles in wishlist
  useEffect(() => {
    const loadWishlistVehicles = async () => {
      if (wishlistItems.length === 0) {
        setVehicles([]);
        return;
      }

      setLoadingVehicles(true);
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .in('id', wishlistItems);

        if (error) {
          console.error('Error loading wishlist vehicles query:', error);
        }

        if (data) {
          setVehicles(data);
        }
      } catch (e) {
        console.error('Error loading wishlist vehicles:', e);
      } finally {
        setLoadingVehicles(false);
      }
    };

    if (user && activeTab === 'wishlist') {
      loadWishlistVehicles();
    }
  }, [user, wishlistItems, activeTab, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#faf9f6]/30 flex items-center justify-center p-6 pt-24">
        <Loader2 className="animate-spin text-amber-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6]/30 pt-24 pb-16">
      <div className="container-custom max-w-5xl px-4">
        
        {/* Profile Header Card */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 font-display font-black text-2xl">
              {userProfile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-display font-bold text-xl sm:text-2xl text-neutral-900">{userProfile.name}</h1>
              <p className="text-xs text-neutral-400 mt-0.5 tracking-wider uppercase font-semibold">AutoCapital Member</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 border border-neutral-200 hover:bg-neutral-50 px-4 py-2 rounded-lg text-xs font-bold text-neutral-700 tracking-wider transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            LOG OUT
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b border-neutral-200 pb-px">
          <button
            onClick={() => router.push('/profile?tab=profile')}
            className={`pb-3 text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'profile' ? 'text-neutral-950 border-b-2 border-amber-500' : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <User size={13} />
            My Profile
          </button>
          <button
            onClick={() => router.push('/profile?tab=wishlist')}
            className={`pb-3 text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'wishlist' ? 'text-neutral-950 border-b-2 border-amber-500' : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <Heart size={13} className={activeTab === 'wishlist' ? 'fill-neutral-950' : ''} />
            My Wishlist ({wishlistItems.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' ? (
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm max-w-2xl">
            <h2 className="font-display font-bold text-lg text-neutral-900 border-b border-neutral-100 pb-3">Personal Information</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">Full Name</span>
                <div className="flex items-center gap-2.5 text-neutral-700">
                  <User size={16} className="text-neutral-400" />
                  <span className="text-sm font-medium">{userProfile.name}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">Email Address</span>
                <div className="flex items-center gap-2.5 text-neutral-700">
                  <Mail size={16} className="text-neutral-400" />
                  <span className="text-sm font-medium">{userProfile.email}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">Mobile Number</span>
                <div className="flex items-center gap-2.5 text-neutral-700">
                  <Phone size={16} className="text-neutral-400" />
                  <span className="text-sm font-medium">{userProfile.phone}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">Member Status</span>
                <div className="flex items-center gap-2.5 text-amber-600">
                  <Award size={16} />
                  <span className="text-sm font-semibold">Premium Member</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Wishlist Grid */
          <div>
            {loadingVehicles ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-amber-500" size={32} />
              </div>
            ) : vehicles.length === 0 ? (
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-10 text-center shadow-sm">
                <Heart className="mx-auto text-neutral-300 mb-4" size={40} />
                <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Your Wishlist is Empty</h3>
                <p className="text-sm text-neutral-500 font-light max-w-sm mx-auto mb-6">
                  Browse our premium inventory and click the heart icon on any vehicle to save it to your wishlist.
                </p>
                <Link href="/cars" className="btn-primary py-2.5 px-6 text-sm inline-flex">
                  Browse Inventory
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {vehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    isWishlisted={true}
                    onWishlistToggle={toggleWishlist}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

import { Suspense } from 'react';

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#faf9f6]/30 flex items-center justify-center p-6 pt-24">
        <Loader2 className="animate-spin text-amber-500" size={32} />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
