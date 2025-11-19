'use client';

import BaseLink from "@/components/base-link";
import SignOutButton from "@/components/sign-out-button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavClientProps {
  userName?: string;
}

export default function NavClient({ userName }: NavClientProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  if (userName) {
    return (
      <nav className="flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center">
          <Image src="/davies-cards.svg" height={40} width={40} alt="Logo" className="w-12" />
          <span className="text-red-700 font-bold ml-1">Davies Cards</span>
        </Link>
        <div className="flex items-center gap-6">
          {isHomePage && (
            <BaseLink href="/admin">Log Games</BaseLink>
          )}
          <div className="flex items-center gap-2">
            <span className="text-neutral-700">{userName}</span>
            <SignOutButton />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-between px-4 py-3">
      <Link href="/" className="flex items-center">
        <Image src="/davies-cards.svg" height={40} width={40} alt="Logo" className="w-12" />
        <span className="text-red-700 font-bold ml-1">Davies Cards</span>
      </Link>
      <div>
        <Link
          href="/login"
          className="bg-neutral-100 rounded-lg text-neutral-700 px-5 py-1.5 hover:bg-neutral-200 active:bg-neutral-300 active:text-neutral-800 transition-colors"
        >
          Sign in to log game
        </Link>
      </div>
    </nav>
  );
}
