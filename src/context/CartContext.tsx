"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { cartLineId, type CartItem } from "@/types";

const STORAGE_KEY = "zc-cart";

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  toastItem: CartItem | null;
  hydrated: boolean;
};

type AddPayload = Omit<CartItem, "lineId"> & { lineId?: string };

type CartAction =
  | { type: "HYDRATE"; items: CartItem[] }
  | { type: "ADD"; item: AddPayload }
  | { type: "CLEAR_TOAST" }
  | { type: "REMOVE"; lineId: string }
  | { type: "UPDATE_QTY"; lineId: string; quantity: number }
  | {
      type: "UPDATE_OPTS";
      lineId: string;
      widthCm?: number | null;
      heightCm?: number | null;
      color?: string | null;
    }
  | { type: "CLEAR" }
  | { type: "TOGGLE" }
  | { type: "SET_OPEN"; open: boolean };

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

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, items: action.items, hydrated: true };
    case "ADD": {
      const item = normalizeItem(action.item as CartItem);
      const existing = state.items.find((i) => i.lineId === item.lineId);
      let items: CartItem[];
      let toastItem: CartItem;
      if (existing) {
        items = state.items.map((i) =>
          i.lineId === item.lineId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
        toastItem = {
          ...existing,
          quantity: existing.quantity + item.quantity,
        };
      } else {
        items = [...state.items, item];
        toastItem = item;
      }
      saveCart(items);
      return { ...state, items, toastItem };
    }
    case "CLEAR_TOAST":
      return { ...state, toastItem: null };
    case "REMOVE": {
      const items = state.items.filter((i) => i.lineId !== action.lineId);
      saveCart(items);
      return { ...state, items };
    }
    case "UPDATE_QTY": {
      let items: CartItem[];
      if (action.quantity <= 0) {
        items = state.items.filter((i) => i.lineId !== action.lineId);
      } else {
        items = state.items.map((i) =>
          i.lineId === action.lineId ? { ...i, quantity: action.quantity } : i
        );
      }
      saveCart(items);
      return { ...state, items };
    }
    case "UPDATE_OPTS": {
      const items = state.items.map((i) => {
        if (i.lineId !== action.lineId) return i;
        const next = {
          ...i,
          widthCm: action.widthCm ?? null,
          heightCm: action.heightCm ?? null,
          color: action.color ?? null,
        };
        return { ...next, lineId: cartLineId(next) };
      });
      saveCart(items);
      return { ...state, items };
    }
    case "CLEAR":
      saveCart([]);
      return { ...state, items: [] };
    case "TOGGLE":
      return { ...state, isOpen: !state.isOpen };
    case "SET_OPEN":
      return { ...state, isOpen: action.open };
    default:
      return state;
  }
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  toastItem: null,
  hydrated: false,
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  toastItem: CartItem | null;
  count: number;
  total: number;
  addToCart: (item: AddPayload) => void;
  removeFromCart: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  updateLineOptions: (input: {
    lineId: string;
    widthCm?: number | null;
    heightCm?: number | null;
    color?: string | null;
  }) => void;
  clearCart: () => void;
  clearCartToast: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    dispatch({ type: "HYDRATE", items: loadCart() });
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = state.items.reduce((n, i) => n + i.quantity, 0);
    const total = state.items.reduce((n, i) => n + i.price * i.quantity, 0);
    return {
      items: state.items,
      isOpen: state.isOpen,
      toastItem: state.toastItem,
      count,
      total,
      addToCart: (item) => dispatch({ type: "ADD", item }),
      removeFromCart: (lineId) => dispatch({ type: "REMOVE", lineId }),
      updateQuantity: (lineId, quantity) =>
        dispatch({ type: "UPDATE_QTY", lineId, quantity }),
      updateLineOptions: (input) =>
        dispatch({ type: "UPDATE_OPTS", ...input }),
      clearCart: () => dispatch({ type: "CLEAR" }),
      clearCartToast: () => dispatch({ type: "CLEAR_TOAST" }),
      toggleCart: () => dispatch({ type: "TOGGLE" }),
      setCartOpen: (open) => dispatch({ type: "SET_OPEN", open }),
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
