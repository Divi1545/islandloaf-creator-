import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IslandLoaf Creator Marketplace",
  description: "Where brands launch campaigns and creators compete for prizes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
