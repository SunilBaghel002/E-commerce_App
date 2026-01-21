// Wishlist slice - Redux state management for wishlist
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, WishlistItem } from '../../types';

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
}

const initialState: WishlistState = {
  items: [],
  isLoading: false,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<Product>) => {
      const exists = state.items.some(item => item.product.id === action.payload.id);
      if (!exists) {
        state.items.push({
          id: `wl-${action.payload.id}`,
          product: action.payload,
          addedAt: new Date().toISOString(),
        });
      }
    },
    
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.product.id !== action.payload);
    },
    
    clearWishlist: (state) => {
      state.items = [];
    },
    
    setWishlistLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  setWishlistLoading,
} = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state: { wishlist: WishlistState }) => state.wishlist.items;
export const selectWishlistCount = (state: { wishlist: WishlistState }) => state.wishlist.items.length;
export const selectIsInWishlist = (productId: string) => (state: { wishlist: WishlistState }) =>
  state.wishlist.items.some(item => item.product.id === productId);

export default wishlistSlice.reducer;
