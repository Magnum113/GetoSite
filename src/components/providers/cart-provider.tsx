"use client";

import { createContext, useContext, useState, useSyncExternalStore } from "react";
import type { CartItem } from "@/types/store";

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  subtotal: number;
  totalItems: number;
  addItem: (item: Omit<CartItem, "cartKey" | "quantity"> & { quantity?: number }) => void;
  removeItem: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const STORAGE_KEY = "geto-store-cart";
const CartContext = createContext<CartContextValue | null>(null);

function readCartSnapshot() {
  if (typeof window === "undefined") {
    return "[]";
  }

  return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
}

function parseCartItems(snapshot: string) {
  try {
    return JSON.parse(snapshot) as CartItem[];
  } catch {
    return [];
  }
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleChange = () => onStoreChange();
  window.addEventListener("storage", handleChange);
  window.addEventListener("cart-storage", handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener("cart-storage", handleChange);
  };
}

function writeCartItems(items: CartItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-storage"));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, readCartSnapshot, () => "[]");
  const items = parseCartItems(snapshot);
  const [isOpen, setIsOpen] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const addItem: CartContextValue["addItem"] = (item) => {
    const cartKey = `${item.productId}:${item.variantId}`;
    const quantity = item.quantity ?? 1;
    const existing = items.find((currentItem) => currentItem.cartKey === cartKey);

    if (existing) {
      writeCartItems(
        items.map((currentItem) =>
          currentItem.cartKey === cartKey
            ? { ...currentItem, quantity: currentItem.quantity + quantity }
            : currentItem
        )
      );
    } else {
      writeCartItems([...items, { ...item, cartKey, quantity }]);
    }

    setIsOpen(true);
  };

  const removeItem = (cartKey: string) => {
    writeCartItems(items.filter((item) => item.cartKey !== cartKey));
  };

  const updateQuantity = (cartKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartKey);
      return;
    }

    writeCartItems(
      items.map((item) => (item.cartKey === cartKey ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    writeCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        subtotal,
        totalItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
