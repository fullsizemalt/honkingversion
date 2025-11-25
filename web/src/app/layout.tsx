import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from '@/components/Footer';
import DevUserSwitcher from '@/components/DevUserSwitcher';
import AnalyticsListener from '@/components/AnalyticsListener';
import CookieConsent from '@/components/CookieConsent';

export const metadata: Metadata = {
  title: "Honkingversion.net - Vote on the best Goose performances",
  description: "The definitive archive for rating and discovering the best Goose song performances",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <Providers>
          <Navbar />
          {children}
          <Footer />
          <DevUserSwitcher />
          <Suspense fallback={null}>
            <AnalyticsListener />
          </Suspense>
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
