import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from '@/components/Footer';

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
    <html lang="en">
      <body
        className={`antialiased bg-[#0a0a0a] text-[#f5f5f5]`}
      >
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
