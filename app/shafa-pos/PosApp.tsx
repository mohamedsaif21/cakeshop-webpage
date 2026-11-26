"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { commitInvoiceNumber, peekInvoiceNumber } from "@/lib/invoice/format";
import BillingWorkspace from "./BillingWorkspace";
import s from "./PosApp.module.css";
import PosViews from "./PosViews";
import {
  POS_DRAFT_KEY,
  POS_ORDERS_KEY,
  type BillLine,
  type PaymentMethod,
  type PosOrderRecord,
  type PosProduct,
  type PosSection,
  type PosSize,
} from "./posData";

type NavItem = {
  id: PosSection;
  label: string;
  icon: ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="3" width="7" height="9" rx="2" />
        <rect x="14" y="3" width="7" height="5" rx="2" />
        <rect x="14" y="12" width="7" height="9" rx="2" />
        <rect x="3" y="16" width="7" height="5" rx="2" />
      </svg>
    ),
  },
  {
    id: "menu",
    label: "My Menu",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    id: "billing",
    label: "Billing",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 2v20l3-2 3 2 2-2 2 2 3-2 3 2V2H4z" />
        <path d="M8 7h8" />
        <path d="M8 11h8" />
        <path d="M8 15h5" />
      </svg>
    ),
  },
  {
    id: "orders",
    label: "Orders",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M6 7h12l-1 13H7L6 7Z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
      </svg>
    ),
  },
  {
    id: "tables",
    label: "Tables",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 7h18" />
        <path d="M5 7v11" />
        <path d="M19 7v11" />
        <path d="M9 12h6v6H9z" />
      </svg>
    ),
  },
  {
    id: "customers",
    label: "Customers",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: "loyalty",
    label: "Loyalty",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
];

const parseAmount = (v: string) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
};

