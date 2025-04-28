import type React from "react";
import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

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
  title: "Maroon - Love for Fashion | Premium Indian Ethnic Wear",
  description:
    "Discover exquisite collection of premium ethnic wear including sarees, lehengas, and more. Shop the latest fashion trends with Maroon.",
  keywords:
    "ethnic wear, sarees, lehengas, indian fashion, traditional wear, maroon fashion",
  openGraph: {
    title: "Maroon - Love for Fashion | Premium Indian Ethnic Wear",
    description:
      "Discover exquisite collection of premium ethnic wear including sarees, lehengas, and more. Shop the latest fashion trends with Maroon.",
    images: ["/og-image.jpg"],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maroon - Love for Fashion | Premium Indian Ethnic Wear",
    description:
      "Discover exquisite collection of premium ethnic wear including sarees, lehengas, and more. Shop the latest fashion trends with Maroon.",
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
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
