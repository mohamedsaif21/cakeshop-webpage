export const PHONE = "919043569743";
export const EMAIL = "shafasdesserthouse28@gmail.com";

export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 30;

export const waLink = (text) =>
  text ? `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}` : `https://wa.me/${PHONE}`;

export const openWhatsApp = (text) => window.open(waLink(text), "_blank", "noopener");

export const formatPrice = (amount) => {
  const value = Number(amount);
  return `₹${(Number.isFinite(value) ? value : 0).toLocaleString("en-IN")}`;
};

export const clampQuantity = (value) => {
  const quantity = Math.floor(Number(value));
  if (!Number.isFinite(quantity)) return MIN_QUANTITY;
  return Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, quantity));
};

export const calculateOrderTotal = (unitPrice, quantity) =>
  Number(unitPrice) * clampQuantity(quantity);

export const buildProductOrderMessage = ({ itemName, size, pieces, quantity, unitPrice, total }) =>
  [
    "Hi Shafa's Dessert House! I would like to place a pre-order:",
    `• Item: ${itemName}`,
    `• Size: ${size}`,
    `• Pieces: ${pieces}`,
    `• Quantity: ${quantity}`,
    `• Unit price: ${unitPrice}`,
    `• Total: ${total}`,
    "",
    "Please confirm availability and the earliest baking date.",
  ].join("\n");

export const buildCartOrderMessage = (items = []) => {
  const lines = ["Hi Shafa's Dessert House! I would like to review this pre-order:", ""];

  items.forEach((item, index) => {
    const quantity = clampQuantity(item.quantity);
    lines.push(`${index + 1}. ${item.name}`);
    lines.push(`   • Box size: ${item.size}`);
    lines.push(`   • Pieces: ${item.pieces}`);
    lines.push(`   • Quantity: ${quantity}`);
    lines.push(`   • Unit price: ${formatPrice(item.unitPrice)}`);
    lines.push(`   • Subtotal: ${formatPrice(calculateOrderTotal(item.unitPrice, quantity))}`);
    if (index < items.length - 1) lines.push("");
  });

  const total = items.reduce(
    (sum, item) => sum + calculateOrderTotal(item.unitPrice, clampQuantity(item.quantity)),
    0
  );

  lines.push("", `Order total: ${formatPrice(total)}`, "", "Please confirm availability and the earliest baking date.");
  return lines.join("\n");
};

export const orderItem = (itemName, portion, price) =>
  openWhatsApp(
    `Hi Shafa's Dessert House! I would like to pre-order:\n• Item: ${itemName}\n• Portion: ${portion}\n• Price: ${price}\n\nPlease let me know your earliest baking availability.`
  );
