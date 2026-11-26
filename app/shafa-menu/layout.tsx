import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./shafa.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Shafa's Dessert House | Digital Menu",
};

export const viewport: Viewport = {
  themeColor: "#4A1F02",
  width: "device-width",
  initialScale: 1,
};

export default function ShafaMenuLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`shafa-menu ${display.variable} ${body.variable}`}>
      {children}
    </div>
  );
}
