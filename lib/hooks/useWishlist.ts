'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../supabase/client';

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  // Load user and wishlist items
  useEffect(() => {
    const fetchUserAndWishlist = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await loadWishlist(session.user.id);
      } else {
        setUser(null);
        setWishlistItems([]);
      }
    };

    fetchUserAndWishlist();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await loadWishlist(session.user.id);
      } else {
        setUser(null);
        setWishlistItems([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadWishlist = async (userId: string) => {
    try {
      // Find wishlist using array select to avoid PGRST116 single-row errors
      let { data: wishlists, error: wError } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', userId);

      let wishlistId = wishlists && wishlists[0]?.id;

      if (!wishlistId) {
        // Wishlist does not exist, create one
        const { data: newW, error: cError } = await supabase
          .from('wishlists')
          .insert({ user_id: userId })
          .select('id')
          .single();
        
        if (newW) wishlistId = newW.id;
      }

      if (wishlistId) {
        const { data: items } = await supabase
          .from('wishlist_items')
          .select('vehicle_id')
          .eq('wishlist_id', wishlistId);

        if (items) {
          setWishlistItems(items.map((i) => i.vehicle_id));
        }
      }
    } catch (e) {
      console.error('Error loading wishlist:', e);
    }
  };

  const isWishlisted = (vehicleId: string) => {
    return wishlistItems.includes(vehicleId);
  };

  const toggleWishlist = async (vehicleId: string) => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      // Find wishlist
      let { data: wishlists } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id);

      let wishlistId = wishlists && wishlists[0]?.id;

      if (!wishlistId) {
        // Create one
        const { data: newW } = await supabase
          .from('wishlists')
          .insert({ user_id: user.id })
          .select('id')
          .single();
        if (newW) wishlistId = newW.id;
      }

      if (wishlistId) {
        if (isWishlisted(vehicleId)) {
          // Remove from wishlist
          const { error } = await supabase
            .from('wishlist_items')
            .delete()
            .eq('wishlist_id', wishlistId)
            .eq('vehicle_id', vehicleId);

          if (!error) {
            setWishlistItems((prev) => prev.filter((id) => id !== vehicleId));
          }
        } else {
          // Add to wishlist
          const { error } = await supabase
            .from('wishlist_items')
            .insert({
              wishlist_id: wishlistId,
              vehicle_id: vehicleId,
            });

          if (!error) {
            setWishlistItems((prev) => [...prev, vehicleId]);
          }
        }
      }
    } catch (e) {
      console.error('Error toggling wishlist:', e);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    wishlistItems,
    isWishlisted,
    toggleWishlist,
    loading,
  };
}
