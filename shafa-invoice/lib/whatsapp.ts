import type { Invoice } from "./types";
import { SHOP } from "./shop";
import { inr, normalizePhone } from "./format";

export function invoiceMessage(inv: Invoice): string {
  return (
    `Hi ${inv.customer.name} 🧁\n` +
    `Thank you for ordering from ${SHOP.name}!\n\n` +
    `Invoice: ${inv.number}\n` +
    `Total: ${inr(inv.total)}\n\n` +
    `Your invoice PDF is attached.`
  );
}

export const whatsappLink = (phone: string, text: string) =>
  `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(text)}`;

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
