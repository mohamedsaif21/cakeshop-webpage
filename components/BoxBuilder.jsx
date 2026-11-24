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
        <div className="section-header" data-index="03">
          <h2 className="section-title">Build Your <em>Custom Brownie Box</em></h2>
        </div>

        <div className="builder-container">
          <div className="builder-main">
            <div className="builder-step-title">
              <span className="step-circle">1</span>
              <h3 className="step-heading">Select Your Box Size</h3>
            </div>
            <div className="box-size-cards" role="group" aria-label="Choose a box size">
              {BOX_SIZES.map((b) => (
                <button
                  key={b.size}
                  type="button"
                  className={`box-size-card ${box.size === b.size ? "selected" : ""}`}
                  aria-pressed={box.size === b.size}
                  onClick={() => chooseSize(b)}
                >
                  <span className="box-size-info">
                    <span className="box-size-title">{b.title}</span>
                    <span className="box-size-text">{b.text}</span>
                  </span>
                  <span className="box-size-price">₹{b.price.toLocaleString("en-IN")}</span>
                </button>
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
                  <div className="count-controls" role="group" aria-label={`Quantity of ${f.name}`}>
                    <button className="count-btn" type="button" onClick={() => update(f.name, -1)} aria-label={`Remove one ${f.name}`}>&minus;</button>
                    <span className="count-display" aria-live="polite">{counts[f.name]}</span>
                    <button className="count-btn" type="button" onClick={() => update(f.name, 1)} aria-label={`Add one ${f.name}`}>+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="builder-aside" aria-label="Your box summary">
            <div className="builder-summary">
              <div className="status-box">
                <div className="status-header">
                  <span>Box Fill Status</span>
                  <span className={`highlight ${complete ? "complete" : ""}`} aria-live="polite">
                    {complete ? `Complete! (${total}/${box.size})` : `${total} of ${box.size} selected`}
                  </span>
                </div>
                <div
                  className="bar-shell"
                  role="progressbar"
                  aria-label="Box fill progress"
                  aria-valuenow={total}
                  aria-valuemin={0}
                  aria-valuemax={box.size}
                >
                  <div className="bar-inner" style={{ width: `${pct}%` }}></div>
                </div>
              </div>

              <div className="builder-checkout">
                <div className="total-display">
                  <span className="total-lbl">Total Box Price</span>
                  <span className="total-val">₹{box.price.toLocaleString("en-IN")}</span>
                </div>
                <button className="btn-box-checkout" type="button" onClick={order} disabled={!complete}>
                  Order Custom Box
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
