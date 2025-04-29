import type React from "react";
import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Maroon - Buy Trendy Western Wear for Women Online",
  description:
    "Shop the latest collection of women's western wear including T-shirts, pants, skirts, and more. Premium quality, trendy designs.",
  keywords:
    "women's western wear, women's fashion, tops, dresses, pants, skirts, maroon fashion",
  openGraph: {
    title: "Maroon - Buy Trendy Western Wear for Women Online",
    description:
      "Shop the latest collection of women's western wear including T-shirts, pants, skirts, and more. Premium quality, trendy designs.",
    images: ["/og-image.jpg"],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maroon - Buy Trendy Western Wear for Women Online",
    description:
      "Shop the latest collection of women's western wear including T-shirts, pants, skirts, and more. Premium quality, trendy designs.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://www.maroon.com",
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${poppins.variable} font-poppins`}>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
