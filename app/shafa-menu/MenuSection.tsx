"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import CartOrderSheet from "./CartOrderSheet";
import ProductCustomizerSheet from "./ProductCustomizerSheet";
import s from "./MenuSection.module.css";
import {
  CATEGORY_CARDS,
  DEFAULT_CUSTOMIZATION,
  INSTAGRAM,
  ITEMS,
  LOGO_SRC,
  MAX_ITEM_QTY,
  PREFS_STORAGE_KEY,
  STORAGE_KEY,
  WHATSAPP_NUMBER,
  buildWhatsAppOrderText,
  hasCustomPrefs,
  inr,
  type CartLine,
  type FilterTab,
  type ItemCustomization,
  type MenuItem,
  type Size,
} from "./menuData";

const SEARCH_SUGGESTIONS = [
  "Search brownies...",
  "Find your favourite cake...",
  "Craving something chocolatey?",
  "Search dessert treats...",
  "Try our Dream Cake...",
];

function AnimatedSearchPlaceholder() {
  const [suggestionIdx, setSuggestionIdx] = useState(0);
  const [suggestionText, setSuggestionText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = SEARCH_SUGGESTIONS[suggestionIdx];
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSuggestionText(target);
      return undefined;
    }
    if (!deleting && suggestionText === target) {
      const pause = window.setTimeout(() => setDeleting(true), 1800);
      return () => window.clearTimeout(pause);
    }
    if (deleting && suggestionText === "") {
      setDeleting(false);
      setSuggestionIdx((i) => (i + 1) % SEARCH_SUGGESTIONS.length);
      return undefined;
    }
    const timer = window.setTimeout(
      () => {
        setSuggestionText((text) =>
          deleting ? target.slice(0, text.length - 1) : target.slice(0, text.length + 1)
        );
      },
      deleting ? 45 : 85
    );
    return () => window.clearTimeout(timer);
  }, [suggestionIdx, suggestionText, deleting]);

  return (
    <span className={s.searchPlaceholder} aria-hidden="true">
      {suggestionText}
      <span className={s.searchCaret} />
    </span>
  );
}

