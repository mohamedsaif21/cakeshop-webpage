"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { orderItem } from "@/lib/whatsapp";

const UIContext = createContext(null);
export const useUI = () => useContext(UIContext);

export default function UIProvider({ children }) {
  const [lightbox, setLightbox] = useState(null);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });
  const timer = useRef(null);
  const closeRef = useRef(null);
  const cardRef = useRef(null);
  const triggerRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 3500);
  }, []);

  const openLightbox = useCallback((src, title, desc) => {
    triggerRef.current = document.activeElement;
    setLightbox({ src, title, desc });
    setOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setOpen(false);
    setLightbox(null);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        closeLightbox();
        return;
      }
      if (e.key !== "Tab" || !cardRef.current) return;
      const focusable = Array.from(cardRef.current.querySelectorAll("button, a[href], [tabindex]:not([tabindex='-1'])"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      triggerRef.current?.focus?.();
    };
  }, [open, closeLightbox]);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <UIContext.Provider value={{ showToast, openLightbox }}>
      {children}

      {open && lightbox && (
        <div className="modal-lightbox" onMouseDown={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}>
          <div
            className="lightbox-card"
            ref={cardRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
            aria-describedby="lightbox-desc"
          >
            <button ref={closeRef} className="lightbox-exit" onClick={closeLightbox} aria-label="Close image details">
              &times;
            </button>
            <div className="lightbox-photo-box">
              <img src={lightbox.src} alt={lightbox.title} />
            </div>
            <div className="lightbox-body">
              <h2 className="lightbox-title-text" id="lightbox-title">{lightbox.title}</h2>
              <p className="lightbox-desc-text" id="lightbox-desc">{lightbox.desc}</p>
              <p className="lightbox-note">Freshly baked upon pre-order</p>
              <div className="lightbox-actions">
                <button
                  type="button"
                  className="btn-order-wa"
                  onClick={() => orderItem(lightbox.title, "Standard Selection", "Inquire for Portions")}
                >
                  <i className="fab fa-whatsapp" aria-hidden="true"></i> Order on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`toast-pop ${toast.show ? "show" : ""}`} role="status" aria-live="polite" aria-atomic="true">
        <i className="fas fa-check-circle" aria-hidden="true"></i>
        <span>{toast.msg}</span>
      </div>
    </UIContext.Provider>
  );
}
