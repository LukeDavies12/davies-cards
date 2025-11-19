'use server';

import { sql } from '@/data/db';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { createSession, generateSessionToken, setSessionTokenCookie } from '../../lib/auth';

export async function signIn(email: string, password: string) {
  const passwordHash = encodeHexLowerCase(sha256(new TextEncoder().encode(password)));

  const result = await sql`
    SELECT id, name, email, password_hash FROM "user" WHERE email = ${email}
  `;

  if (!result || result.length === 0) {
    return { error: 'Invalid email or password' };
  }

  const user = result[0];
  if (user.password_hash !== passwordHash) {
    return { error: 'Invalid email or password' };
  }

  const token = generateSessionToken();
  const session = await createSession(token, user.id);
  await setSessionTokenCookie(token);

  return { success: true };
}

