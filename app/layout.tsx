import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const slate = localFont({
  src: [
    {
      path: "../fonts/SlateRg.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/SlateBold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-slate",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Billing & payments — Meta Ads Manager",
  description: "Invoices",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={slate.variable}>
      <body>{children}</body>
    </html>
  );
}
