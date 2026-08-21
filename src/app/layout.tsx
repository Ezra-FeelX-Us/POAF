import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "POAF Digital Platform",
  description: "Pioneers of Africa's Future - A youth-led network building ideas, leadership, technology, and collaborative solutions for Africa's future.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-serif italic">
        {children}
      </body>
    </html>
  );
}
