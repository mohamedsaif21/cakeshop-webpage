import { calculateOrderTotal, clampQuantity } from "./whatsapp";

export const isProductAvailable = (product) => Boolean(product) && product.status !== "soldout";

export const cartItemKey = (productId, portionLabel) => `${productId}::${portionLabel}`;

export const createCartItem = (product, portionIndex, quantity) => {
  if (!isProductAvailable(product)) return null;

  const portion = product.portions?.[portionIndex];
  const unitPrice = Number(portion?.price);
  if (!portion || !Number.isFinite(unitPrice) || unitPrice <= 0) return null;

  return {
    key: cartItemKey(product.id, portion.label),
    id: product.id,
    name: product.name,
    title: product.title,
    size: portion.short || portion.label,
    label: portion.label,
    pieces: portion.pcs,
    unitPrice,
    quantity: clampQuantity(quantity),
  };
};

export const addCartItem = (items, item) => {
  if (!item) return { items, limited: false };

  const quantity = clampQuantity(item.quantity);
  const normalizedItem = { ...item, quantity };
  const existing = items.find((entry) => entry.key === item.key);
  if (!existing) {
    return { items: [...items, normalizedItem], limited: false };
  }

  const combined = existing.quantity + quantity;
  const nextQuantity = clampQuantity(combined);

  return {
    items: items.map((entry) => (entry.key === item.key ? { ...entry, quantity: nextQuantity } : entry)),
    limited: combined > nextQuantity,
  };
};

export const updateCartQuantity = (items, key, quantity) =>
  items.map((item) => (item.key === key ? { ...item, quantity: clampQuantity(quantity) } : item));

export const removeCartItem = (items, key) => items.filter((item) => item.key !== key);

export const getCartSummary = (items) =>
  items.reduce(
    (summary, item) => {
      const quantity = clampQuantity(item.quantity);
      return {
        count: summary.count + quantity,
        total: summary.total + calculateOrderTotal(item.unitPrice, quantity),
      };
    },
    { count: 0, total: 0 }
  );
