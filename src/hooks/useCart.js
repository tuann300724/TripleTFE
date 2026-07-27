import { useState, useEffect, useCallback } from "react";
import api from "../service/api";
import { useAuth } from "./useAuth";

export function useCart() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const { data: carts } = await api.get("/Carts");
      const userCart = carts.find((c) => c.userId === user.userId);
      if (!userCart) { setItems([]); return; }

      const cartItems = userCart.cartItems || [];
      if (cartItems.length === 0) { setItems([]); setLoading(false); return; }

      const enriched = await Promise.all(
        cartItems.map(async (item) => {
          try {
            const { data: variant } = await api.get(`/ProductVariants/${item.variantId}`);
            const { data: product } = await api.get(`/Products/${variant.productId}`);
            return { ...item, variant, product };
          } catch {
            return { ...item, variant: null, product: null };
          }
        })
      );
      setItems(enriched);
    } catch { setItems([]); } finally { setLoading(false); }
  }, [user]);

  const updateQuantity = useCallback(async (cartItemId, delta) => {
    setItems((prev) => {
      const item = prev.find((x) => x.cartItemId === cartItemId);
      if (!item) return prev;
      const qty = Math.max(1, item.quantity + delta);
      api.put(`/CartItems/${cartItemId}`, { cartId: item.cartId, variantId: item.variantId, quantity: qty }).catch(() => {});
      return prev.map((x) => (x.cartItemId === cartItemId ? { ...x, quantity: qty } : x));
    });
  }, []);

  const removeItem = useCallback(async (cartItemId) => {
    try {
      await api.delete(`/CartItems/${cartItemId}`);
      setItems((prev) => prev.filter((x) => x.cartItemId !== cartItemId));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch { /* */ }
  }, []);

  useEffect(() => {
    fetchCart();
    window.addEventListener("cartUpdated", fetchCart);
    return () => window.removeEventListener("cartUpdated", fetchCart);
  }, [fetchCart]);

  const subtotal = items.reduce((s, i) => s + (i.variant?.price || 0) * i.quantity, 0);

  return { items, loading, fetchCart, updateQuantity, removeItem, subtotal, count: items.length };
}
