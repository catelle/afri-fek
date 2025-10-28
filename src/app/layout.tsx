import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import FloatingHomeButton from '@/components/FloatingHomeButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';

export const metadata: Metadata = {
  title: "Afri-Fek | Health Research Platform",
  description: "Discover health journals, academies, and research institutions across Africa",
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
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="antialiased">
        {children}
        <FloatingHomeButton />
        <ScrollToTopButton />
      </body>
    </html>
  );
}
