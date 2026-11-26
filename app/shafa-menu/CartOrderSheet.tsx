"use client";
import Image from "next/image";
import { useEffect } from "react";
import s from "./MenuSection.module.css";
import { formatPrefsSummary, inr, type CartLine } from "./menuData";

type Props = {
  lines: CartLine[];
  total: number;
  name: string;
  note: string;
  onNameChange: (val: string) => void;
  onNoteChange: (val: string) => void;
  onChangeQty: (key: string, delta: number) => void;
  onSendOrder: () => void;
  onClearCart: () => void;
  onClose: () => void;
};

export default function CartOrderSheet({
  lines,
  total,
  name,
  note,
  onNameChange,
  onNoteChange,
  onChangeQty,
  onSendOrder,
  onClearCart,
  onClose,
}: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className={s.overlay} onClick={onClose}>
      <section
        className={s.sheet}
        role="dialog"
        aria-modal="true"
        aria-label="Your order"
        onClick={(e) => e.stopPropagation()}
      >
        <header className={s.sheetDarkHead}>
          <div className={s.grab} />
          <div className={s.sheetTopRow}>
            <div>
              <span className={s.detailKicker}>Pre-order Summary</span>
              <h3 className={s.detailName}>Your Order</h3>
            </div>
            <button type="button" className={s.sheetIconBtn} onClick={onClose} aria-label="Close order sheet">
              ✕
            </button>
          </div>
        </header>

        <div className={s.sheetScroll}>
          {lines.length === 0 ? (
            <div className={s.emptyCart}>
              <p>Your order list is empty. Add a brownie or cake to begin.</p>
            </div>
          ) : (
            <>
              <ul className={s.lines}>
                {lines.map((l) => {
                  const prefText = formatPrefsSummary(l.prefs);
                  return (
                    <li key={l.key} className={s.lineCard}>
                      <div className={s.lineThumb} aria-hidden>
                        {l.item.photo ? (
                          <Image src={l.item.photo} alt="" fill sizes="56px" className={s.cardImg} />
                        ) : (
                          <div className={s.placeholderArt}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                              <path d="M4 14h16v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5Z" />
                              <path d="M4 14c0-2 2-3 4-3 1.5 0 2.5 1 4 1s2.5-1 4-1c2 0 4 1 4 3" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className={s.lineInfo}>
                        <strong>{l.item.name}</strong>
                        <small>
                          {l.size === "half" ? "Half" : "Full"} · {inr(l.price)}
                        </small>
                        {prefText && <div className={s.linePrefs}>{prefText}</div>}
                      </div>
                      <div className={s.lineRight}>
                        <div className={s.step}>
                          <button type="button" onClick={() => onChangeQty(l.key, -1)} aria-label="Decrease">
                            −
                          </button>
                          <span>{l.qty}</span>
                          <button type="button" onClick={() => onChangeQty(l.key, 1)} aria-label="Increase">
                            +
                          </button>
                        </div>
                        <b className={s.lineTotal}>{inr(l.qty * l.price)}</b>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <input
                className={s.field}
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                aria-label="Your name"
              />
              <textarea
                className={s.field}
                rows={2}
                placeholder="Delivery date / note (e.g. Saturday evening, no nuts)"
                value={note}
                onChange={(e) => onNoteChange(e.target.value)}
                aria-label="Order note"
              />
            </>
          )}
        </div>

        {lines.length > 0 && (
          <footer className={s.cartFooterStack}>
            <div className={s.totalRow}>
              <span>Order Total</span>
              <strong>{inr(total)}</strong>
            </div>
            <button type="button" className={s.sendBtn} onClick={onSendOrder}>
              Send order on WhatsApp
            </button>
            <button type="button" className={s.clearBtn} onClick={onClearCart}>
              Clear order
            </button>
          </footer>
        )}
      </section>
    </div>
  );
}
