import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

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
      <body className="min-h-screen flex flex-col bg-[#fdf9ee] text-black antialiased">
        <Navbar />
        {/* pt-20 to clear the fixed navbar */}
        <main className="flex-1 pt-20 w-full">
          {children}
        </main>

      </body>
    </html>
  );
}
