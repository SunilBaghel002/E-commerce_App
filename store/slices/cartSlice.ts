// Cart slice - Redux state management for shopping cart
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product, ProductVariant } from '../../types';

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
  isLoading: boolean;
}

const initialState: CartState = {
  items: [],
  couponCode: null,
  couponDiscount: 0,
  isLoading: false,
};

interface AddToCartPayload {
  product: Product;
  quantity: number;
  selectedSize?: ProductVariant;
  selectedColor?: ProductVariant;
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
      const { product, quantity, selectedSize, selectedColor } = action.payload;
      
      // Check if item already exists with same variants
      const existingIndex = state.items.findIndex(
        item =>
          item.product.id === product.id &&
          item.selectedSize?.id === selectedSize?.id &&
          item.selectedColor?.id === selectedColor?.id
      );
      
      if (existingIndex >= 0) {
        // Update quantity
        state.items[existingIndex].quantity += quantity;
      } else {
        // Add new item
        state.items.push({
          id: `${product.id}-${Date.now()}`,
          product,
          quantity,
          selectedSize,
          selectedColor,
          addedAt: new Date().toISOString(),
        });
      }
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item && quantity > 0 && quantity <= 10) {
        item.quantity = quantity;
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.couponCode = null;
      state.couponDiscount = 0;
    },
    
    applyCoupon: (state, action: PayloadAction<{ code: string; discount: number }>) => {
      state.couponCode = action.payload.code;
      state.couponDiscount = action.payload.discount;
    },
    
    removeCoupon: (state) => {
      state.couponCode = null;
      state.couponDiscount = 0;
    },
    
    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  setCartLoading,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartItemCount = (state: { cart: CartState }) => 
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartSubtotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
export const selectCartTotal = (state: { cart: CartState }) => {
  const subtotal = selectCartSubtotal(state);
  return subtotal - state.cart.couponDiscount;
};

export default cartSlice.reducer;
