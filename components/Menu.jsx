"use client";
import { useState } from "react";
import { FILTERS, PRICE_ROWS, PRODUCTS, img } from "@/lib/data";
import { orderItem, waLink } from "@/lib/whatsapp";

function ProductCard({ p }) {
  const [idx, setIdx] = useState(0);
  const portion = p.portions[idx];
  const single = p.portions.length === 1;

  return (
    <div className="product-card">
      <div className="product-thumbnail">
        <span className="product-tag">{p.tag}</span>
        <div className="veg-symbol" title="Vegetarian Friendly Available"></div>
        <img src={img(p.image)} alt={p.title} loading="lazy" />
      </div>
      <div className="product-info">
        <h3 className="product-name">{p.title}</h3>
        <p className="product-desc">{p.desc}</p>

        <div className="portion-tabs">
          {p.portions.map((o, i) => (
            <button
              key={o.label}
              className={`portion-tab ${i === idx ? "active" : ""}`}
              style={single ? { width: "100%" } : undefined}
              onClick={() => setIdx(i)}
            >
              {o.tab}
            </button>
          ))}
        </div>

        <div className="product-bottom">
          <div className="price-group">
            <span className="price-caption">Price</span>
            <span className="price-amount">₹{portion.price}</span>
          </div>
          <button className="btn-order-wa" onClick={() => orderItem(p.name, portion.label, `₹${portion.price}`)}>
            <i className="fab fa-whatsapp"></i> Order Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Menu() {
  const [cat, setCat] = useState("all");
  const visible = PRODUCTS.filter((p) => cat === "all" || p.categories.includes(cat));

  return (
    <section id="menu" className="menu-section">
      <div className="container">
        <div className="section-header">
          <span className="sub-tag"><i className="fas fa-utensils"></i> Artisanal Menu</span>
          <h2 className="section-title">Our Signature Creations</h2>
          <p className="section-desc">
            Each creation is baked strictly upon confirmed pre-order. Choose your favorite treats below or customize
            portions for your gathering.
          </p>
        </div>

        <div className="menu-filter-nav">
          {FILTERS.map((f) => (
            <button key={f.key} className={`filter-pill ${cat === f.key ? "active" : ""}`} onClick={() => setCat(f.key)}>
              <i className={`fas ${f.icon}`}></i> {f.label}
            </button>
          ))}
        </div>

        <div className="menu-grid">
          {visible.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>

        <div id="pricing" className="pricing-section">
          <div className="section-header" style={{ marginBottom: "2rem" }}>
            <span className="sub-tag"><i className="fas fa-receipt"></i> Verified Price Index</span>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "2.1rem", color: "var(--chocolate-deep)", marginBottom: "0.5rem" }}>
              Transparent Portion &amp; Price Index
            </h3>
            <p className="section-desc" style={{ fontSize: "0.95rem" }}>
              Every treat is made in small batches with real butter. Eggless variations available on request.
            </p>
          </div>

          <div className="table-responsive-box">
            <table className="pricing-table">
              <thead>
                <tr>
                  <th>Artisanal Item</th>
                  <th>Half Box / 500g</th>
                  <th>Full Box / 1 Kg</th>
                  <th>Pre-Order</th>
                </tr>
              </thead>
              <tbody>
                {PRICE_ROWS.map((r) => (
                  <tr key={r.item}>
                    <td>
                      <strong>{r.item}</strong>
                      {r.badge && <span className="tbl-badge">{r.badge}</span>}
                    </td>
                    {r.single ? (
                      <td colSpan={2} style={{ textAlign: "center", color: "var(--caramel-deep)", fontWeight: 700 }}>
                        {r.single}
                      </td>
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
                        className="btn-order-wa"
                        style={{ padding: "0.35rem 0.85rem", fontSize: "0.78rem" }}
                      >
                        Order <i className="fab fa-whatsapp"></i>
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
