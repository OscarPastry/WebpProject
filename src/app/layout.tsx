import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { StatsFooter } from "@/components/StatsFooter";

export const metadata: Metadata = {
  title: "FlavorForge — DB Explorer",
  description: "A brutalist recipe & relational database showcase built for DBMS coursework.",
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
        <StatsFooter />
      </body>
    </html>
  );
}
