"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCart } from "@/components/CartProvider";
import { FILTERS, PRODUCTS, img } from "@/lib/data";
import {
  MAX_QUANTITY,
  MIN_QUANTITY,
  calculateOrderTotal,
  clampQuantity,
  formatPrice,
} from "@/lib/whatsapp";

function ProductCard({ p }) {
  const [idx, setIdx] = useState(0);
  const [quantity, setQuantity] = useState(MIN_QUANTITY);
  const { addProduct } = useCart();
  const portion = p.portions[idx];
  const single = p.portions.length === 1;
  const featured = p.id === "sampler";
  const soldOut = p.status === "soldout";
  const quantityId = `quantity-${p.id}`;
  const unitPrice = formatPrice(portion.price);
  const total = formatPrice(calculateOrderTotal(portion.price, quantity));

  return (
    <article className={`product-card ${featured ? "is-featured" : ""}`}>
      <div className="product-thumbnail">
        <img src={img(p.image)} alt={p.title} loading="lazy" />
      </div>
      <div className="product-info">
        <h3 className="product-name">{p.title}</h3>

        <div className="portion-tabs" role="group" aria-label={`Choose portion for ${p.title}`}>
          {p.portions.map((o, i) => (
            <button
              key={o.label}
              type="button"
              className={`portion-tab ${i === idx ? "active" : ""} ${single ? "portion-tab--full" : ""}`}
              aria-pressed={i === idx}
              disabled={soldOut}
              onClick={() => setIdx(i)}
            >
              <span className="portion-tab-title">{o.short}</span>
              <span className="portion-tab-note">
                {o.pcs} <span aria-hidden="true">·</span> {formatPrice(o.price)}
              </span>
            </button>
          ))}
        </div>

        <div className="product-controls">
          <div className="quantity-field">
            <span className="control-label" id={quantityId}>Qty</span>
            <div className="quantity-stepper" role="group" aria-labelledby={quantityId}>
              <button
                type="button"
                onClick={() => setQuantity(clampQuantity(quantity - 1))}
                disabled={soldOut || quantity <= MIN_QUANTITY}
                aria-label={`Decrease quantity for ${p.title}`}
              >
                −
              </button>
              <input
                type="number"
                min={MIN_QUANTITY}
                max={MAX_QUANTITY}
                value={quantity}
                onChange={(event) => setQuantity(clampQuantity(event.target.value))}
                disabled={soldOut}
                aria-label={`Quantity for ${p.title}`}
                inputMode="numeric"
              />
              <button
                type="button"
                onClick={() => setQuantity(clampQuantity(quantity + 1))}
                disabled={soldOut || quantity >= MAX_QUANTITY}
                aria-label={`Increase quantity for ${p.title}`}
              >
                +
              </button>
            </div>
          </div>
          <div className="order-total" aria-live="polite">
            <span className="price-caption">Total · {quantity} × {unitPrice}</span>
            <span className="total-amount" key={`${portion.price}-${quantity}`}>{total}</span>
          </div>
        </div>
        <button
          type="button"
          className="btn-add-cart"
          onClick={() => addProduct(p, idx, quantity)}
          disabled={soldOut}
        >
          <i className="fas fa-cart-plus" aria-hidden="true"></i> Add to Order
        </button>
      </div>
    </article>
  );
}

export default function Menu() {
  const [cat, setCat] = useState("all");
  const gridRef = useRef(null);
  const visible = PRODUCTS.filter((p) => cat === "all" || p.categories.includes(cat));

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from(".product-card", {
          y: 24,
          autoAlpha: 0,
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 88%",
            once: true,
          },
        });
      }, gridRef);

      return () => ctx.revert();
    });

    ScrollTrigger.refresh();
    return () => mm.revert();
  }, [cat]);

  return (
    <section id="menu" className="menu-section">
      <div className="container">
        <header className="collection-header">
          <div>
            <h2 className="collection-title">Our Signature <em>Creations</em></h2>
            <p className="collection-desc">
              Small-batch brownies, blondies and celebration cakes, made with real butter and finished by hand.
            </p>
          </div>
        </header>

        <div className="menu-filter-nav" role="group" aria-label="Filter menu by category">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`filter-pill ${cat === f.key ? "active" : ""}`}
              aria-pressed={cat === f.key}
              onClick={() => setCat(f.key)}
            >
              <i className={`fas ${f.icon}`} aria-hidden="true"></i> {f.label}
            </button>
          ))}
        </div>

        <div id="menu-grid" className="menu-grid" aria-live="polite" ref={gridRef}>
          {visible.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
}
