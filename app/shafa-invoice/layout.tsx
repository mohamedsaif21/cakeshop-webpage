import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Shafa's Invoice",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4D1E01",
};

export default function InvoiceLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
