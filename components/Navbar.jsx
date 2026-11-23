"use client";
import { useEffect, useRef, useState } from "react";
import { NAV_LINKS } from "@/lib/data";
import { waLink } from "@/lib/whatsapp";

const HELLO = waLink("Hi Shafa's Dessert House! I'd like to place a fresh pre-order.");

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [active, setActive] = useState(NAV_LINKS[0].href);
  const toggleRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const targets = NAV_LINKS.map((l) => ({ href: l.href, el: document.querySelector(l.href) })).filter((t) => t.el);
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      let current = targets[0]?.href ?? NAV_LINKS[0].href;
      for (const t of targets) {
        if (t.el.getBoundingClientRect().top <= 140) current = t.href;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeDrawer = () => {
    setDrawer(false);
    toggleRef.current?.focus();
  };

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    if (drawer) closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape" && drawer) closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawer]);

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`} id="navbar" aria-label="Primary navigation">
        <div className="container nav-wrapper">
          <a href="#home" className="brand-logo" aria-label="Shafa's Dessert House home">
            <img src="/assest/img/shafa desert.png" alt="" />
            <div className="brand-text">
              <span className="brand-title">Shafa&apos;s Dessert House</span>
              <span className="brand-subtitle">Artisanal Home Bakery</span>
            </div>
          </a>

          <ul className="nav-menu">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`nav-link ${active === l.href ? "active" : ""}`}
                  aria-current={active === l.href ? "location" : undefined}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <a href={HELLO} target="_blank" rel="noopener noreferrer" className="btn-nav-order">
              <i className="fab fa-whatsapp" aria-hidden="true"></i> Order on WhatsApp
            </a>
            <button
              ref={toggleRef}
              className="mobile-toggle"
              onClick={() => setDrawer(true)}
              aria-label="Open navigation menu"
              aria-expanded={drawer}
              aria-controls="mobile-drawer"
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>

      <div className={`drawer-overlay ${drawer ? "active" : ""}`} onClick={closeDrawer} aria-hidden="true"></div>
      <div
        id="mobile-drawer"
        className={`mobile-drawer ${drawer ? "active" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!drawer}
        inert={!drawer}
      >
        <div>
          <div className="drawer-header">
            <div className="brand-text">
              <span className="brand-title">Shafa&apos;s</span>
              <span className="brand-subtitle">Artisanal Home Bakery</span>
            </div>
            <button ref={closeRef} className="drawer-close" onClick={closeDrawer} aria-label="Close navigation menu">
              &times;
            </button>
          </div>
          <ul className="drawer-links">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="drawer-link" onClick={closeDrawer}>
                  <span>{l.drawer}</span> <i className="fas fa-chevron-right" aria-hidden="true"></i>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <a href={HELLO} target="_blank" rel="noopener noreferrer" className="btn-primary drawer-cta">
            <i className="fab fa-whatsapp" aria-hidden="true"></i> Chat on WhatsApp
          </a>
          <p className="drawer-contact">
            <i className="fas fa-phone-alt" aria-hidden="true"></i> +91 90435 69743 &middot; Pre-Order Only
          </p>
        </div>
      </div>
    </>
  );
}
