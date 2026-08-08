"use client";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { cartLineId, type CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  toastItem: CartItem | null;
}

const STORAGE_KEY = "zc-cart";

function normalizeItem(raw: CartItem): CartItem {
  const widthCm = raw.widthCm ?? null;
  const heightCm = raw.heightCm ?? null;
  const color = raw.color ?? null;
  const optionsNote = raw.optionsNote ?? null;
  return {
    ...raw,
    widthCm,
    heightCm,
    color,
    optionsNote,
    lineId:
      raw.lineId ||
      cartLineId({
        productId: raw.productId,
        widthCm,
        heightCm,
        color,
        optionsNote,
      }),
  };
}

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as CartItem[];
    return parsed.map(normalizeItem);
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  toastItem: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart: (state) => {
      state.items = loadCart();
    },
    addToCart: (state, action: PayloadAction<Omit<CartItem, "lineId"> & { lineId?: string }>) => {
      const item = normalizeItem(action.payload as CartItem);
      const existing = state.items.find((i) => i.lineId === item.lineId);
      if (existing) {
        existing.quantity += item.quantity;
        state.toastItem = { ...existing };
      } else {
        state.items.push(item);
        state.toastItem = item;
      }
      saveCart(state.items);
      // Do not auto-open drawer — toast handles feedback
    },
    clearCartToast: (state) => {
      state.toastItem = null;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.lineId !== action.payload);
      saveCart(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ lineId: string; quantity: number }>
    ) => {
      const item = state.items.find((i) => i.lineId === action.payload.lineId);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(
            (i) => i.lineId !== action.payload.lineId
          );
        } else {
          item.quantity = action.payload.quantity;
        }
        saveCart(state.items);
      }
    },
    updateLineOptions: (
      state,
      action: PayloadAction<{
        lineId: string;
        widthCm?: number | null;
        heightCm?: number | null;
        color?: string | null;
      }>
    ) => {
      const item = state.items.find((i) => i.lineId === action.payload.lineId);
      if (!item) return;
      item.widthCm = action.payload.widthCm ?? null;
      item.heightCm = action.payload.heightCm ?? null;
      item.color = action.payload.color ?? null;
      item.lineId = cartLineId(item);
      saveCart(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCart(state.items);
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const {
  hydrateCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  updateLineOptions,
  clearCart,
  clearCartToast,
  toggleCart,
  setCartOpen,
} = cartSlice.actions;

export default cartSlice.reducer;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const selectCartOpen = (state: { cart: CartState }) => state.cart.isOpen;
export const selectCartToast = (state: { cart: CartState }) => state.cart.toastItem;
