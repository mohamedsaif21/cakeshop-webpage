import type { Invoice } from "./types";
import { SHOP } from "./shop";
import { money, prettyDate } from "./format";

type RGB = [number, number, number];
const DARK: RGB = [77, 30, 1];
const MID: RGB = [149, 93, 29];
const GOLD: RGB = [204, 147, 65];
const CREAM: RGB = [255, 246, 232];
const LINE: RGB = [235, 217, 188];

async function toDataUrl(url: string): Promise<string> {
  const blob = await (await fetch(url)).blob();
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result as string);
    fr.onerror = rej;
    fr.readAsDataURL(blob);
  });
}

export async function buildInvoicePdf(inv: Invoice): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const W = 210, H = 297, M = 14;

  const fill = (c: RGB) => doc.setFillColor(c[0], c[1], c[2]);
  const color = (c: RGB) => doc.setTextColor(c[0], c[1], c[2]);
  const stroke = (c: RGB) => doc.setDrawColor(c[0], c[1], c[2]);
  const font = (style: "normal" | "bold", size: number) => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
  };

  let logo: string | null = null;
  try { logo = await toDataUrl(SHOP.logo); } catch {}

  color(DARK); font("bold", 17);
  doc.text(SHOP.name, M + 29, 17);
  color(MID); font("normal", 9);
  doc.text(SHOP.tagline, M + 29, 22.5);
  doc.text([SHOP.phone, SHOP.address].filter(Boolean).join("  |  "), M + 29, 27.5);
  if (SHOP.instagram) doc.text(SHOP.instagram, M + 29, 32);

  color(GOLD); font("bold", 24);
  doc.text("INVOICE", W - M, 18, { align: "right" });
  color(DARK); font("normal", 9.5);
  doc.text(`No: ${inv.number}`, W - M, 25, { align: "right" });
  doc.text(`Date: ${prettyDate(inv.date)}`, W - M, 30.5, { align: "right" });

  fill(GOLD); doc.rect(0, 38, W, 1.6, "F");

  let y = 49;
  color(MID); font("bold", 8.5);
  doc.text("BILLED TO", M, y);
  color(DARK); font("bold", 12);
  y += 6;
  doc.text(inv.customer.name, M, y);
  font("normal", 10);
  y += 5.5;
  doc.text(`WhatsApp: ${inv.customer.phone}`, M, y);
  if (inv.customer.address.trim()) {
    const addr = doc.splitTextToSize(inv.customer.address.trim(), 90) as string[];
    y += 5;
    doc.text(addr, M, y);
    y += (addr.length - 1) * 4.6;
  }
  color(MID); font("bold", 8.5);
  doc.text("PAYMENT", W - M, 49, { align: "right" });
  color(DARK); font("bold", 11);
  doc.text(inv.payment, W - M, 55, { align: "right" });

  const xItem = M + 12, xQty = 142, xRate = 168, xAmt = W - M - 3;
  y += 10;

  const tableHead = () => {
    fill(DARK); doc.rect(M, y, W - 2 * M, 9, "F");
    color([255, 255, 255]); font("bold", 9);
    doc.text("#", M + 3, y + 6);
    doc.text("ITEM", xItem, y + 6);
    doc.text("QTY", xQty, y + 6, { align: "right" });
    doc.text("RATE", xRate, y + 6, { align: "right" });
    doc.text("AMOUNT", xAmt, y + 6, { align: "right" });
    y += 9;
  };
  tableHead();

  inv.items.forEach((it, i) => {
    font("normal", 10);
    const lines = doc.splitTextToSize(it.name, 88) as string[];
    const h = Math.max(9, lines.length * 4.8 + 4.2);
    if (y + h > H - 30) {
      doc.addPage();
      y = 16;
      tableHead();
    }
    if (i % 2 === 0) { fill(CREAM); doc.rect(M, y, W - 2 * M, h, "F"); }
    color(DARK); font("normal", 10);
    const ty = y + 6;
    doc.text(String(i + 1), M + 3, ty);
    doc.text(lines, xItem, ty);
    doc.text(String(it.qty), xQty, ty, { align: "right" });
    doc.text(money(it.price), xRate, ty, { align: "right" });
    font("bold", 10);
    doc.text(money(it.price * it.qty), xAmt, ty, { align: "right" });
    y += h;
  });
  stroke(LINE); doc.setLineWidth(0.3); doc.line(M, y, W - M, y);

  if (y + 62 > H - 22) { doc.addPage(); y = 16; }
  y += 8;
  const startY = y;
  const lx = 124, rx = W - M - 3;
  const row = (label: string, val: string) => {
    color(MID); font("normal", 10); doc.text(label, lx, y);
    color(DARK); doc.text(val, rx, y, { align: "right" });
    y += 6.5;
  };
  row("Subtotal", `Rs. ${money(inv.subtotal)}`);
  if (inv.discount > 0) row("Discount", `- Rs. ${money(inv.discount)}`);
  if (inv.delivery > 0) row("Delivery", `Rs. ${money(inv.delivery)}`);
  y += 1;
  fill(GOLD); doc.roundedRect(lx - 4, y - 6, W - M - lx + 4, 11, 1.5, 1.5, "F");
  color(DARK); font("bold", 12);
  doc.text("TOTAL", lx, y + 1.3);
  doc.text(`Rs. ${money(inv.total)}`, rx, y + 1.3, { align: "right" });

  if (inv.notes.trim()) {
    color(MID); font("bold", 8.5); doc.text("NOTES", M, startY);
    color(DARK); font("normal", 9.5);
    doc.text(doc.splitTextToSize(inv.notes.trim(), 95) as string[], M, startY + 5.5);
  }

  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    fill(GOLD); doc.rect(M, H - 24, W - 2 * M, 0.6, "F");
    color(MID); font("bold", 10);
    doc.text(SHOP.footer, W / 2, H - 17, { align: "center" });
    font("normal", 8);
    doc.text(SHOP.terms, W / 2, H - 12, { align: "center" });
    if (pages > 1) doc.text(`Page ${p} of ${pages}`, W - M, H - 7, { align: "right" });
  }

  return doc.output("blob");
}
