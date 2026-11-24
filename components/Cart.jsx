"use client";
import { useEffect, useRef } from "react";
import { useCart } from "@/components/CartProvider";
import {
  MAX_QUANTITY,
  MIN_QUANTITY,
  buildCartOrderMessage,
  calculateOrderTotal,
  formatPrice,
  waLink,
} from "@/lib/whatsapp";

export default function Cart() {
  const {
    items,
    count,
    total,
    open,
    openCart,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const triggerRef = useRef(null);
  const reviewHref = waLink(buildCartOrderMessage(items));

  useEffect(() => {
    if (count === 0) {
      document.body.classList.remove("has-cart-items");
      return undefined;
    }

    document.body.classList.add("has-cart-items");
    return () => document.body.classList.remove("has-cart-items");
  }, [count]);

  useEffect(() => {
    if (!open) return undefined;

    triggerRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event) => {
      if (event.key === "Escape") {
        closeCart();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll("button:not(:disabled), a[href], input:not(:disabled)")
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      triggerRef.current?.focus?.();
    };
  }, [open, closeCart]);

  return (
    <>
      {count > 0 && (
        <button
          type="button"
          className="cart-floating"
          onClick={openCart}
          aria-label={`Open order: ${count} ${count === 1 ? "item" : "items"}, ${formatPrice(total)}`}
        >
          <i className="fas fa-basket-shopping" aria-hidden="true"></i>
          <span className="cart-floating-count" aria-hidden="true">{count}</span>
          <span className="cart-floating-total">{formatPrice(total)}</span>
        </button>
      )}

      {count > 0 && (
        <div className="cart-mobile-bar" aria-live="polite">
          <div className="cart-mobile-summary">
            <strong>{count} {count === 1 ? "item" : "items"}</strong>
            <span>{formatPrice(total)}</span>
          </div>
          <button type="button" className="btn-cart-view" onClick={openCart}>
            View Order <i className="fas fa-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
      )}

      {open && (
        <div
          className="cart-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeCart();
          }}
        >
          <aside className="cart-panel" ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="cart-title">
            <header className="cart-panel-head">
              <div>
                <span className="cart-panel-kicker">Your pre-order</span>
                <h2 id="cart-title">Review Your Treats</h2>
              </div>
              <button ref={closeRef} type="button" className="cart-close" onClick={closeCart} aria-label="Close order">
                &times;
              </button>
            </header>

            {items.length ? (
              <>
                <ul className="cart-items">
                  {items.map((item) => (
                    <li className="cart-item" key={item.key}>
                      <div className="cart-item-info">
                        <h3>{item.name}</h3>
                        <p>{item.size} <span aria-hidden="true">·</span> {item.pieces}</p>
                        <span className="cart-unit-price">{formatPrice(item.unitPrice)} each</span>
                      </div>
                      <div className="cart-item-actions">
                        <button
                          type="button"
                          className="cart-remove"
                          onClick={() => removeItem(item.key)}
                          aria-label={`Remove ${item.name} from order`}
                        >
                          <i className="fas fa-trash" aria-hidden="true"></i>
                        </button>
                        <div className="quantity-stepper cart-stepper" role="group" aria-label={`Quantity for ${item.name}`}>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.key, item.quantity - 1)}
                            disabled={item.quantity <= MIN_QUANTITY}
                            aria-label={`Decrease quantity for ${item.name}`}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min={MIN_QUANTITY}
                            max={MAX_QUANTITY}
                            value={item.quantity}
                            onChange={(event) => updateQuantity(item.key, event.target.value)}
                            aria-label={`Quantity for ${item.name}`}
                            inputMode="numeric"
                          />
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.key, item.quantity + 1)}
                            disabled={item.quantity >= MAX_QUANTITY}
                            aria-label={`Increase quantity for ${item.name}`}
                          >
                            +
                          </button>
                        </div>
                        <strong className="cart-subtotal">
                          {formatPrice(calculateOrderTotal(item.unitPrice, item.quantity))}
                        </strong>
                      </div>
                    </li>
                  ))}
                </ul>

                <footer className="cart-panel-foot">
                  <div className="cart-total-row">
                    <span>Order total</span>
                    <strong>{formatPrice(total)}</strong>
                  </div>
                  <div className="cart-actions">
                    <button type="button" className="btn-cart-clear" onClick={clearCart}>Clear order</button>
                    <a
                      className="btn-order-wa btn-cart-review"
                      href={reviewHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeCart}
                    >
                      Review Order <i className="fab fa-whatsapp" aria-hidden="true"></i>
                    </a>
                  </div>
                </footer>
              </>
            ) : (
              <div className="cart-empty">
                <span className="cart-empty-icon"><i className="fas fa-basket-shopping" aria-hidden="true"></i></span>
                <h3>Your order box is empty</h3>
                <p>Add a signature creation to start building your pre-order.</p>
                <button
                  type="button"
                  className="btn-cart-browse"
                  onClick={() => {
                    closeCart();
                    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Browse creations
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
