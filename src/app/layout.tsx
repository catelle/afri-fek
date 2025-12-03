import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Afri-Fek - Plateforme de Recherche Africaine",
  description: "Découvrez et explorez les ressources de recherche africaines - journaux, articles, institutions et universités.",
  icons: {
    icon: "/logo-afri-removebg-preview.png",
    shortcut: "/logo-afri-removebg-preview.png",
    apple: "/logo-afri-removebg-preview.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}