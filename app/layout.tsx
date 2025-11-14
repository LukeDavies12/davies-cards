import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"]
})

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
        className={`${inter.className} antialiased text-neutral-800 text-sm`}
      >
        <nav className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center">
            <Image src="/davies-cards.svg" height={40} width={40} alt="Logo" className="w-12" />
            <span className="text-red-700 font-bold ml-1">Davies Cards</span>
          </Link>
          <div>
            <Link
              href="/login"
              className="bg-neutral-100 rounded-lg text-neutral-700 px-5 py-1.5 hover:bg-neutral-200 active:bg-neutral-300 active:text-neutral-800 transition-colors"
            >Sign in to log game
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
