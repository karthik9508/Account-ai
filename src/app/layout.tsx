import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Account AI - AI Accounting App | AI Based Accounting Made Simple",
  description: "Account AI is your AI accounting app that understands natural language. Record expenses, track income, and generate reports with AI based accounting technology. Free AI accounting solution for small businesses.",
  keywords: ["AI Accounting", "AI Accounting App", "AI based Accounting", "AI bookkeeping", "automated accounting", "natural language accounting", "expense tracking", "accounting automation", "small business accounting"],
  authors: [{ name: "Account AI" }],
  creator: "Account AI",
  publisher: "Account AI",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://accountai.tech",
    siteName: "Account AI",
    title: "Account AI - AI Accounting App | AI Based Accounting Made Simple",
    description: "AI Accounting that understands natural language. Record expenses, track income, and generate reports effortlessly with our AI based accounting app.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Account AI - AI Accounting App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Account AI - AI Accounting App",
    description: "AI based accounting that understands natural language. Record expenses and track income effortlessly.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://accountai.tech",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
