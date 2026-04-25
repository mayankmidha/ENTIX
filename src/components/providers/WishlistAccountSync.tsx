'use client';

import { useEffect } from 'react';
import { useWishlist } from '@/stores/wishlist-store';

export function WishlistAccountSync() {
  const syncAccount = useWishlist((state) => state.syncAccount);

  useEffect(() => {
    void syncAccount();
  }, [syncAccount]);

  return null;
}
