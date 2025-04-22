import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import TranslationProvider from "@/app/contexts/TranslationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Waivs.ai",
  description:
    "Waivs.ai is a platform for doctors where they can manage their patient, generate session transcripts, and also use AI to generate notes for their patients.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClerkProvider
          signInUrl="/dashboard"
          signInFallbackRedirectUrl="/dashboard"
        >
          <TranslationProvider>
            {children}
            <Toaster />
          </TranslationProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
