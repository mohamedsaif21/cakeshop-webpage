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

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 3500);
  }, []);

  const openLightbox = useCallback((src, title, desc) => {
    setLightbox({ src, title, desc });
    setOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <UIContext.Provider value={{ showToast, openLightbox }}>
      {children}

      <div className={`modal-lightbox ${open ? "active" : ""}`} onClick={closeLightbox}>
        <div className="lightbox-card" onClick={(e) => e.stopPropagation()}>
          <button className="lightbox-exit" onClick={closeLightbox} aria-label="Close">&times;</button>
          <div className="lightbox-photo-box">
            {lightbox && <img src={lightbox.src} alt={lightbox.title} />}
          </div>
          <div className="lightbox-body">
            <h3 className="lightbox-title-text">{lightbox?.title}</h3>
            <p className="lightbox-desc-text">{lightbox?.desc}</p>
            <div className="lightbox-actions">
              <span style={{ fontWeight: 700, color: "var(--caramel)", fontSize: "0.9rem" }}>
                Freshly Baked Upon Pre-Order
              </span>
              <button
                className="btn-order-wa"
                onClick={() => lightbox && orderItem(lightbox.title, "Standard Selection", "Inquire for Portions")}
              >
                <i className="fab fa-whatsapp"></i> Order on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`toast-pop ${toast.show ? "show" : ""}`} role="status">
        <i className="fas fa-check-circle" style={{ color: "var(--honey-gold)" }}></i>
        <span>{toast.msg}</span>
      </div>
    </UIContext.Provider>
  );
}
