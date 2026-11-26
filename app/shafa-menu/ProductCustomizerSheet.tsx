"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import s from "./MenuSection.module.css";
import {
  DIETARY_OPTIONS,
  MAX_ITEM_QTY,
  inr,
  type ItemCustomization,
  type MenuItem,
  type Size,
} from "./menuData";

type Props = {
  item: MenuItem;
  initialSize: Size;
  cartQtyForKey: (key: string) => number;
  getPrefsForKey: (key: string) => ItemCustomization;
  onClose: () => void;
  onSaveItem: (key: string, qty: number, prefs: ItemCustomization) => void;
};

export default function ProductCustomizerSheet({
  item,
  initialSize,
  cartQtyForKey,
  getPrefsForKey,
  onClose,
  onSaveItem,
}: Props) {
  const [size, setSize] = useState<Size>(initialSize);
  const currentKey = `${item.id}|${size}`;
  const existingQty = cartQtyForKey(currentKey);
  const [qty, setQty] = useState<number>(existingQty > 0 ? existingQty : 1);
  const [prefs, setPrefs] = useState<ItemCustomization>(() => getPrefsForKey(currentKey));

  useEffect(() => {
    const k = `${item.id}|${size}`;
    const q = cartQtyForKey(k);
    setQty(q > 0 ? q : 1);
    setPrefs(getPrefsForKey(k));
  }, [item.id, size, cartQtyForKey, getPrefsForKey]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const unitPrice = item[size];
  const lineTotal = unitPrice * qty;

  const handleConfirm = () => {
    onSaveItem(currentKey, qty, prefs);
    onClose();
  };

  return (
    <div className={s.overlay} onClick={onClose}>
      <section
        className={`${s.sheet} ${s.czSheet}`}
        role="dialog"
        aria-modal="true"
        aria-label={`Customize ${item.name}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={s.czHead}>
          <div className={s.czTopRow}>
            <span className={s.czHeadTitle}>Customize Treat</span>
            <button type="button" className={s.czIconBtn} onClick={onClose} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className={s.czHero}>
            <div className={s.czHeroText}>
              <h3 className={s.czProductName}>{item.name}</h3>
            </div>
            <div className={s.czStepper} role="group" aria-label={`Quantity for ${item.name}`}>
              <button
                type="button"
                className={s.czStepBtn}
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className={s.czStepValue}>{qty}</span>
              <button
                type="button"
                className={s.czStepBtn}
                onClick={() => setQty((q) => Math.min(MAX_ITEM_QTY, q + 1))}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        </header>

        <div className={s.czScroll}>
          <div className={s.czMedia}>
            {item.photo ? (
              <Image src={item.photo} alt={item.name} fill sizes="(max-width: 640px) 100vw, 620px" className={s.czMediaImg} />
            ) : (
              <div className={s.placeholderArt}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <path d="M4 14h16v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5Z" />
                  <path d="M4 14c0-2 2-3 4-3 1.5 0 2.5 1 4 1s2.5-1 4-1c2 0 4 1 4 3" />
                  <path d="M12 7v4M12 3a1.5 1.5 0 0 1 1.5 1.5c0 .9-1.5 2.5-1.5 2.5s-1.5-1.6-1.5-2.5A1.5 1.5 0 0 1 12 3Z" />
                </svg>
              </div>
            )}
          </div>

          <section className={s.czSection} aria-label="Select size">
            <h4 className={s.czSectionTitle}>Select Size</h4>
            <div className={s.czOptions} role="group" aria-label="Select portion size">
              {(["half", "full"] as Size[]).map((z) => (
                <button
                  key={z}
                  type="button"
                  className={`${s.czOption} ${size === z ? s.czOptionActive : ""}`}
                  aria-pressed={size === z}
                  onClick={() => setSize(z)}
                >
                  <span className={s.czOptionName}>{z === "half" ? item.halfLabel : item.fullLabel}</span>
                  <span className={s.czOptionMeta}>{inr(item[z])}</span>
                  <span className={s.czOptionTick} aria-hidden="true">✓</span>
                </button>
              ))}
            </div>
          </section>

          <section className={s.czSection} aria-label="Dietary preference">
            <h4 className={s.czSectionTitle}>Dietary Preference</h4>
            <div className={s.czOptions} role="group" aria-label="Dietary preference">
              {DIETARY_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`${s.czOption} ${prefs.dietary === option ? s.czOptionActive : ""}`}
                  aria-pressed={prefs.dietary === option}
                  onClick={() => setPrefs((p) => ({ ...p, dietary: option }))}
                >
                  <span className={s.czOptionName}>{option}</span>
                  <span className={s.czOptionMeta}>{option === "100% Eggless" ? "Veg" : "Classic"}</span>
                  <span className={s.czOptionTick} aria-hidden="true">✓</span>
                </button>
              ))}
            </div>
          </section>

        </div>

        <footer className={s.czFooter}>
          <div className={s.czTotal}>
            <span className={s.czTotalLabel}>
              {size === "half" ? "Half" : "Full"} · {qty} × {inr(unitPrice)}
            </span>
            <strong className={s.czTotalPrice}>{inr(lineTotal)}</strong>
          </div>
          <button type="button" className={s.czAddBtn} onClick={handleConfirm}>
            {existingQty > 0 ? "Update Order" : "Add to Order"} · {inr(lineTotal)}
          </button>
        </footer>
      </section>
    </div>
  );
}
