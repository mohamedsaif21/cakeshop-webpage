import { SHOP } from "./shop";

export const inr = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

export const money = (n: number) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function normalizePhone(raw: string): string {
  const d = raw.replace(/\D/g, "");
  if (d.length === 10) return SHOP.defaultCountryCode + d;
  if (d.length === 11 && d.startsWith("0")) return SHOP.defaultCountryCode + d.slice(1);
  return d;
}

export const isValidPhone = (raw: string) => {
  const n = normalizePhone(raw);
  return n.length >= 11 && n.length <= 15;
};

const pad = (n: number) => String(n).padStart(2, "0");
export const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
export const prettyDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const KEY = "sdh-invoice-seq";
export function peekInvoiceNumber(): string {
  let n = 0;
  try { n = parseInt(localStorage.getItem(KEY) || "0", 10) || 0; } catch {}
  return `SDH-${String(n + 1).padStart(4, "0")}`;
}
export function commitInvoiceNumber() {
  try {
    const n = parseInt(localStorage.getItem(KEY) || "0", 10) || 0;
    localStorage.setItem(KEY, String(n + 1));
  } catch {}
}
