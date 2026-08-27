import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import CacheReset from "@/components/CacheReset";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "Australind Munda Biddi",
  description:
    "Train to Bunbury, five days on the northern Munda Biddi to Mandurah — itinerary, logistics, and live GPS for Zino & Sam.",
  applicationName: "Australind Munda Biddi",
  appleWebApp: {
    title: "Australind Munda",
    statusBarStyle: "default",
    capable: true,
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef3ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1612" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <CacheReset />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
