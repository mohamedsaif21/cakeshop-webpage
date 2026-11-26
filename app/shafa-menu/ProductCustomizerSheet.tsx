"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import s from "./MenuSection.module.css";
import {
  DIETARY_OPTIONS,
  MAX_ITEM_QTY,
  PACKAGING_OPTIONS,
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
        className={s.sheet}
        role="dialog"
        aria-modal="true"
        aria-label={`Customize ${item.name}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={s.sheetDarkHead}>
          <div className={s.sheetTopRow}>
            <button type="button" className={s.sheetIconBtn} onClick={onClose} aria-label="Back to menu">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <span className={s.sheetTitleCenter}>Customize Treat</span>
            <button type="button" className={s.sheetIconBtn} onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>

          <div className={s.detailHeroRow}>
            <div>
              <span className={s.detailKicker}>{item.cat === "cakes" ? "Artisanal Cake" : "Handcrafted Brownie"}</span>
              <h3 className={s.detailName}>{item.name}</h3>
            </div>
            <div className={s.step} role="group" aria-label={`Quantity for ${item.name}`}>
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span>{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(MAX_ITEM_QTY, q + 1))}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        </header>

        <div className={s.sheetScroll}>
          <div className={s.detailMediaFrame}>
            {item.photo ? (
              <Image src={item.photo} alt={item.name} fill sizes="260px" className={s.cardImg} />
            ) : (
              <div className={s.placeholderArt}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <path d="M4 14h16v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5Z" />
                  <path d="M4 14c0-2 2-3 4-3 1.5 0 2.5 1 4 1s2.5-1 4-1c2 0 4 1 4 3" />
                  <path d="M12 7v4M12 3a1.5 1.5 0 0 1 1.5 1.5c0 .9-1.5 2.5-1.5 2.5s-1.5-1.6-1.5-2.5A1.5 1.5 0 0 1 12 3Z" />
                </svg>
                <span>Freshly Baked</span>
              </div>
            )}
          </div>

          <div>
            <span className={s.detailSectionLabel}>About this dessert</span>
            <p className={s.detailAbout}>{item.about}</p>
          </div>

          <div>
            <span className={s.detailSectionLabel}>Select Size</span>
            <div className={s.choiceGrid} role="group" aria-label="Select portion size">
              {(["half", "full"] as Size[]).map((z) => (
                <button
                  key={z}
                  type="button"
                  className={`${s.choiceChip} ${size === z ? s.choiceChipActive : ""}`}
                  aria-pressed={size === z}
                  onClick={() => setSize(z)}
                >
                  <span>{z === "half" ? item.halfLabel : item.fullLabel}</span>
                  <small>{inr(item[z])}</small>
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className={s.detailSectionLabel}>Dietary Preference</span>
            <div className={s.choiceGrid} role="group" aria-label="Dietary preference">
              {DIETARY_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`${s.choiceChip} ${prefs.dietary === option ? s.choiceChipActive : ""}`}
                  aria-pressed={prefs.dietary === option}
                  onClick={() => setPrefs((p) => ({ ...p, dietary: option }))}
                >
                  <span>{option}</span>
                  <small>{option === "100% Eggless" ? "Veg" : "Classic"}</small>
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className={s.detailSectionLabel}>Presentation &amp; Gifting</span>
            <div className={s.choiceGrid} role="group" aria-label="Presentation option">
              {PACKAGING_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`${s.choiceChip} ${prefs.packaging === option ? s.choiceChipActive : ""}`}
                  aria-pressed={prefs.packaging === option}
                  onClick={() => setPrefs((p) => ({ ...p, packaging: option }))}
                >
                  <span>{option}</span>
                  <small>{option === "Gift Ribbon & Card" ? "Complimentary" : "Standard"}</small>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="custom-item-note" className={s.detailSectionLabel}>
              Special Request for this Treat (optional)
            </label>
            <input
              id="custom-item-note"
              className={s.field}
              placeholder="e.g. No nuts, Happy Birthday message, extra ribbon"
              value={prefs.itemNote}
              onChange={(e) => setPrefs((p) => ({ ...p, itemNote: e.target.value }))}
            />
          </div>
        </div>

        <footer className={s.sheetFooter}>
          <div>
            <span className={s.sheetTotalLabel}>
              {size === "half" ? "Half" : "Full"} · {qty} × {inr(unitPrice)}
            </span>
            <strong className={s.sheetTotalPrice}>{inr(lineTotal)}</strong>
          </div>
          <button type="button" className={s.sheetPrimaryBtn} onClick={handleConfirm}>
            {existingQty > 0 ? "Update Order" : "Add to Order"} · {inr(lineTotal)}
          </button>
        </footer>
      </section>
    </div>
  );
}
