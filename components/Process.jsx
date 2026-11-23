"use client";
import { useRef, useState } from "react";
import { FAQS, STEPS } from "@/lib/data";

export default function Process() {
  const [open, setOpen] = useState(null);
  const drawers = useRef([]);

  return (
    <section id="how-to-order" className="process-section">
      <div className="container">
        <div className="section-header" data-index="04">
          <span className="sub-tag"><i className="fas fa-clipboard-check" aria-hidden="true"></i> Seamless Experience</span>
          <h2 className="section-title">How <em>Pre-Ordering</em> Works</h2>
          <p className="section-desc">
            Since our kitchen bakes purely small-batch goods with zero preservatives, pre-ordering guarantees peak freshness.
          </p>
        </div>

        <ol className="steps-container">
          <span className="steps-rule" aria-hidden="true"></span>
          {STEPS.map((s) => (
            <li className="step-block" key={s.n}>
              <span className="step-num">{s.n}</span>
              <div className="step-icon-circle"><i className={s.icon} aria-hidden="true"></i></div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="savor-card">
          <div className="savor-text">
            <span className="sub-tag"><i className="fas fa-lightbulb" aria-hidden="true"></i> Chef&apos;s Secrets</span>
            <h3>How to Savor Your Treats for Maximum Pleasure</h3>
            <p>
              Brownies and artisanal cakes taste vastly different based on how they are enjoyed. Here is our secret guide
              to getting that warm, gooey restaurant-quality texture at home!
            </p>
          </div>

          <div className="savor-accordion">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <div className="accordion-block" key={f.q}>
                  <button
                    type="button"
                    className={`accordion-btn ${isOpen ? "active" : ""}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-drawer-${i}`}
                    id={`faq-button-${i}`}
                  >
                    <span>{f.q}</span>
                    <i className="fas fa-chevron-down" aria-hidden="true"></i>
                  </button>
                  <div
                    id={`faq-drawer-${i}`}
                    className="accordion-drawer"
                    role="region"
                    aria-labelledby={`faq-button-${i}`}
                    ref={(el) => (drawers.current[i] = el)}
                    style={{ maxHeight: isOpen ? drawers.current[i]?.scrollHeight : 0 }}
                  >
                    <p>{f.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
