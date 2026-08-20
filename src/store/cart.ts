"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CART_STORAGE_KEY } from "@/lib/constants";
import type { CartItem } from "@/lib/types/cart";
import { toCartItem } from "@/lib/types/cart";
import type { Product } from "@/lib/types/product";

interface CartState {
  items: CartItem[];
  /** Add a product (or bump quantity if already present). */
  addItem: (product: Product, quantity?: number) => void;
  /** Remove a line item entirely. */
  removeItem: (id: number) => void;
  /** Set an exact quantity; a quantity of 0 or less removes the line. */
  updateQuantity: (id: number, quantity: number) => void;
  /** Empty the cart. */
  clear: () => void;
}

/**
 * The cart is the app's only piece of client state. Zustand gives us
 * selector-based subscriptions (so, e.g., the header badge re-renders only when
 * the count changes) and a `persist` middleware that transparently mirrors the
 * cart to localStorage — surviving reloads. See docs/adr/0002-cart-state.md.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            };
          }
          return { items: [...state.items, toCartItem(product, quantity)] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((item) => item.id !== id) };
          }
          return {
            items: state.items.map((item) =>
              item.id === id ? { ...item, quantity } : item,
            ),
          };
        }),

      clear: () => set({ items: [] }),
    }),
    {
      name: CART_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Persist only the data, never the action functions.
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

/** Total number of units across all line items. */
export const selectTotalItems = (items: CartItem[]): number =>
  items.reduce((total, item) => total + item.quantity, 0);

/** Total price across all line items. */
export const selectTotalPrice = (items: CartItem[]): number =>
  items.reduce((total, item) => total + item.price * item.quantity, 0);
