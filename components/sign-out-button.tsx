'use client';

import { signOut } from '@/app/signOutAction';
import { LogOut } from 'lucide-react';

export default function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="bg-neutral-100 rounded-lg text-neutral-700 p-2 hover:bg-neutral-200 active:bg-neutral-300 active:text-neutral-800 transition-colors cursor-pointer"
        aria-label="Sign out"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </form>
  );
}

