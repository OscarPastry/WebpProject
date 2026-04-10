import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlavorForge — Recipe Platform",
  description: "A brutalist recipe platform for discovering and sharing culinary experiments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--fg)] antialiased">
        {children}
      </body>
    </html>
  );
}
