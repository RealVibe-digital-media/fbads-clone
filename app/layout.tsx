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

const facebookSans = localFont({
  src: [
    {
      path: "../fonts/FacebookSansLight.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/FacebookSansRegular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/FacebookSansBold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/FacebookSansHeavy.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-fb",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Facebook",
  description: "Facebook",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${slate.variable} ${facebookSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
