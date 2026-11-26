"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import { buildInvoicePdf } from "@/lib/invoice/pdf";
import { inr, isValidPhone } from "@/lib/invoice/format";
import { downloadBlob, invoiceMessage, whatsappLink } from "@/lib/invoice/whatsapp";
import { PHONE } from "@/lib/whatsapp";
import s from "./PosApp.module.css";
import {
  PAYMENT_METHODS,
  POS_CATEGORIES,
  POS_PRODUCTS,
  TABLE_OPTIONS,
  orderToInvoice,
  type BillLine,
  type PaymentMethod,
  type PosCategory,
  type PosOrderRecord,
  type PosProduct,
  type PosSize,
} from "./posData";

type Props = {
  search: string;
  billNumber: string;
  tableLabel: string;
  onTableChange: (table: string) => void;
  lines: BillLine[];
  discount: string;
  delivery: string;
  payment: PaymentMethod;
  customerName: string;
  customerPhone: string;
  note: string;
  onDiscountChange: (v: string) => void;
  onDeliveryChange: (v: string) => void;
  onPaymentChange: (v: PaymentMethod) => void;
  onCustomerNameChange: (v: string) => void;
  onCustomerPhoneChange: (v: string) => void;
  onNoteChange: (v: string) => void;
  onAddProduct: (product: PosProduct, size: PosSize) => void;
  onChangeLineQty: (key: string, delta: number) => void;
  onRemoveLine: (key: string) => void;
  onResetOrder: () => void;
  onCompleteOrder: (status: "charged" | "draft") => PosOrderRecord;
};

const parseAmount = (v: string) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
};

