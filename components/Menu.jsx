"use client";
import { useState } from "react";
import { FILTERS, PRICE_ROWS, PRODUCTS, img } from "@/lib/data";
import { orderItem, waLink } from "@/lib/whatsapp";

function ProductCard({ p }) {
  const [idx, setIdx] = useState(0);
  const portion = p.portions[idx];
  const single = p.portions.length === 1;

  return (
    <article className={`product-card ${p.tag === "Bestseller" ? "is-featured" : ""}`}>
      <div className="product-thumbnail">
        <span className="product-tag">{p.tag}</span>
        <span className="veg-symbol" role="img" aria-label="Eggless version available on request" title="Eggless version available on request"></span>
        <img src={img(p.image)} alt={p.title} loading="lazy" />
      </div>
      <div className="product-info">
        <h3 className="product-name">{p.title}</h3>
        <p className="product-desc">{p.desc}</p>

        <div className="portion-tabs" role="group" aria-label={`Choose portion for ${p.title}`}>
          {p.portions.map((o, i) => (
            <button
              key={o.label}
              type="button"
              className={`portion-tab ${i === idx ? "active" : ""} ${single ? "portion-tab--full" : ""}`}
              aria-pressed={i === idx}
              onClick={() => setIdx(i)}
            >
              {o.tab}
            </button>
          ))}
        </div>

        <div className="product-bottom">
          <div className="price-group">
            <span className="price-caption">Starting at</span>
            <span className="price-amount">₹{portion.price.toLocaleString("en-IN")}</span>
          </div>
          <button
            type="button"
            className="btn-order-wa"
            onClick={() => orderItem(p.name, portion.label, `₹${portion.price}`)}
          >
            <i className="fab fa-whatsapp" aria-hidden="true"></i> Order Now
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Menu() {
  const [cat, setCat] = useState("all");
  const visible = PRODUCTS.filter((p) => cat === "all" || p.categories.includes(cat));

  return (
    <section id="menu" className="menu-section">
      <div className="container">
        <div className="section-header" data-index="02">
          <span className="sub-tag"><i className="fas fa-utensils" aria-hidden="true"></i> Artisanal Menu</span>
          <h2 className="section-title">Our Signature <em>Creations</em></h2>
          <p className="section-desc">
            Each creation is baked strictly upon confirmed pre-order. Choose your favorite treats below or customize
            portions for your gathering.
          </p>
        </div>

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

        <div className="menu-grid" aria-live="polite">
          {visible.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>

        <div id="pricing" className="pricing-section">
          <div className="pricing-head">
            <span className="sub-tag"><i className="fas fa-receipt" aria-hidden="true"></i> Verified Price Index</span>
            <h3>Transparent Portion &amp; Price Index</h3>
            <p className="section-desc">
              Every treat is made in small batches with real butter. Eggless variations available on request.
            </p>
          </div>

          <div className="table-responsive-box">
            <table className="pricing-table">
              <caption className="sr-only">Shafa's Dessert House pre-order price index</caption>
              <thead>
                <tr>
                  <th scope="col">Artisanal Item</th>
                  <th scope="col">Half Box / 500g</th>
                  <th scope="col">Full Box / 1 Kg</th>
                  <th scope="col">Pre-Order</th>
                </tr>
              </thead>
              <tbody>
                {PRICE_ROWS.map((r) => (
                  <tr key={r.item}>
                    <th scope="row">
                      {r.item}
                      {r.badge && <span className="tbl-badge">{r.badge}</span>}
                    </th>
                    {r.single ? (
                      <td className="single-price" colSpan={2}>{r.single}</td>
                    ) : (
                      <>
                        <td>{r.half}</td>
                        <td>{r.full}</td>
                      </>
                    )}
                    <td>
                      <a
                        href={waLink(`Hi! I'd like to order ${r.msg}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-order-wa btn-order-wa--compact"
                      >
                        Order <i className="fab fa-whatsapp" aria-hidden="true"></i>
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
