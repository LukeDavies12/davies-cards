import { getCurrentSession } from "@/lib/auth";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import "./globals.css";
import NavClient from "./nav-client";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Davies Cards",
  description: "O-hell leaderboard for the Davies family and friends",
};

async function Nav() {
  const { session, user } = await getCurrentSession();

  // Pass the user name to the client component
  return <NavClient userName={user?.name} />;
}

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
        <Suspense fallback={
          <nav className="flex items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center">
              <Image src="/davies-cards.svg" height={40} width={40} alt="Logo" className="w-12" />
              <span className="text-red-700 font-bold ml-1">Davies Cards</span>
            </Link>
          </nav>
        }>
          <Nav />
        </Suspense>
        <div className="container mx-auto px-6 pb-8">
          {children}
        </div>
      </body>
    </html>
  );
}