export default function BillingWorkspace({
  search,
  billNumber,
  tableLabel,
  onTableChange,
  lines,
  discount,
  delivery,
  payment,
  customerName,
  customerPhone,
  note,
  onDiscountChange,
  onDeliveryChange,
  onPaymentChange,
  onCustomerNameChange,
  onCustomerPhoneChange,
  onNoteChange,
  onAddProduct,
  onChangeLineQty,
  onRemoveLine,
  onResetOrder,
  onCompleteOrder,
}: Props) {
  const [cat, setCat] = useState<PosCategory>("all");
  const [sizeFilter, setSizeFilter] = useState<"all" | PosSize>("all");
  const [cardSizes, setCardSizes] = useState<Record<string, PosSize>>({});
  const [showExtras, setShowExtras] = useState(false);
  const [mobileBillOpen, setMobileBillOpen] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<PosOrderRecord | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);

  const visibleProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return POS_PRODUCTS.filter((p) => {
      if (cat === "blondies" && !p.isBlondie) return false;
      if ((cat === "brownies" || cat === "cakes") && p.cat !== cat) return false;
      if (q && !`${p.name} ${p.cat}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [cat, search]);

  const itemCount = lines.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
  const discountVal = Math.min(parseAmount(discount), subtotal);
  const deliveryVal = parseAmount(delivery);
  const total = Math.max(0, subtotal - discountVal + deliveryVal);

  const qtyForProduct = (productId: string, size: PosSize) =>
    lines.find((l) => l.key === `${productId}|${size}`)?.qty ?? 0;

  const handleCharge = () => {
    if (!lines.length) return;
    const saved = onCompleteOrder("charged");
    setMobileBillOpen(false);
    setReceiptOrder(saved);
  };

  const handleSaveDraft = () => {
    if (!lines.length) return;
    onCompleteOrder("draft");
    setMobileBillOpen(false);
  };

  const handleDownloadPdf = async () => {
    if (!receiptOrder) return;
    setPdfBusy(true);
    try {
      const inv = orderToInvoice(receiptOrder);
      const blob = await buildInvoicePdf(inv);
      const safeName = inv.customer.name.replace(/\s+/g, "-") || "bill";
      downloadBlob(blob, `${inv.number}-${safeName}.pdf`);
    } finally {
      setPdfBusy(false);
    }
  };

  const handleSendWhatsApp = () => {
    if (!receiptOrder) return;
    const inv = orderToInvoice(receiptOrder);
    const targetPhone = isValidPhone(receiptOrder.customerPhone)
      ? receiptOrder.customerPhone
      : PHONE;
    window.open(whatsappLink(targetPhone, invoiceMessage(inv)), "_blank", "noopener");
  };

  return (
    <div className={s.billingLayout}>
      {/* Left / Center Food Catalog Area (Image 1 Alignment) */}
      <section className={s.catalogPane} aria-label="Menu items for billing">
        <div className={s.catalogToolbar}>
          <div className={s.catRow}>
            <div className={s.catTabs} role="tablist" aria-label="Food categories">
              {POS_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={cat === c.id}
                  className={`${s.catTab} ${cat === c.id ? s.catTabActive : ""}`}
                  onClick={() => setCat(c.id)}
                >
                  <span>{c.label}</span>
                  <span className={s.catCount}>{c.count}</span>
                </button>
              ))}
            </div>

            <div className={s.filterTools}>
              <select
                className={s.sizeFilterSelect}
                value={sizeFilter}
                onChange={(e) => {
                  const v = e.target.value as "all" | PosSize;
                  setSizeFilter(v);
                  if (v === "half" || v === "full") {
                    setCardSizes(Object.fromEntries(POS_PRODUCTS.map((p) => [p.id, v])));
                  }
                }}
                aria-label="Default portion size"
              >
                <option value="all">All Sizes</option>
                <option value="half">Half Portion</option>
                <option value="full">Full Portion</option>
              </select>
            </div>
          </div>
        </div>

        <div className={s.foodGrid}>
          {visibleProducts.map((product) => {
            const activeSize: PosSize =
              sizeFilter === "half" || sizeFilter === "full"
                ? sizeFilter
                : cardSizes[product.id] ?? "half";
            const inBillQty = qtyForProduct(product.id, activeSize);

            return (
              <article
                key={product.id}
                className={`${s.foodCard} ${inBillQty > 0 ? s.foodCardInBill : ""}`}
              >
                <button
                  type="button"
                  className={s.foodThumbBtn}
                  onClick={() => onAddProduct(product, activeSize)}
                  aria-label={`Tap to add ${product.name} (${activeSize})`}
                >
                  {product.photo ? (
                    <Image
                      src={product.photo}
                      alt={product.name}
                      fill
                      sizes="(max-width: 639px) 50vw, (max-width: 1279px) 25vw, 220px"
                      className={s.foodThumbImg}
                    />
                  ) : (
                    <div className={s.foodPlaceholder}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                        <path d="M4 14h16v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5Z" />
                        <path d="M4 14c0-2 2-3 4-3 1.5 0 2.5 1 4 1s2.5-1 4-1c2 0 4 1 4 3" />
                      </svg>
                    </div>
                  )}
                  {inBillQty > 0 && <span className={s.qtyPillOverlay}>{inBillQty}</span>}
                </button>

                <div className={s.foodBody}>
                  <button
                    type="button"
                    className={s.foodTitleBtn}
                    onClick={() => onAddProduct(product, activeSize)}
                  >
                    <h3 className={s.foodTitle}>{product.name}</h3>
                  </button>

                  <div className={s.sizePills} role="group" aria-label={`${product.name} portion`}>
                    {(["half", "full"] as PosSize[]).map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        className={`${s.sizePill} ${activeSize === sz ? s.sizePillActive : ""}`}
                        onClick={() => {
                          setSizeFilter("all");
                          setCardSizes((prev) => ({ ...prev, [product.id]: sz }));
                        }}
                      >
                        {sz === "half" ? "Half" : "Full"}
                      </button>
                    ))}
                  </div>

                  <div className={s.foodFoot}>
                    <span className={s.foodPrice}>{inr(product[activeSize])}</span>
                    <button
                      type="button"
                      className={s.addCircle}
                      onClick={() => onAddProduct(product, activeSize)}
                      aria-label={`Add ${product.name} (${activeSize}) to bill`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Right Current Order / Billing Panel */}
      <aside
        className={`${s.billPane} ${mobileBillOpen ? s.billPaneMobileOpen : ""}`}
        aria-label="Current bill"
      >
        <div className={s.billHead}>
          <div className={s.billHeadLeft}>
            <h2 className={s.billTitle}>Current Bill</h2>
            <select
              className={s.tableSelect}
              value={tableLabel}
              onChange={(e) => onTableChange(e.target.value)}
              aria-label="Select table or order type"
            >
              {TABLE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className={s.billHeadActions}>
            <button type="button" className={s.resetOrderBtn} onClick={onResetOrder}>
              Reset
            </button>
            <button
              type="button"
              className={s.closeMobileBill}
              onClick={() => setMobileBillOpen(false)}
              aria-label="Close bill panel"
            >
              ✕
            </button>
          </div>
        </div>

        <div className={s.billLines}>
          {lines.length === 0 ? (
            <div className={s.billEmpty}>
              <strong>No items billed yet</strong>
              <span>Tap any brownie or cake on the left to add it to {billNumber}.</span>
            </div>
          ) : (
            lines.map((line) => (
              <div key={line.key} className={s.billLine}>
                <div className={s.lineThumb}>
                  {line.photo ? (
                    <Image src={line.photo} alt="" fill sizes="44px" className={s.foodThumbImg} />
                  ) : (
                    <div className={s.foodPlaceholder} />
                  )}
                </div>

                <div className={s.lineInfo}>
                  <strong>{line.name}</strong>
                  <small>
                    {line.size === "half" ? "Half" : "Full"} · {inr(line.unitPrice)}
                  </small>
                </div>

                <div className={s.lineControls}>
                  <div className={s.stepper}>
                    <button
                      type="button"
                      onClick={() => onChangeLineQty(line.key, -1)}
                      aria-label={`Decrease ${line.name}`}
                    >
                      −
                    </button>
                    <span>{line.qty}</span>
                    <button
                      type="button"
                      onClick={() => onChangeLineQty(line.key, 1)}
                      aria-label={`Increase ${line.name}`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className={s.trashBtn}
                    onClick={() => onRemoveLine(line.key)}
                    aria-label={`Remove ${line.name}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M3 6h18" />
                      <path d="M8 6V4h8v2" />
                      <path d="M19 6l-1 14H6L5 6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={s.billExtras}>
          <button
            type="button"
            className={s.noteToggleBtn}
            onClick={() => setShowExtras((v) => !v)}
          >
            {showExtras ? "− Hide Customer & Note" : "+ Add Customer / Note"}
          </button>

          {showExtras && (
            <>
              <div className={s.customerGrid}>
                <input
                  className={s.miniInput}
                  placeholder="Customer name"
                  value={customerName}
                  onChange={(e) => onCustomerNameChange(e.target.value)}
                  aria-label="Customer name"
                />
                <input
                  className={s.miniInput}
                  placeholder="WhatsApp number"
                  inputMode="numeric"
                  value={customerPhone}
                  onChange={(e) => onCustomerPhoneChange(e.target.value)}
                  aria-label="Customer WhatsApp number"
                />
              </div>
              <input
                className={s.miniInput}
                placeholder="Order note (e.g. 100% Eggless, gift ribbon)"
                value={note}
                onChange={(e) => onNoteChange(e.target.value)}
                aria-label="Order note"
              />
            </>
          )}
        </div>

        <div className={s.billSummary}>
          <div className={s.adjRow}>
            <label className={s.adjField}>
              <span>Discount (₹)</span>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={discount}
                onChange={(e) => onDiscountChange(e.target.value)}
              />
            </label>
            <label className={s.adjField}>
              <span>Delivery (₹)</span>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={delivery}
                onChange={(e) => onDeliveryChange(e.target.value)}
              />
            </label>
          </div>

          <div className={s.sumLine}>
            <span>Subtotal ({itemCount})</span>
            <span>{inr(subtotal)}</span>
          </div>
          {discountVal > 0 && (
            <div className={s.sumLine}>
              <span>Discount</span>
              <span>−{inr(discountVal)}</span>
            </div>
          )}
          {deliveryVal > 0 && (
            <div className={s.sumLine}>
              <span>Delivery</span>
              <span>+{inr(deliveryVal)}</span>
            </div>
          )}
          <div className={s.sumTotal}>
            <span>Total</span>
            <span>{inr(total)}</span>
          </div>

          <div className={s.payRow} role="group" aria-label="Payment method">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method}
                type="button"
                className={`${s.payPill} ${payment === method ? s.payPillActive : ""}`}
                onClick={() => onPaymentChange(method)}
              >
                {method}
              </button>
            ))}
          </div>

          <button
            type="button"
            className={s.chargeBtn}
            disabled={!lines.length}
            onClick={handleCharge}
          >
            Charge {inr(total)} →
          </button>
          <button
            type="button"
            className={s.draftBtn}
            disabled={!lines.length}
            onClick={handleSaveDraft}
          >
            Save as Draft
          </button>
        </div>
      </aside>

      {/* Mobile / Tablet Bottom Bill Trigger */}
      {!mobileBillOpen && (
        <button
          type="button"
          className={s.mobileBillBar}
          onClick={() => setMobileBillOpen(true)}
        >
          <span>
            Current Bill · {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
          <span>{inr(total)} →</span>
        </button>
      )}

      {/* Bill Charged Confirmation Modal */}
      {receiptOrder && (
        <div className={s.modalOverlay} onClick={() => setReceiptOrder(null)}>
          <div className={s.modalCard} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className={s.modalHead}>
              <h3>Bill Charged · {receiptOrder.billNumber}</h3>
              <button
                type="button"
                className={s.closeMobileBill}
                onClick={() => setReceiptOrder(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <p className={s.panelSub}>
              {receiptOrder.tableLabel} · Paid via {receiptOrder.payment} ·{" "}
              <strong>{inr(receiptOrder.total)}</strong>
            </p>
            <button
              type="button"
              className={s.chargeBtn}
              disabled={pdfBusy}
              onClick={handleDownloadPdf}
            >
              {pdfBusy ? "Generating PDF…" : "Download PDF Invoice"}
            </button>
            <button type="button" className={s.waBtn} onClick={handleSendWhatsApp}>
              Send Receipt on WhatsApp
            </button>
            <button type="button" className={s.draftBtn} onClick={() => setReceiptOrder(null)}>
              Next Bill
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
