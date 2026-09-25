import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WishlistContext = createContext();

const STORAGE_KEY = 'smartbuy_wishlist';

/**
 * Client-side wishlist using localStorage.
 * No backend, no login required — purely local bookmarking.
 */
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage whenever wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch {
      // Ignore storage errors
    }
  }, [wishlist]);

  const isWishlisted = useCallback(
    (productId) => wishlist.includes(productId),
    [wishlist]
  );

  const toggleWishlist = useCallback((productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  const syncWithValidProducts = useCallback((validProducts = []) => {
    if (!validProducts || validProducts.length === 0) return;
    const validIdSet = new Set(validProducts.map((p) => p.id));
    setWishlist((prev) => {
      const filtered = prev.filter((id) => validIdSet.has(id));
      return filtered.length !== prev.length ? filtered : prev;
    });
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isWishlisted,
        toggleWishlist,
        clearWishlist,
        syncWithValidProducts,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
