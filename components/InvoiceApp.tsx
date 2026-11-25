"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import "./invoice.css";
import raw from "@/data/items.json";
import type { CatalogItem, Invoice, LineItem } from "@/lib/invoice/types";
import { SHOP } from "@/lib/invoice/shop";
import { buildInvoicePdf } from "@/lib/invoice/pdf";
import { invoiceMessage, whatsappLink, downloadBlob } from "@/lib/invoice/whatsapp";
import { commitInvoiceNumber, inr, isValidPhone, peekInvoiceNumber, todayISO } from "@/lib/invoice/format";
import PdfPreview from "./PdfPreview";

const CATALOG = raw as CatalogItem[];
const STEPS = ["Customer", "Items", "Send"];
const PAYMENTS = ["UPI", "Cash", "Card", "Unpaid"];
const num = (v: string) => (Number.isFinite(parseFloat(v)) ? Math.max(0, parseFloat(v)) : 0);

export default function InvoiceApp() {
  const [step, setStep] = useState(0);
  const [number, setNumber] = useState("");
  const [date, setDate] = useState(todayISO());
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [lines, setLines] = useState<LineItem[]>([]);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [discount, setDiscount] = useState("");
  const [delivery, setDelivery] = useState("");
  const [payment, setPayment] = useState("UPI");
  const [notes, setNotes] = useState("");
  const [cName, setCName] = useState("");
  const [cPrice, setCPrice] = useState("");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => setNumber(peekInvoiceNumber()), []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(CATALOG.map((c) => c.category)))], []);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CATALOG.filter((i) => (cat === "All" || i.category === cat) && (!q || i.name.toLowerCase().includes(q)));
  }, [search, cat]);

  const qtyOf = (id: string) => lines.find((l) => l.id === id)?.qty ?? 0;
  const change = (item: { id: string; name: string; price: number }, delta: number) =>
    setLines((prev) => {
      const found = prev.find((l) => l.id === item.id);
      if (!found) return delta > 0 ? [...prev, { ...item, qty: delta }] : prev;
      const q = found.qty + delta;
      return q <= 0 ? prev.filter((l) => l.id !== item.id) : prev.map((l) => (l.id === item.id ? { ...l, qty: q } : l));
    });

  const addCustom = () => {
    if (!cName.trim() || num(cPrice) <= 0) return;
    change({ id: `custom-${Date.now()}`, name: cName.trim(), price: num(cPrice) }, 1);
    setCName("");
    setCPrice("");
  };

  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const discountN = Math.min(num(discount), subtotal);
  const deliveryN = num(delivery);
  const total = subtotal - discountN + deliveryN;
  const count = lines.reduce((s, l) => s + l.qty, 0);

  const invoice: Invoice = useMemo(
    () => ({
      number, date, payment, notes, subtotal, total, discount: discountN, delivery: deliveryN,
      customer: { name: name.trim(), phone: phone.trim(), address },
      items: lines,
    }),
    [number, date, payment, notes, subtotal, total, discountN, deliveryN, name, phone, address, lines]
  );

  useEffect(() => {
    if (step !== 2) return;
    let live = true;
    setBusy(true);
    const t = setTimeout(async () => {
      try {
        const b = await buildInvoicePdf(invoice);
        if (live) setBlob(b);
      } finally {
        if (live) setBusy(false);
      }
    }, 250);
    return () => { live = false; clearTimeout(t); };
  }, [step, invoice]);

  const fileName = `${number}-${name.trim().replace(/\s+/g, "-") || "invoice"}.pdf`;
  const phoneOk = isValidPhone(phone);
  const canNext = step === 0 ? name.trim().length > 1 && phoneOk : step === 1 ? lines.length > 0 : false;

  const finish = useCallback(() => {
    if (!done) { commitInvoiceNumber(); setDone(true); }
  }, [done]);

  const goBack = useCallback(() => setStep((current) => Math.max(0, current - 1)), []);

  async function sendWhatsApp() {
    if (!blob) return;
    const text = invoiceMessage(invoice);
    const file = new File([blob], fileName, { type: "application/pdf" });
    if (typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], text, title: `Invoice ${number}` });
        finish();
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }
    downloadBlob(blob, fileName);
    window.open(whatsappLink(phone, text), "_blank");
    finish();
  }

  function openChatOnly() {
    window.open(whatsappLink(phone, invoiceMessage(invoice)), "_blank");
  }

  function reset() {
    setStep(0); setName(""); setPhone(""); setAddress(""); setLines([]); setDiscount(""); setDelivery("");
    setNotes(""); setPayment("UPI"); setSearch(""); setCat("All"); setBlob(null); setDone(false);
    setDate(todayISO()); setNumber(peekInvoiceNumber());
  }

  return (
    <div className="sdh">
      <header className="sdh-top">
        <img src={SHOP.logo} alt="" className="sdh-logo" />
        <div className="sdh-brand">
          <b>{SHOP.name}</b>
          <span>Invoice · {number}</span>
        </div>
      </header>

      <ol className="sdh-steps">
        {STEPS.map((s, i) => (
          <li key={s} className={i === step ? "on" : i < step ? "past" : ""}>
            <i>{i < step ? "✓" : i + 1}</i>{s}
          </li>
        ))}
      </ol>

      <main className="sdh-main">
        {step === 0 && (
          <section className="sdh-card">
            <h2>Customer details</h2>
            <label>Customer name
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ayesha Khan" autoComplete="off" />
            </label>
            <label>WhatsApp number
              <div className="sdh-phone">
                <span>+{SHOP.defaultCountryCode}</span>
                <input type="tel" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98765 43210" />
              </div>
              {phone && !phoneOk && <small className="sdh-err">Enter a valid number</small>}
            </label>
            <label>Address <em>(optional)</em>
              <textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Delivery address" />
            </label>
            <div className="sdh-row2">
              <label>Invoice no.
                <input value={number} onChange={(e) => setNumber(e.target.value)} />
              </label>
              <label>Date
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
            </div>
          </section>
        )}

        {step === 1 && (
          <>
            <div className="sdh-search">
              <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search dessert…" />
            </div>
            <div className="sdh-chips">
              {categories.map((c) => (
                <button key={c} className={c === cat ? "on" : ""} onClick={() => setCat(c)}>{c}</button>
              ))}
            </div>

            <ul className="sdh-list">
              {filtered.map((it) => {
                const q = qtyOf(it.id);
                return (
                  <li key={it.id} className={q ? "sel" : ""}>
                    <div className="sdh-info"><b>{it.name}</b><span>{inr(it.price)}{it.unit ? ` / ${it.unit}` : ""}</span></div>
                    {q === 0 ? (
                      <button className="sdh-add" onClick={() => change(it, 1)}>Add</button>
                    ) : (
                      <Stepper qty={q} onMinus={() => change(it, -1)} onPlus={() => change(it, 1)} />
                    )}
                  </li>
                );
              })}
              {filtered.length === 0 && <li className="sdh-empty">No items found. Add a custom item below.</li>}
            </ul>

            <details className="sdh-card sdh-custom">
              <summary>＋ Add a custom item</summary>
              <div className="sdh-row2">
                <input value={cName} onChange={(e) => setCName(e.target.value)} placeholder="Item name" />
                <input type="number" inputMode="decimal" value={cPrice} onChange={(e) => setCPrice(e.target.value)} placeholder="Price ₹" />
              </div>
              <button className="sdh-btn ghost" onClick={addCustom}>Add to invoice</button>
            </details>

            {lines.length > 0 && (
              <section className="sdh-card">
                <h2>Selected ({count})</h2>
                <ul className="sdh-list flat">
                  {lines.map((l) => (
                    <li key={l.id}>
                      <div className="sdh-info"><b>{l.name}</b><span>{inr(l.price)} × {l.qty} = {inr(l.price * l.qty)}</span></div>
                      <Stepper qty={l.qty} onMinus={() => change(l, -1)} onPlus={() => change(l, 1)} />
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <details className="sdh-card">
              <summary>Discount, delivery, payment &amp; notes</summary>
              <div className="sdh-row2">
                <label>Discount ₹<input type="number" inputMode="decimal" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="0" /></label>
                <label>Delivery ₹<input type="number" inputMode="decimal" value={delivery} onChange={(e) => setDelivery(e.target.value)} placeholder="0" /></label>
              </div>
              <div className="sdh-chips tight">
                {PAYMENTS.map((p) => (
                  <button key={p} className={p === payment ? "on" : ""} onClick={() => setPayment(p)}>{p}</button>
                ))}
              </div>
              <label>Notes <em>(optional)</em>
                <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Deliver by 5 PM" />
              </label>
            </details>

            <div className="sdh-sheet">
              {blob ? <PdfPreview blob={blob} /> : <p className="sdh-loading">Building invoice…</p>}
              {busy && blob && <div className="sdh-veil">Updating…</div>}
            </div>

            {done && <p className="sdh-ok">✓ Invoice {number} saved as sent. The next one will be numbered automatically.</p>}
          </>
        )}
      </main>

      <footer className="sdh-bar">
        {step < 2 ? (
          <>
            <div className="sdh-sum">
              <span>{count} item{count === 1 ? "" : "s"}</span>
              <b>{inr(total)}</b>
            </div>
            {step > 0 && <button className="sdh-btn ghost" onClick={goBack}>Back</button>}
            <button className="sdh-btn" disabled={!canNext} onClick={() => setStep(step + 1)}>
              {step === 0 ? "Next: Items" : "Preview"}
            </button>
          </>
        ) : done ? (
          <button className="sdh-btn" onClick={reset}>＋ New invoice</button>
        ) : (
          <div className="sdh-actions">
            <button className="sdh-btn wa" disabled={!blob || busy} onClick={sendWhatsApp}>Send on WhatsApp</button>
            <div className="sdh-mini">
              <button className="sdh-btn ghost" onClick={goBack}>Back</button>
              <button className="sdh-btn ghost" disabled={!blob} onClick={() => blob && (downloadBlob(blob, fileName), finish())}>Download</button>
              <button className="sdh-btn ghost" onClick={openChatOnly}>Chat only</button>
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}

function Stepper({ qty, onMinus, onPlus }: { qty: number; onMinus: () => void; onPlus: () => void }) {
  return (
    <div className="sdh-step">
      <button aria-label="Decrease" onClick={onMinus}>−</button>
      <span>{qty}</span>
      <button aria-label="Increase" onClick={onPlus}>＋</button>
    </div>
  );
}
