"use client";

import { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  mangoId: number;
  mangoName: string;
  boxType: "dozen" | "5kg";
  size: string | null;
  price: number;
  quantity: number;
  variantLabel: string;
}

function cartKey(item: { mangoId: number; boxType: string; size: string | null }): string {
  return `${item.mangoId}-${item.boxType}-${item.size ?? "none"}`;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("skf_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Backward compat: migrate old cart items that lack boxType
        const migrated = parsed.map((item: Record<string, unknown>) => ({
          ...item,
          boxType: item.boxType ?? "dozen",
          size: item.size ?? null,
          variantLabel: item.variantLabel ?? "1 Dozen",
        }));
        setItems(migrated);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("skf_cart", JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    const key = cartKey(item);
    setItems((prev) => {
      const existing = prev.find((i) => cartKey(i) === key);
      if (existing) {
        return prev.map((i) =>
          cartKey(i) === key
            ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
            : i
        );
      }
      return [...prev, { ...item, quantity: item.quantity ?? 1 }];
    });
  };

  const removeItem = (key: string) =>
    setItems((prev) => prev.filter((i) => cartKey(i) !== key));

  const updateQuantity = (key: string, qty: number) => {
    if (qty <= 0) { removeItem(key); return; }
    setItems((prev) =>
      prev.map((i) => (cartKey(i) === key ? { ...i, quantity: qty } : i))
    );
  };

  const clearCart = () => setItems([]);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export { cartKey };
