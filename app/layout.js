import "./globals.css";
import UIProvider from "@/components/UIProvider";

export const metadata = {
  title: "Shafa's Dessert House | Artisanal Brownies & Bespoke Desserts",
  description:
    "Shafa's Dessert House — Premium handcrafted fudgy brownies, golden blondies, and celebration dream cakes. Baked fresh upon pre-order with pure butter and real cocoa.",
  icons: { icon: "/assest/img/shafa desert.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>
        <UIProvider>{children}</UIProvider>
      </body>
    </html>
  );
}
