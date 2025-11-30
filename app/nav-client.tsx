'use client';

import SignOutButton from "@/components/sign-out-button";
import LogGameModal from "@/sections/log-game/log-game-modal";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavClientProps {
  userName?: string;
}

export default function NavClient({ userName }: NavClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  if (userName) {
    return (
      <>
        <nav className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3">
          <Link href="/" className="flex items-center">
            <Image src="/davies-cards.svg" height={40} width={40} alt="Logo" className="w-10 sm:w-12" />
            <span className="text-red-700 font-bold ml-1 text-sm sm:text-sm">Davies Cards</span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-red-700 text-white px-4 sm:px-7 py-1.5 text-sm sm:text-sm rounded-md hover:bg-red-800 active:bg-red-900 transition-colors cursor-pointer"
            >
              Log Game
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-neutral-700 text-xs sm:text-sm hidden sm:inline">{userName}</span>
              <SignOutButton />
            </div>
          </div>
        </nav>

        <LogGameModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  const isLoginPage = pathname === '/login';

  return (
    <nav className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3">
      <Link href="/" className="flex items-center">
        <Image src="/davies-cards.svg" height={40} width={40} alt="Logo" className="w-10 sm:w-12" />
        <span className="text-red-700 font-bold ml-1 text-sm sm:text-base">Davies Cards</span>
      </Link>

      {!isLoginPage && (
        <Link
          href="/login"
          className="bg-neutral-100 rounded-lg text-neutral-700 px-4 sm:px-7 py-1.5 text-sm sm:text-base hover:bg-neutral-200 active:bg-neutral-300 active:text-neutral-800 transition-colors duration-100 ease-linear"
        >
          <span className="hidden sm:inline">Sign in to log game</span>
          <span className="sm:hidden">Sign in</span>
        </Link>
      )}
    </nav>
  );
}
