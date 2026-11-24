"use client";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useUI } from "@/components/UIProvider";
import {
  addCartItem,
  createCartItem,
  getCartSummary,
  removeCartItem,
  updateCartQuantity,
} from "@/lib/cart";
import { MAX_QUANTITY } from "@/lib/whatsapp";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export default function CartProvider({ children }) {
  const { showToast } = useUI();
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const summary = useMemo(() => getCartSummary(items), [items]);

  const addProduct = useCallback(
    (product, portionIndex, quantity) => {
      const item = createCartItem(product, portionIndex, quantity);
      if (!item) {
        showToast("This treat is currently unavailable.");
        return;
      }

      const result = addCartItem(items, item);
      setItems(result.items);
      showToast(
        result.limited
          ? `Maximum ${MAX_QUANTITY} reached for this selection.`
          : `${item.name} added to your order.`
      );
    },
    [items, showToast]
  );

  const updateQuantity = useCallback((key, quantity) => {
    setItems((current) => updateCartQuantity(current, key, quantity));
  }, []);

  const removeItem = useCallback(
    (key) => {
      setItems((current) => removeCartItem(current, key));
      showToast("Removed from your order.");
    },
    [showToast]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setOpen(false);
    showToast("Your order has been cleared.");
  }, [showToast]);

  const openCart = useCallback(() => setOpen(true), []);
  const closeCart = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({
      items,
      count: summary.count,
      total: summary.total,
      open,
      openCart,
      closeCart,
      addProduct,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [
      items,
      summary.count,
      summary.total,
      open,
      openCart,
      closeCart,
      addProduct,
      updateQuantity,
      removeItem,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
