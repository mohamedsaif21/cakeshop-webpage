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
  PROMO_SLIDES,
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
  type SortMode,
} from "./menuData";

export default function MenuSection() {
  const [tab, setTab] = useState<FilterTab>("all");
  const [under500Only, setUnder500Only] = useState(false);
  const [sortBy, setSortBy] = useState<SortMode>("featured");
  const [search, setSearch] = useState("");
  const [promoIdx, setPromoIdx] = useState(0);

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

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = ITEMS.filter((item) => {
      if (tab === "blondies" && !item.isBlondie) return false;
      if ((tab === "brownies" || tab === "cakes") && item.cat !== tab) return false;
      if (under500Only && item.half >= 500) return false;
      if (q) {
        const hay = `${item.name} ${item.cat} ${item.shortDesc} ${item.badge ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (sortBy === "price-asc") {
      return [...filtered].sort((a, b) => a.half - b.half);
    }
    if (sortBy === "price-desc") {
      return [...filtered].sort((a, b) => b.half - a.half);
    }
    return filtered;
  }, [tab, under500Only, search, sortBy]);

  const sendOrder = () => {
    if (!lines.length) return;
    const msg = buildWhatsAppOrderText(lines, total, name, note);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  };

  const promo = PROMO_SLIDES[promoIdx];
  const openPromoItem = () => {
    const target = ITEMS.find((i) => i.id === promo.itemId);
    if (target) setCustomizingItem(target);
  };

  const resetFilters = () => {
    setTab("all");
    setUnder500Only(false);
    setSortBy("featured");
    setSearch("");
  };

  const activeCategoryLabel =
    CATEGORY_CARDS.find((c) => c.id === tab)?.label ?? "All Treats";

  return (
    <div className={s.root}>
      {/* Sticky Top Header Bar + Integrated Dark Search Band */}
      <header className={s.topBar}>
        <div className={`shafa-container ${s.topBarInner}`}>
          <div className={s.brandGroup}>
            <Link href="/" className={s.backLink} aria-label="Back to main website">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Link>
            <div className={s.brand}>
              <Image src={LOGO_SRC} alt="Shafa's Dessert House" width={40} height={40} className={s.brandLogo} />
              <div className={s.brandText}>
                <span className={s.brandName}>Shafa’s Dessert House</span>
                <span className={s.brandSub}>Homemade · Pre-Order Menu</span>
              </div>
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
            <button
              type="button"
              className={s.cartBtn}
              onClick={() => setCartOpen(true)}
              aria-label={`Open order, ${count} items`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M6 7h12l-1 12H7L6 7Z" />
                <path d="M9 7a3 3 0 0 1 6 0" />
              </svg>
              {count > 0 && (
                <b key={count} className={s.badge}>
                  {count}
                </b>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className={s.headerShell}>
        <div className={`shafa-container ${s.searchBand}`}>
          <div className={s.searchRow}>
            <div className={s.searchInputWrap}>
              <svg className={s.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="search"
                className={s.searchInput}
                placeholder="Search brownies, dream cake, Nutella, blondies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search desserts"
              />
              {search && (
                <button type="button" className={s.searchClear} onClick={() => setSearch("")} aria-label="Clear search">
                  ✕
                </button>
              )}
            </div>
            <div className={s.searchMeta}>
              <span>Pick Half or Full · Customize · Order on WhatsApp</span>
              <span className={s.egglessPill}>
                <span className={s.egglessDot} aria-hidden />
                100% Eggless Available
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Promo Showcase Banner */}
      <section className={s.promoSection} aria-label="Featured creation">
        <div className="shafa-container">
          <div className={s.promoCard}>
            <div className={s.promoGlow} aria-hidden />
            <div className={s.promoContent}>
              <span className={s.promoEyebrow}>{promo.eyebrow}</span>
              <h2 className={s.promoTitle}>{promo.title}</h2>
              <p className={s.promoSub}>{promo.subtitle}</p>
              <div className={s.promoActions}>
                <button type="button" className={s.promoCta} onClick={openPromoItem}>
                  {promo.cta}
                  <span aria-hidden>→</span>
                </button>
                <div className={s.promoDots} role="tablist" aria-label="Featured treats">
                  {PROMO_SLIDES.map((slide, i) => (
                    <button
                      key={slide.id}
                      type="button"
                      role="tab"
                      aria-selected={promoIdx === i}
                      aria-label={`Highlight ${slide.title}`}
                      className={`${s.promoDot} ${promoIdx === i ? s.promoDotActive : ""}`}
                      onClick={() => setPromoIdx(i)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className={s.promoMedia}>
              <Image
                src={promo.photo}
                alt={promo.title}
                fill
                sizes="(max-width: 639px) 100vw, 440px"
                className={s.promoImg}
                priority
              />
              <span className={s.promoTag}>{promo.tag}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Category Strip */}
      <section className={s.categorySection} aria-label="Dessert categories">
        <div className="shafa-container">
          <div className={s.sectionTopRow}>
            <h2 className={s.sectionHeading}>Dessert Categories</h2>
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
                  <span className={s.catCount}>{cat.count} items</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sticky Filter & Sort Pill Bar */}
      <nav className={s.filterSticky} aria-label="Filter and sort menu">
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

            <select
              className={s.sortSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortMode)}
              aria-label="Sort desserts"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </nav>

      {/* Menu Grid */}
      <section className={s.menuSection} aria-label="Menu items">
        <div className="shafa-container">
          <div className={s.sectionTopRow}>
            <h2 className={s.sectionHeading}>{activeCategoryLabel}</h2>
            <span className={s.menuHeaderMeta}>
              {visible.length} {visible.length === 1 ? "treat" : "treats"} · Tap card to customize
            </span>
          </div>

          {visible.length === 0 ? (
            <div className={s.emptyResults}>
              <h3>No matching desserts</h3>
              <p>Try clearing your search or switching back to all treats.</p>
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
                const customized = hasCustomPrefs(prefsMap[key]);

                return (
                  <article key={item.id} className={s.card} style={{ "--i": idx } as CSSProperties}>
                    <button
                      type="button"
                      className={s.cardMediaBtn}
                      onClick={() => setCustomizingItem(item)}
                      aria-label={`View and customize ${item.name}`}
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
                          <span>Freshly Baked</span>
                        </div>
                      )}
                      {item.badge && <span className={s.cardTopBadge}>{item.badge}</span>}
                      <span className={s.customizeChip}>{customized ? "Customized" : "Customize"}</span>
                    </button>

                    <div className={s.cardBody}>
                      <div className={s.cardCatRow}>
                        <span className={s.catTag}>{item.isBlondie ? "Blondie" : item.cat === "cakes" ? "Cake" : "Brownie"}</span>
                        <span className={s.egglessHint}>Eggless opt.</span>
                      </div>

                      <button type="button" className={s.cardTitleBtn} onClick={() => setCustomizingItem(item)}>
                        <h3 className={s.cardTitle}>{item.name}</h3>
                      </button>

                      <p className={s.cardDesc}>{item.shortDesc}</p>

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
        <span>Shafa’s Dessert House · Baked fresh to order</span>
        <div className={s.footerLinks}>
          <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener noreferrer">
            @{INSTAGRAM}
          </a>
          <Link href="/">Full Website →</Link>
        </div>
      </footer>

      {count > 0 && !cartOpen && !customizingItem && (
        <button type="button" className={s.bar} onClick={() => setCartOpen(true)}>
          <span className={s.barMeta}>
            <strong>
              {count} item{count > 1 ? "s" : ""} · {inr(total)}
            </strong>
            <small>Tap to review &amp; send on WhatsApp</small>
          </span>
          <span className={s.barAction}>View Order →</span>
        </button>
      )}

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
