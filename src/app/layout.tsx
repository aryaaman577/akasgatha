import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CosmicBackdrop } from "@/components/visual/CosmicBackdrop";

import "./globals.css";

import { LanguageProvider } from "@/config/language";

export const metadata: Metadata = {
  title: "AkasGatha",
  description:
    "Ancient sky stories explained with modern space science through evidence-aware learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[var(--color-obsidian)] text-[var(--color-ivory)]">
        <LanguageProvider>
          <CosmicBackdrop />
          <div className="relative z-0 flex min-h-screen flex-col">
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
