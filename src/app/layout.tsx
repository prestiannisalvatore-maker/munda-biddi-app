import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Providers from "@/components/Providers";
import TripBanner from "@/components/TripBanner";

export const metadata: Metadata = {
  title: "Zino and Sam Prestianni — Australind Munda Biddi",
  description:
    "Australind Munda Biddi trip 21–25 Sep 2026 (Bunbury to Mandurah) plus Mundaring to Albany end-to-end planning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-50 antialiased">
        <Providers>
          <Navigation />
          <TripBanner />
          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
