"use client";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/data";
import { waLink } from "@/lib/whatsapp";

const HELLO = waLink("Hi Shafa's Dessert House! I'd like to place a fresh pre-order.");

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
  }, [drawer]);

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`} id="navbar">
        <div className="container nav-wrapper">
          <a href="#home" className="brand-logo" aria-label="Shafa's Dessert House Home">
            <img src="/assest/img/shafa desert.png" alt="Shafa's Dessert House Emblem" />
            <div className="brand-text">
              <span className="brand-title">Shafa&apos;s Dessert House</span>
              <span className="brand-subtitle">Artisanal Home Bakery</span>
            </div>
          </a>

          <ul className="nav-menu">
            {NAV_LINKS.map((l, i) => (
              <li key={l.href}>
                <a href={l.href} className={`nav-link ${i === 0 ? "active" : ""}`}>{l.label}</a>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <a href={HELLO} target="_blank" rel="noopener noreferrer" className="btn-nav-order">
              <i className="fab fa-whatsapp"></i> Order on WhatsApp
            </a>
            <button className="mobile-toggle" onClick={() => setDrawer(true)} aria-label="Toggle navigation menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>

      <div className={`drawer-overlay ${drawer ? "active" : ""}`} onClick={() => setDrawer(false)}></div>
      <div className={`mobile-drawer ${drawer ? "active" : ""}`}>
        <div>
          <div className="drawer-header">
            <div className="brand-text">
              <span className="brand-title">Shafa&apos;s</span>
              <span className="brand-subtitle">Artisanal Patisserie</span>
            </div>
            <button className="drawer-close" onClick={() => setDrawer(false)} aria-label="Close menu">&times;</button>
          </div>
          <ul className="drawer-links">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="drawer-link" onClick={() => setDrawer(false)}>
                  {l.drawer} <i className="fas fa-chevron-right"></i>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ marginTop: "2rem" }}>
          <a href={HELLO} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
            <i className="fab fa-whatsapp"></i> Chat on WhatsApp
          </a>
          <p style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--chocolate-muted)", marginTop: "1rem" }}>
            📞 +91 90435 69743 • Pre-Order Only
          </p>
        </div>
      </div>
    </>
  );
}
