import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
