"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import s from "./MenuSection.module.css";

/* ====== EDIT THESE ====== */
const WHATSAPP_NUMBER = "91XXXXXXXXXX"; // country code + number, digits only
const INSTAGRAM = "shafasdesserthouse";
const LOGO_SRC = "/shafa-menu/logo.png";
/* ======================== */

const STORAGE_KEY = "shafa-cart-v1";

type Size = "half" | "full";
type Cat = "brownies" | "cakes";
type Item = { id: string; name: string; cat: Cat; half: number; full: number };
type Line = { key: string; item: Item; size: Size; qty: number; price: number };

const ITEMS: Item[] = [
  { id: "normal-brownie", name: "Normal Brownie", cat: "brownies", half: 499, full: 999 },
  { id: "triple-choc-brownies", name: "Triple Chocolate Brownies", cat: "brownies", half: 649, full: 1299 },
  { id: "blonde-brownies", name: "Blonde Brownies", cat: "brownies", half: 549, full: 1099 },
  { id: "triple-choc-blondies", name: "Triple Chocolate Blondies", cat: "brownies", half: 699, full: 1399 },
  { id: "fruits-nuts-brownie", name: "Fruits & Nuts Brownie", cat: "brownies", half: 599, full: 1199 },
  { id: "nutella-brownies", name: "Nutella Brownies", cat: "brownies", half: 639, full: 1279 },
  { id: "dream-cake", name: "Dream Cake", cat: "cakes", half: 639, full: 1279 },
  { id: "red-velvet-cake", name: "Red Velvet Cake", cat: "cakes", half: 399, full: 799 },
  { id: "black-forest-cake", name: "Black Forest Cake", cat: "cakes", half: 399, full: 749 },
  { id: "white-forest-cake", name: "White Forest Cake", cat: "cakes", half: 399, full: 749 },
  { id: "plum-cake", name: "Plum Cake", cat: "cakes", half: 449, full: 849 },
];

const PHOTOS: Record<string, string> = {
  "normal-brownie": "/assest/Menu Highlights/The Best Brownies Ever.jpeg",
  "triple-choc-brownies": "/assest/Menu Highlights/Ultimate Triple Layer Brownies Recipe.jpeg",
  "blonde-brownies": "/assest/Menu Highlights/Haole Brownies AKA Blonde Brownies.jpeg",
  "triple-choc-blondies": "/assest/Menu Highlights/12 Amazing Brownies That Will Make You Drool.jpeg",
  "fruits-nuts-brownie": "/assest/Menu Highlights/Bombshell Oreo Brownies.jpeg",
  "nutella-brownies": "/assest/Menu Highlights/Soft and Gooey Nutella Brownies - Strawberry in the Desert.jpeg",
  "dream-cake": "/assest/Menu Highlights/Tin Can Chocolate Dream Cake Filipino Recipe.jpeg",
  "red-velvet-cake": "/assest/Menu Highlights/Red Velvet Cake.jpeg",
  "white-forest-cake": "/assest/Menu Highlights/White Forest Cake.jpeg",
};