export default function MenuSection() {
  const [tab, setTab] = useState<FilterTab>("all");
  const [under500Only, setUnder500Only] = useState(false);
  const [search, setSearch] = useState("");

  const [sizes, setSizes] = useState<Record<string, Size>>({});
  const [cart, setCart] = useState<Record<string, number>>({});
  const [prefsMap, setPrefsMap] = useState<Record<string, ItemCustomization>>({});
  const [loaded, setLoaded] = useState(false);

  const [cartOpen, setCartOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    try {
      const rawCart = localStorage.getItem(STORAGE_KEY);
      if (rawCart) {
        const parsed = JSON.parse(rawCart);
        if (parsed && typeof parsed === "object") setCart(parsed);
      }
      const rawPrefs = localStorage.getItem(PREFS_STORAGE_KEY);
      if (rawPrefs) {
        const parsedPrefs = JSON.parse(rawPrefs);
        if (parsedPrefs && typeof parsedPrefs === "object") setPrefsMap(parsedPrefs);
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefsMap));
    } catch {}
  }, [cart, prefsMap, loaded]);

  useEffect(() => {
    if (!cartOpen && !customizingItem) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [cartOpen, customizingItem]);

  const change = useCallback((key: string, d: number) => {
    setCart((c) => {
      const q = Math.min(MAX_ITEM_QTY, (c[key] || 0) + d);
      const n = { ...c };
      if (q <= 0) {
        delete n[key];
        setPrefsMap((prev) => {
          if (!prev[key]) return prev;
          const next = { ...prev };
          delete next[key];
          return next;
        });
      } else {
        n[key] = q;
      }
      return n;
    });
  }, []);

  const saveCustomizedItem = useCallback((key: string, qty: number, prefs: ItemCustomization) => {
    const safeQty = Math.min(MAX_ITEM_QTY, Math.max(1, qty));
    setCart((c) => ({ ...c, [key]: safeQty }));
    setPrefsMap((prev) => {
      const next = { ...prev };
      if (hasCustomPrefs(prefs)) next[key] = prefs;
      else delete next[key];
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setCart({});
    setPrefsMap({});
  }, []);

  const cartQtyForKey = useCallback((key: string) => cart[key] || 0, [cart]);
  const getPrefsForKey = useCallback(
    (key: string) => prefsMap[key] ?? DEFAULT_CUSTOMIZATION,
    [prefsMap]
  );

  const lines = useMemo<CartLine[]>(
    () =>
      Object.entries(cart).flatMap(([key, qty]) => {
        const [id, size] = key.split("|") as [string, Size];
        const item = ITEMS.find((i) => i.id === id);
        if (!item || (size !== "half" && size !== "full")) return [];
        return [{ key, item, size, qty, price: item[size], prefs: prefsMap[key] ?? DEFAULT_CUSTOMIZATION }];
      }),
    [cart, prefsMap]
  );

  const count = lines.reduce((a, l) => a + l.qty, 0);
  const total = lines.reduce((a, l) => a + l.qty * l.price, 0);
  const showOrderBar = count > 0 && !cartOpen && !customizingItem;

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = ITEMS.filter((item) => {
      if (tab === "blondies" && !item.isBlondie) return false;
      if ((tab === "brownies" || tab === "cakes") && item.cat !== tab) return false;
      if (under500Only && item.half >= 500) return false;
      if (q) {
        const hay = `${item.name} ${item.cat}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    return filtered;
  }, [tab, under500Only, search]);

  const sendOrder = () => {
    if (!lines.length) return;
    const msg = buildWhatsAppOrderText(lines, total, name, note);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  };

  const resetFilters = () => {
    setTab("all");
    setUnder500Only(false);
    setSearch("");
  };

  const activeCategoryLabel =
    CATEGORY_CARDS.find((c) => c.id === tab)?.label ?? "All Treats";

  return (
    <div className={`${s.root} ${showOrderBar ? s.rootWithBar : ""}`}>
      {/* Sticky Top Header Bar */}
      <header className={s.topBar}>
        <div className={`shafa-container ${s.topBarInner}`}>
          <div className={s.brand}>
            <Image src={LOGO_SRC} alt="Shafa's Dessert House" width={40} height={40} className={s.brandLogo} />
            <div className={s.brandText}>
              <span className={s.brandName}>Shafa’s Dessert House</span>
              <span className={s.brandSub}>Digital Menu</span>
            </div>
          </div>

          <div className={s.headerActions}>
            <a
              href={`https://instagram.com/${INSTAGRAM}`}
              target="_blank"
              rel="noopener noreferrer"
              className={s.iconBtn}
              aria-label="Follow us on Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Integrated Dark Search Shell */}
      <div className={s.headerShell}>
        <div className={`shafa-container ${s.searchBand}`}>
          <div className={s.searchInputWrap}>
            <svg className={s.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              className={s.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search desserts"
            />
            {!search && <AnimatedSearchPlaceholder />}
            {search && (
              <button type="button" className={s.searchClear} onClick={() => setSearch("")} aria-label="Clear search">
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Visual Category Strip */}
      <section className={s.categorySection} aria-label="Dessert categories">
        <div className="shafa-container">
          <div className={s.sectionTopRow}>
            <h2 className={s.sectionHeading}>Categories</h2>
            {tab !== "all" && (
              <button type="button" className={s.sectionLink} onClick={() => setTab("all")}>
                See all
              </button>
            )}
          </div>

          <div className={s.catRail}>
            {CATEGORY_CARDS.map((cat) => {
              const active = tab === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`${s.catTile} ${active ? s.catTileActive : ""}`}
                  aria-pressed={active}
                  onClick={() => setTab(cat.id)}
                >
                  <span className={s.catThumb}>
                    <Image src={cat.photo} alt="" fill sizes="54px" className={s.catThumbImg} />
                  </span>
                  <span className={s.catLabel}>{cat.label}</span>
                  <span className={s.catCount}>{cat.count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sticky Category Filter Bar */}
      <nav className={s.filterSticky} aria-label="Filter menu">
        <div className="shafa-container">
          <div className={s.filterRow}>
            <div className={s.pillGroup}>
              {CATEGORY_CARDS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`${s.filterPill} ${tab === c.id ? s.filterPillActive : ""}`}
                  aria-pressed={tab === c.id}
                  onClick={() => setTab(c.id)}
                >
                  {c.label}
                </button>
              ))}
              <button
                type="button"
                className={`${s.filterPill} ${under500Only ? s.filterPillActive : ""}`}
                aria-pressed={under500Only}
                onClick={() => setUnder500Only((v) => !v)}
              >
                Under ₹500
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu Grid */}
      <section className={s.menuSection} aria-label="Menu items">
        <div className="shafa-container">
          <div className={s.sectionTopRow}>
            <h2 className={s.sectionHeading}>{activeCategoryLabel}</h2>
            <span className={s.menuHeaderMeta}>
              {visible.length} {visible.length === 1 ? "item" : "items"}
            </span>
          </div>

          {visible.length === 0 ? (
            <div className={s.emptyResults}>
              <h3>No matching desserts</h3>
              <button type="button" className={s.resetBtn} onClick={resetFilters}>
                Show all treats
              </button>
            </div>
          ) : (
            <div className={s.grid}>
              {visible.map((item, idx) => {
                const size = sizes[item.id] ?? "half";
                const key = `${item.id}|${size}`;
                const qty = cart[key] || 0;

                return (
                  <article key={item.id} className={s.card} style={{ "--i": idx } as CSSProperties}>
                    <button
                      type="button"
                      className={s.cardMediaBtn}
                      onClick={() => setCustomizingItem(item)}
                      aria-label={`Customize ${item.name}`}
                    >
                      {item.photo ? (
                        <Image
                          src={item.photo}
                          alt={item.name}
                          fill
                          sizes="(max-width: 639px) 50vw, (max-width: 1099px) 33vw, 25vw"
                          className={s.cardImg}
                        />
                      ) : (
                        <div className={s.placeholderArt}>
                          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                            <path d="M4 14h16v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5Z" />
                            <path d="M4 14c0-2 2-3 4-3 1.5 0 2.5 1 4 1s2.5-1 4-1c2 0 4 1 4 3" />
                            <path d="M12 7v4M12 3a1.5 1.5 0 0 1 1.5 1.5c0 .9-1.5 2.5-1.5 2.5s-1.5-1.6-1.5-2.5A1.5 1.5 0 0 1 12 3Z" />
                          </svg>
                        </div>
                      )}
                    </button>

                    <div className={s.cardBody}>
                      <button type="button" className={s.cardTitleBtn} onClick={() => setCustomizingItem(item)}>
                        <h3 className={s.cardTitle}>{item.name}</h3>
                      </button>

                      <div className={s.seg} role="group" aria-label={`${item.name} size`}>
                        {(["half", "full"] as Size[]).map((z) => (
                          <button
                            key={z}
                            type="button"
                            className={size === z ? s.segOn : ""}
                            aria-pressed={size === z}
                            onClick={() => setSizes((p) => ({ ...p, [item.id]: z }))}
                          >
                            {z === "half" ? "Half" : "Full"}
                          </button>
                        ))}
                      </div>

                      <div className={s.cardFoot}>
                        <div className={s.priceWrap}>
                          <span className={s.price}>{inr(item[size])}</span>
                          <span className={s.priceUnit}>{size === "half" ? "Half" : "Full"}</span>
                        </div>

                        {qty === 0 ? (
                          <button
                            type="button"
                            className={s.quickAdd}
                            onClick={() => change(key, 1)}
                            aria-label={`Add ${item.name} (${size})`}
                          >
                            +
                          </button>
                        ) : (
                          <div className={s.step}>
                            <button type="button" onClick={() => change(key, -1)} aria-label="Decrease">
                              −
                            </button>
                            <span>{qty}</span>
                            <button type="button" onClick={() => change(key, 1)} aria-label="Increase">
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <footer className={`shafa-container ${s.footer}`}>
        <div className={s.footerBrand}>
          <Image src={LOGO_SRC} alt="" width={26} height={26} className={s.footerLogo} />
          <span>Shafa’s Dessert House</span>
        </div>
        <div className={s.footerLinks}>
          <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener noreferrer">
            @{INSTAGRAM}
          </a>
          <Link href="/">Full Website →</Link>
        </div>
      </footer>

      <button
        type="button"
        className={`${s.bar} ${showOrderBar ? s.barVisible : ""}`}
        onClick={() => setCartOpen(true)}
        tabIndex={showOrderBar ? 0 : -1}
        aria-hidden={!showOrderBar}
      >
        View Order
      </button>

      {customizingItem && (
        <ProductCustomizerSheet
          item={customizingItem}
          initialSize={sizes[customizingItem.id] ?? "half"}
          cartQtyForKey={cartQtyForKey}
          getPrefsForKey={getPrefsForKey}
          onClose={() => setCustomizingItem(null)}
          onSaveItem={saveCustomizedItem}
        />
      )}

      {cartOpen && (
        <CartOrderSheet
          lines={lines}
          total={total}
          name={name}
          note={note}
          onNameChange={setName}
          onNoteChange={setNote}
          onChangeQty={change}
          onSendOrder={sendOrder}
          onClearCart={clearAll}
          onClose={() => setCartOpen(false)}
        />
      )}
    </div>
  );
}
