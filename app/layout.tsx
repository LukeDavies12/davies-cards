import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Davies Cards",
  description: "O-hell leaderboard for the Davies family and friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-neutral-800 text-sm`}
      >
        <nav className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center">
            <Image src="/davies-cards.svg" height={40} width={40} alt="Logo" className="w-12" />
            <span className="text-red-700 font-bold ml-1">Davies Cards</span>
          </Link>
          <div>
            <Link
              href="/login"
              className="bg-neutral-100 text-neutral-700 px-5 py-1.5 hover:bg-neutral-200 active:bg-neutral-300 active:text-neutral-800 transition-colors"
            >Sign In to Add New Game
            </Link>
          </div>
        </nav>
        <div className="container mx-auto px-2">
          {children}
        </div>
      </body>
    </html>
  );
}
