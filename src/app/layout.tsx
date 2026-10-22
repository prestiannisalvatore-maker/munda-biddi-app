import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Stirling Ridge Walk | Western Australia Hiking Guide",
  description:
    "Complete guide to hiking the Stirling Ridge Walk in Stirling Range National Park, Western Australia. Trail info, itinerary, map, and gear checklist.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Stirling Ridge",
  },
  icons: {
    icon: [
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#b45309",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
          href="https://fonts.googleapis.com/css2?family=Pacifico&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-50 antialiased flex flex-col">
        <div className="bg-amber-700 text-white text-center py-2 text-sm">
          Built by <span className="font-semibold">Salvatore Prestianni</span>
        </div>
        <Navigation />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
