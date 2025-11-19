'use server';

import { deleteSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function signOut() {
  await deleteSession();
  revalidatePath('/', 'layout');
  redirect('/');
}
