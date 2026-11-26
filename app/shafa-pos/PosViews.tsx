"use client";
import Link from "next/link";
import { inr } from "@/lib/invoice/format";
import s from "./PosApp.module.css";
import {
  POS_PRODUCTS,
  TABLE_OPTIONS,
  type PosOrderRecord,
  type PosSection,
} from "./posData";

type Props = {
  section: Exclude<PosSection, "billing">;
  orders: PosOrderRecord[];
  activeTable: string;
  onSelectTableForBilling: (table: string) => void;
  onResumeDraft: (order: PosOrderRecord) => void;
  onGoToBilling: () => void;
};

export default function PosViews({
  section,
  orders,
  activeTable,
  onSelectTableForBilling,
  onResumeDraft,
  onGoToBilling,
}: Props) {
  const chargedOrders = orders.filter((o) => o.status === "charged");
  const draftOrders = orders.filter((o) => o.status === "draft");
  const totalRevenue = chargedOrders.reduce((sum, o) => sum + o.total, 0);

  if (section === "dashboard") {
    return (
      <div className={s.moduleWrap}>
        <div className={s.statGrid}>
          <div className={s.statCard}>
            <small>Session Sales</small>
            <strong>{inr(totalRevenue)}</strong>
          </div>
          <div className={s.statCard}>
            <small>Charged Bills</small>
            <strong>{chargedOrders.length}</strong>
          </div>
          <div className={s.statCard}>
            <small>Saved Drafts</small>
            <strong>{draftOrders.length}</strong>
          </div>
          <div className={s.statCard}>
            <small>Active Menu Items</small>
            <strong>{POS_PRODUCTS.length}</strong>
          </div>
        </div>
        <div className={s.panelCard}>
          <h3>Cafe POS Overview</h3>
          <p className={s.panelSub}>
            Billing is live and connected to your dessert catalog and PDF/WhatsApp invoicing. Full analytics charts will expand here next.
          </p>
          <button type="button" className={s.chargeBtn} style={{ maxWidth: 240 }} onClick={onGoToBilling}>
            Open Billing POS →
          </button>
        </div>
      </div>
    );
  }

  if (section === "menu") {
    return (
      <div className={s.moduleWrap}>
        <div className={s.panelCard}>
          <h3>My Menu ({POS_PRODUCTS.length} Treats)</h3>
          <p className={s.panelSub}>
            Live items used in Billing POS. Customer digital storefront is available at{" "}
            <Link href="/shafa-menu" style={{ color: "var(--pos-dark-caramel)", fontWeight: 700 }}>
              /shafa-menu
            </Link>
            .
          </p>
          <div className={s.orderList}>
            {POS_PRODUCTS.map((item) => (
              <div key={item.id} className={s.orderRow}>
                <div>
                  <strong>{item.name}</strong>
                  <div style={{ fontSize: "0.78rem", color: "var(--pos-choc-muted)" }}>
                    {item.isBlondie ? "Blondies" : item.cat === "cakes" ? "Cakes" : "Brownies"}
                  </div>
                </div>
                <div style={{ fontWeight: 700 }}>
                  Half {inr(item.half)} · Full {inr(item.full)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (section === "orders") {
    return (
      <div className={s.moduleWrap}>
        <div className={s.panelCard}>
          <h3>Orders &amp; Drafts ({orders.length})</h3>
          <p className={s.panelSub}>
            Bills charged or saved as drafts from the Billing screen appear here.
          </p>
          {orders.length === 0 ? (
            <button type="button" className={s.chargeBtn} style={{ maxWidth: 220 }} onClick={onGoToBilling}>
              Create First Bill →
            </button>
          ) : (
            <div className={s.orderList}>
              {orders.map((ord) => (
                <div key={ord.id} className={s.orderRow}>
                  <div>
                    <strong>
                      {ord.billNumber} · {ord.tableLabel}
                    </strong>
                    <div style={{ fontSize: "0.78rem", color: "var(--pos-choc-muted)" }}>
                      {ord.lines.reduce((a, l) => a + l.qty, 0)} items · {ord.payment}
                      {ord.customerName ? ` · ${ord.customerName}` : ""}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      className={`${s.statusPill} ${
                        ord.status === "charged" ? s.statusCharged : s.statusDraft
                      }`}
                    >
                      {ord.status}
                    </span>
                    <strong>{inr(ord.total)}</strong>
                    {ord.status === "draft" && (
                      <button
                        type="button"
                        className={s.resetOrderBtn}
                        onClick={() => onResumeDraft(ord)}
                      >
                        Resume
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (section === "tables") {
    return (
      <div className={s.moduleWrap}>
        <div className={s.panelCard}>
          <h3>Tables &amp; Order Channels</h3>
          <p className={s.panelSub}>
            Select a table or channel to assign directly to your active Billing order.
          </p>
          <div className={s.tableGrid}>
            {TABLE_OPTIONS.map((tbl) => (
              <button
                key={tbl}
                type="button"
                className={`${s.tableTile} ${activeTable === tbl ? s.tableTileActive : ""}`}
                onClick={() => onSelectTableForBilling(tbl)}
              >
                <strong>{tbl}</strong>
                <small style={{ opacity: 0.78 }}>
                  {activeTable === tbl ? "Active in Billing" : "Tap to bill"}
                </small>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const copy: Record<"customers" | "loyalty" | "settings", { title: string; desc: string }> = {
    customers: {
      title: "Customers",
      desc: "Customer directory and WhatsApp contact history will be built here in the next step.",
    },
    loyalty: {
      title: "Loyalty & Rewards",
      desc: "Repeat-buyer stamps, brownie box rewards, and festive promo rules will be built here next.",
    },
    settings: {
      title: "POS Settings",
      desc: "Shop profile, invoice numbering, and tax/packaging defaults for Shafa's Dessert House.",
    },
  };

  const info = copy[section];
  return (
    <div className={s.moduleWrap}>
      <div className={s.panelCard}>
        <h3>{info.title}</h3>
        <p className={s.panelSub}>{info.desc}</p>
        <button type="button" className={s.chargeBtn} style={{ maxWidth: 220 }} onClick={onGoToBilling}>
          Return to Billing →
        </button>
      </div>
    </div>
  );
}
