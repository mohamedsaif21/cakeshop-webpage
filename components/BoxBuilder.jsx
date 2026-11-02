"use client";
import { useState } from "react";
import { BOX_SIZES, FLAVORS } from "@/lib/data";
import { openWhatsApp } from "@/lib/whatsapp";
import { useUI } from "./UIProvider";

export default function BoxBuilder() {
  const { showToast } = useUI();
  const [box, setBox] = useState(BOX_SIZES[0]);
  const [counts, setCounts] = useState(() => Object.fromEntries(FLAVORS.map((f) => [f.name, 0])));

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const complete = total === box.size;
  const pct = Math.min(100, Math.round((total / box.size) * 100));

  // Switching to a smaller box trims the selection so the count never exceeds capacity
  const chooseSize = (b) => {
    setBox(b);
    setCounts((prev) => {
      let sum = Object.values(prev).reduce((a, c) => a + c, 0);
      if (sum <= b.size) return prev;
      const next = { ...prev };
      for (const k of Object.keys(next).reverse()) {
        while (next[k] > 0 && sum > b.size) { next[k]--; sum--; }
      }
      return next;
    });
  };

  const update = (name, delta) => {
    if (delta > 0 && total >= box.size) {
      showToast(`Your box can hold max ${box.size} brownies!`);
      return;
    }
    if (delta < 0 && counts[name] <= 0) return;
    setCounts((c) => ({ ...c, [name]: c[name] + delta }));
  };

  const order = () => {
    if (!complete) {
      showToast(`Please pick exactly ${box.size} brownies before ordering!`);
      return;
    }
    const list = Object.entries(counts).filter(([, c]) => c > 0).map(([f, c]) => `• ${f}: ${c} pc(s)`);
    openWhatsApp(
      `Hi Shafa's Dessert House! I have assembled a Custom Brownie Box on your website:\n\n` +
        `📦 Box Size: ${box.size} Pieces\n💰 Total Price: ₹${box.price}\n\nSelections:\n${list.join("\n")}\n\n` +
        `Please let me know your earliest delivery/pickup date.`
    );
  };

  return (
    <section id="box-builder" className="box-builder-section">
      <div className="container">
        <div className="section-header">
          <span className="sub-tag"><i className="fas fa-magic"></i> Interactive Experience</span>
          <h2 className="section-title">Build Your Custom Brownie Box</h2>
          <p className="section-desc">
            Tailor your dream dessert box. Pick your preferred box size, mix and match your favorite brownie varieties,
            and dispatch your order directly to WhatsApp!
          </p>
        </div>

        <div className="builder-container">
          <div className="builder-step-title">
            <span className="step-circle">1</span>
            <h3 className="step-heading">Select Your Box Size</h3>
          </div>
          <div className="box-size-cards">
            {BOX_SIZES.map((b) => (
              <div key={b.size} className={`box-size-card ${box.size === b.size ? "selected" : ""}`} onClick={() => chooseSize(b)}>
                <div className="box-size-info">
                  <h4>{b.title}</h4>
                  <p>{b.text}</p>
                </div>
                <div className="box-size-price">₹{b.price.toLocaleString("en-IN")}</div>
              </div>
            ))}
          </div>

          <div className="builder-step-title">
            <span className="step-circle">2</span>
            <h3 className="step-heading">Choose Your Flavors</h3>
          </div>
          <div className="flavors-picker-grid">
            {FLAVORS.map((f) => (
              <div className="flavor-card" key={f.name}>
                <div className="flavor-meta">
                  <h5>{f.name}</h5>
                  <span>{f.note}</span>
                </div>
                <div className="count-controls">
                  <button className="count-btn" onClick={() => update(f.name, -1)} aria-label={`Remove ${f.name}`}>-</button>
                  <span className="count-display">{counts[f.name]}</span>
                  <button className="count-btn" onClick={() => update(f.name, 1)} aria-label={`Add ${f.name}`}>+</button>
                </div>
              </div>
            ))}
          </div>

          <div className="builder-summary">
            <div className="status-box">
              <div className="status-header">
                <span>Box Fill Status:</span>
                <span className="highlight" style={{ color: complete ? "#25D366" : "var(--honey-gold)" }}>
                  {complete ? `Box complete! (${total}/${box.size})` : `${total} of ${box.size} selected`}
                </span>
              </div>
              <div className="bar-shell"><div className="bar-inner" style={{ width: `${pct}%` }}></div></div>
            </div>

            <div className="builder-checkout">
              <div className="total-display">
                <div className="total-lbl">Total Box Price</div>
                <div className="total-val">₹{box.price.toLocaleString("en-IN")}</div>
              </div>
              <button className="btn-box-checkout" onClick={order} disabled={!complete}>
                <i className="fab fa-whatsapp"></i> Order Custom Box
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
