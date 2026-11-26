import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./pos.css";

export const metadata: Metadata = {
  title: "Shafa's Dessert House | POS",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#341501",
};

export default function ShafaPosLayout({ children }: { children: ReactNode }) {
  return <div className="shafa-pos">{children}</div>;
}
