import type { Metadata } from "next";
import { IBM_Plex_Sans, Russo_One } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/providers/cart-provider";
import { CartDrawer } from "@/components/store/cart-drawer";
import { siteConfig } from "@/lib/site";

const bodyFont = IBM_Plex_Sans({
  variable: "--font-body-face",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const displayFont = Russo_One({
  variable: "--font-display-face",
  subsets: ["latin", "cyrillic"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | Anime Streetwear`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${bodyFont.variable} ${displayFont.variable} antialiased`}>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
