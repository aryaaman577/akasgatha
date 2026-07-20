import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CosmicBackdrop } from "@/components/visual/CosmicBackdrop";
import { LanguageProvider } from "@/components/providers/LanguageProvider";

import "@fontsource/cinzel-decorative/400.css";
import "@fontsource/cinzel-decorative/700.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";

import "./globals.css";

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
      <body
        className="min-h-screen"
        style={{
          background: "var(--space-void)",
          color: "var(--space-moonlight)",
          fontFamily: "var(--font-body)",
        }}
      >
        <LanguageProvider>
          <CosmicBackdrop variant="universe" intensity="medium" interactive />
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
