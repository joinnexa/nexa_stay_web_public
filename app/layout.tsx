import React from "react";
import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexa Stays — Book Stays in Morocco with Real Trust",
  description:
    "Verified people. Verified properties. Clear check-ins. Book stays in Morocco with real trust.",
  icons: {
    icon: [
      {
        url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=32&q=80",
        sizes: "32x32",
        type: "image/jpeg",
      },
    ],
  },
};

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