export default function PosApp() {
  const [section, setSection] = useState<PosSection>("billing");
  const [search, setSearch] = useState("");
  const [billNumber, setBillNumber] = useState("SDH-0001");
  const [tableLabel, setTableLabel] = useState("Takeaway");
  const [lines, setLines] = useState<BillLine[]>([]);
  const [discount, setDiscount] = useState("");
  const [delivery, setDelivery] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("UPI");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [note, setNote] = useState("");
  const [orders, setOrders] = useState<PosOrderRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setBillNumber(peekInvoiceNumber());
    try {
      const rawOrders = localStorage.getItem(POS_ORDERS_KEY);
      if (rawOrders) setOrders(JSON.parse(rawOrders));
      const rawDraft = localStorage.getItem(POS_DRAFT_KEY);
      if (rawDraft) {
        const d = JSON.parse(rawDraft);
        if (Array.isArray(d.lines)) setLines(d.lines);
        if (d.tableLabel) setTableLabel(d.tableLabel);
        if (d.payment) setPayment(d.payment);
        if (typeof d.discount === "string") setDiscount(d.discount);
        if (typeof d.delivery === "string") setDelivery(d.delivery);
        if (typeof d.customerName === "string") setCustomerName(d.customerName);
        if (typeof d.customerPhone === "string") setCustomerPhone(d.customerPhone);
        if (typeof d.note === "string") setNote(d.note);
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(POS_ORDERS_KEY, JSON.stringify(orders));
      localStorage.setItem(
        POS_DRAFT_KEY,
        JSON.stringify({ lines, tableLabel, payment, discount, delivery, customerName, customerPhone, note })
      );
    } catch {}
  }, [orders, lines, tableLabel, payment, discount, delivery, customerName, customerPhone, note, loaded]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const addProduct = useCallback((product: PosProduct, size: PosSize) => {
    const key = `${product.id}|${size}`;
    setLines((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing) {
        return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(30, l.qty + 1) } : l));
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          size,
          unitPrice: product[size],
          qty: 1,
          photo: product.photo,
        },
      ];
    });
  }, []);

  const changeLineQty = useCallback((key: string, delta: number) => {
    setLines((prev) =>
      prev.flatMap((l) => {
        if (l.key !== key) return [l];
        const next = l.qty + delta;
        return next <= 0 ? [] : [{ ...l, qty: Math.min(30, next) }];
      })
    );
  }, []);

  const removeLine = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const resetOrder = useCallback(() => {
    setLines([]);
    setDiscount("");
    setDelivery("");
    setPayment("UPI");
    setCustomerName("");
    setCustomerPhone("");
    setNote("");
  }, []);

  const completeOrder = useCallback(
    (status: "charged" | "draft"): PosOrderRecord => {
      const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
      const discountVal = Math.min(parseAmount(discount), subtotal);
      const deliveryVal = parseAmount(delivery);
      const total = Math.max(0, subtotal - discountVal + deliveryVal);

      const record: PosOrderRecord = {
        id: `${Date.now()}`,
        billNumber,
        createdAt: new Date().toISOString(),
        status,
        tableLabel,
        payment,
        customerName,
        customerPhone,
        note,
        lines,
        subtotal,
        discount: discountVal,
        delivery: deliveryVal,
        total,
      };

      setOrders((prev) => [record, ...prev]);
      if (status === "charged") {
        commitInvoiceNumber();
        setBillNumber(peekInvoiceNumber());
      }
      resetOrder();
      return record;
    },
    [lines, discount, delivery, billNumber, tableLabel, payment, customerName, customerPhone, note, resetOrder]
  );

  const resumeDraft = useCallback((draft: PosOrderRecord) => {
    setLines(draft.lines);
    setTableLabel(draft.tableLabel);
    setPayment(draft.payment);
    setDiscount(draft.discount ? String(draft.discount) : "");
    setDelivery(draft.delivery ? String(draft.delivery) : "");
    setCustomerName(draft.customerName);
    setCustomerPhone(draft.customerPhone);
    setNote(draft.note);
    setOrders((prev) => prev.filter((o) => o.id !== draft.id));
    setSection("billing");
  }, []);

  const activeTitle =
    section === "billing"
      ? "Billing"
      : NAV_ITEMS.find((n) => n.id === section)?.label ?? "Settings";

  return (
    <div className={s.shell}>
      {/* Left Vertical Dark-Chocolate Icon Rail (Image 2 Shell) */}
      <aside className={s.rail} aria-label="POS Navigation">
        <Link href="/" className={s.railBrand} title="Shafa's Dessert House">
          <img src="/shafa-menu/logo.png" alt="Shafa's Dessert House" className={s.railLogo} />
          <span className={s.railMobileTitle}>Shafa POS</span>
        </Link>

        <nav className={s.railNav}>
          {NAV_ITEMS.map((item) => {
            const active = section === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`${s.railBtn} ${active ? s.railBtnActive : ""}`}
                onClick={() => setSection(item.id)}
                title={item.label}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
              >
                {item.icon}
                {item.id === "orders" && orders.length > 0 && (
                  <span className={s.railBadge}>{orders.length}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className={s.railBottom}>
          <button
            type="button"
            className={`${s.railBtn} ${section === "settings" ? s.railBtnActive : ""}`}
            onClick={() => setSection("settings")}
            title="Settings"
            aria-label="Settings"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
          <Link href="/" className={s.railBtn} title="Back to Website" aria-label="Back to Website">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </Link>
        </div>
      </aside>

      {/* Rounded Bright Workspace Container (Image 2 Shell) */}
      <div className={s.workspaceFrame}>
        <main className={s.workspace}>
          <header className={s.topBar}>
            <div className={s.topLeft}>
              <h1 className={s.pageTitle}>{activeTitle}</h1>
              <span className={s.billTag}>{billNumber}</span>
            </div>

            <div className={s.globalSearchWrap}>
              <svg className={s.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={searchRef}
                type="search"
                className={s.globalSearch}
                placeholder="Search brownies, cakes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search POS items"
              />
              <span className={s.kbdHint}>Ctrl K</span>
            </div>

            <div className={s.topRight}>
              <button
                type="button"
                className={s.topIconBtn}
                onClick={() => setSection("orders")}
                title="Recent Orders"
                aria-label="View orders"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {orders.length > 0 && <span className={s.topIconDot} />}
              </button>

              <Link href="/shafa-invoice" className={s.topIconBtn} title="Open Invoice Builder" aria-label="Open Invoice Builder">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </Link>

              <div className={s.staffChip}>
                <img src="/shafa-menu/logo.png" alt="" className={s.staffAvatar} />
                <div className={s.staffMeta}>
                  <strong>Shafa Cashier</strong>
                  <small>Admin POS</small>
                </div>
              </div>
            </div>
          </header>

          {section === "billing" ? (
            <BillingWorkspace
              search={search}
              billNumber={billNumber}
              tableLabel={tableLabel}
              onTableChange={setTableLabel}
              lines={lines}
              discount={discount}
              delivery={delivery}
              payment={payment}
              customerName={customerName}
              customerPhone={customerPhone}
              note={note}
              onDiscountChange={setDiscount}
              onDeliveryChange={setDelivery}
              onPaymentChange={setPayment}
              onCustomerNameChange={setCustomerName}
              onCustomerPhoneChange={setCustomerPhone}
              onNoteChange={setNote}
              onAddProduct={addProduct}
              onChangeLineQty={changeLineQty}
              onRemoveLine={removeLine}
              onResetOrder={resetOrder}
              onCompleteOrder={completeOrder}
            />
          ) : (
            <PosViews
              section={section}
              orders={orders}
              activeTable={tableLabel}
              onSelectTableForBilling={(tbl) => {
                setTableLabel(tbl);
                setSection("billing");
              }}
              onResumeDraft={resumeDraft}
              onGoToBilling={() => setSection("billing")}
            />
          )}
        </main>
      </div>
    </div>
  );
}
