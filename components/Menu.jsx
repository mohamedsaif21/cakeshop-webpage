"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AVAILABILITY, FILTERS, PRICE_ROWS, PRODUCTS, img } from "@/lib/data";
import {
  MAX_QUANTITY,
  MIN_QUANTITY,
  calculateOrderTotal,
  clampQuantity,
  formatPrice,
  waLink,
} from "@/lib/whatsapp";

function ProductCard({ p }) {
  const [idx, setIdx] = useState(0);
  const [quantity, setQuantity] = useState(MIN_QUANTITY);
  const portion = p.portions[idx];
  const single = p.portions.length === 1;
  const featured = p.id === "sampler";
  const status = AVAILABILITY[p.status] ?? AVAILABILITY.available;
  const soldOut = p.status === "soldout";
  const quantityId = `quantity-${p.id}`;
  const unitPrice = formatPrice(portion.price);
  const total = formatPrice(calculateOrderTotal(portion.price, quantity));

  return (
    <article className={`product-card ${featured ? "is-featured" : ""} is-${p.status}`}>
      <div className="product-thumbnail">
        <span className="product-tag">{p.tag}</span>
        <span className={`availability-tag availability-tag--${p.status}`}>{status.label}</span>
        <span className="veg-symbol" role="img" aria-label="Eggless version available on request" title="Eggless version available on request"></span>
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
            <span className="collection-eyebrow">OUR COLLECTION</span>
            <h2 className="collection-title">Our Signature <em>Creations</em></h2>
            <p className="collection-desc">
              Small-batch brownies, blondies and celebration cakes, made with real butter and finished by hand.
            </p>
          </div>
          <a className="text-link collection-action" href="#menu-grid" onClick={() => setCat("all")}>
            Explore all <i className="fas fa-arrow-right" aria-hidden="true"></i>
          </a>
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

        <div id="pricing" className="pricing-section">
          <div className="pricing-head">
            <span className="sub-tag"><i className="fas fa-receipt" aria-hidden="true"></i> Verified Price Index</span>
            <h3>Transparent Portion &amp; Price Index</h3>
          </div>

          <div className="table-responsive-box">
            <table className="pricing-table">
              <caption className="sr-only">Shafa's Dessert House price index</caption>
              <thead>
                <tr>
                  <th scope="col">Artisanal Item</th>
                  <th scope="col">Half Box / 500g</th>
                  <th scope="col">Full Box / 1 Kg</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {PRICE_ROWS.map((r) => (
                  <tr key={r.item}>
                    <th scope="row">{r.item}</th>
                    <td>{r.half}</td>
                    <td>{r.full}</td>
                    <td>
                      <a
                        href={waLink(`Hi! I'd like to order ${r.msg}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-order-wa btn-order-wa--compact"
                      >
                        Order
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
