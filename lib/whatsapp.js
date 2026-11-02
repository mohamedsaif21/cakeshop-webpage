export const PHONE = "919043569743";
export const EMAIL = "shafasdesserthouse28@gmail.com";

export const waLink = (text) =>
  text ? `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}` : `https://wa.me/${PHONE}`;

export const openWhatsApp = (text) => window.open(waLink(text), "_blank", "noopener");

export const orderItem = (itemName, portion, price) =>
  openWhatsApp(
    `Hi Shafa's Dessert House! I would like to pre-order:\n• Item: ${itemName}\n• Portion: ${portion}\n• Price: ${price}\n\nPlease let me know your earliest baking availability.`
  );