const TABS: { id: "all" | Cat; label: string }[] = [
  { id: "all", label: "All" },
  { id: "brownies", label: "Brownies" },
  { id: "cakes", label: "Cakes" },
];

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function MenuSection() {
  const [tab, setTab] = useState<"all" | Cat>("all");
  const [sizes, setSizes] = useState<Record<string, Size>>({});
  const [cart, setCart] = useState<Record<string, number>>({});
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCart(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch {}
  }, [cart, loaded]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const change = (key: string, d: number) =>
    setCart((c) => {
      const q = (c[key] || 0) + d;
      const n = { ...c };
      if (q <= 0) delete n[key]; else n[key] = q;
      return n;
    });

  const lines = useMemo<Line[]>(
    () =>
      Object.entries(cart).flatMap(([key, qty]) => {
        const [id, size] = key.split("|") as [string, Size];
        const item = ITEMS.find((i) => i.id === id);
        return item ? [{ key, item, size, qty, price: item[size] }] : [];
      }),
    [cart]
  );
  const count = lines.reduce((a, l) => a + l.qty, 0);
  const total = lines.reduce((a, l) => a + l.qty * l.price, 0);
  const visible = ITEMS.filter((i) => tab === "all" || i.cat === tab);

  const sendOrder = () => {
    if (!lines.length) return;
    const body = lines
      .map((l, i) => `${i + 1}. ${l.item.name} (${l.size === "half" ? "Half" : "Full"}) × ${l.qty} = ${inr(l.qty * l.price)}`)
      .join("\n");
    const msg =
      `*New Order – Shafa's Dessert House*\n\n${body}\n\n*Total: ${inr(total)}*` +
      (name.trim() ? `\n\nName: ${name.trim()}` : "") +
      (note.trim() ? `\nNote: ${note.trim()}` : "");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  };

  return (
    <div className={s.root}>
      <header className={s.header}>
        <div className={s.brand}>
          <Image src={LOGO_SRC} alt="Shafa's Dessert House" width={44} height={44} className={s.brandLogo} />
          <span>Shafa’s Dessert House</span>
        </div>
        <button className={s.cartBtn} onClick={() => setOpen(true)} aria-label={`Open order, ${count} items`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M6 7h12l-1 12H7L6 7Z" /><path d="M9 7a3 3 0 0 1 6 0" />
          </svg>
          {count > 0 && <b key={count} className={s.badge}>{count}</b>}
        </button>
      </header>

      <section className={s.hero}>
        <p className={s.eyebrow}>Homemade · Made with love</p>
        <h2>Our Sweet Menu</h2>
        <p className={s.sub}>Pick Half or Full, add to your order, and send it to us on WhatsApp.</p>
      </section>

      <nav className={s.tabs} aria-label="Categories">
        {TABS.map((t) => (
          <button key={t.id} className={`${s.tab} ${tab === t.id ? s.tabOn : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>

      <main className={s.grid}>
        {visible.map((item, idx) => {
          const size = sizes[item.id] ?? "half";
          const key = `${item.id}|${size}`;
          const qty = cart[key] || 0;
          return (
            <article key={item.id} className={s.card} style={{ "--i": idx } as React.CSSProperties}>
              <div className={s.thumb} aria-hidden>
                {PHOTOS[item.id] ? (
                  <Image src={PHOTOS[item.id]} alt="" fill sizes="(max-width: 380px) 64px, 84px" className={s.thumbImage} />
                ) : (
                  item.cat === "cakes" ? "🍰" : "🍫"
                )}
              </div>
              <div className={s.info}>
                <h3>{item.name}</h3>
                <div className={s.seg} role="group" aria-label={`${item.name} size`}>
                  {(["half", "full"] as Size[]).map((z) => (
                    <button key={z} className={size === z ? s.segOn : ""} onClick={() => setSizes((p) => ({ ...p, [item.id]: z }))}>
                      {z === "half" ? "Half" : "Full"}
                    </button>
                  ))}
                </div>
                <div className={s.row}>
                  <span className={s.price}>{inr(item[size])}</span>
                  {qty === 0 ? (
                    <button className={s.add} onClick={() => change(key, 1)}>Add +</button>
                  ) : (
                    <div className={s.step}>
                      <button onClick={() => change(key, -1)} aria-label="Decrease">−</button>
                      <span>{qty}</span>
                      <button onClick={() => change(key, 1)} aria-label="Increase">+</button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </main>

      <footer className={s.footer}>
        <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener noreferrer">@{INSTAGRAM}</a>
      </footer>

      {count > 0 && !open && (
        <button className={s.bar} onClick={() => setOpen(true)}>
          <span>{count} item{count > 1 ? "s" : ""} · {inr(total)}</span>
          <span>View order →</span>
        </button>
      )}

      {open && (
        <div className={s.overlay} onClick={() => setOpen(false)}>
          <section className={s.sheet} role="dialog" aria-label="Your order" onClick={(e) => e.stopPropagation()}>
            <div className={s.grab} />
            <div className={s.sheetHead}>
              <h3>Your Order</h3>
              <button onClick={() => setOpen(false)} aria-label="Close">✕</button>
            </div>

            {lines.length === 0 ? (
              <p className={s.empty}>Your order list is empty. Add something sweet 🍫</p>
            ) : (
              <>
                <ul className={s.lines}>
                  {lines.map((l) => (
                    <li key={l.key}>
                      <div>
                        <strong>{l.item.name}</strong>
                        <small>{l.size === "half" ? "Half" : "Full"} · {inr(l.price)}</small>
                      </div>
                      <div className={s.step}>
                        <button onClick={() => change(l.key, -1)} aria-label="Decrease">−</button>
                        <span>{l.qty}</span>
                        <button onClick={() => change(l.key, 1)} aria-label="Increase">+</button>
                      </div>
                      <b className={s.lineTotal}>{inr(l.qty * l.price)}</b>
                    </li>
                  ))}
                </ul>
                <input className={s.field} placeholder="Your name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
                <textarea className={s.field} rows={2} placeholder="Note (e.g. no nuts, birthday message)" value={note} onChange={(e) => setNote(e.target.value)} />
                <div className={s.totalRow}><span>Total</span><b>{inr(total)}</b></div>
                <button className={s.send} onClick={sendOrder}>Send order on WhatsApp</button>
                <button className={s.clear} onClick={() => setCart({})}>Clear order</button>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}