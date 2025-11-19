"server-only";

import { sql } from "@/data/db";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { cookies } from "next/headers";
import { cache } from "react";

export interface Session {
  id: string;
  userId: number;
  createdAt: Date;
  expiresAt: Date;
}

export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return encodeBase32LowerCaseNoPadding(bytes);
}

export async function createSession(token: string, userId: number): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  const result = await sql`
    INSERT INTO session (id, user_id, expires_at)
    VALUES (${sessionId}, ${userId}, ${expiresAt})
    RETURNING id, user_id, created_at, expires_at
  `;

  const row = result[0];
  return {
    id: row.id,
    userId: row.user_id,
    createdAt: new Date(row.created_at),
    expiresAt: new Date(row.expires_at),
  };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await sql`
    DELETE FROM session WHERE id = ${sessionId}
  `;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const result = await sql`
    SELECT 
      session.id as session_id,
      session.user_id,
      session.created_at as session_created_at,
      session.expires_at as session_expires_at,
      userTable.id as user_id,
      userTable.email,
      userTable.password_hash,
      userTable.name,
      userTable.created_at as user_created_at
    FROM session
    JOIN "user" userTable ON session.user_id = userTable.id
    WHERE session.id = ${sessionId}
  `;

  if (!result || result.length === 0) {
    return { session: null, user: null };
  }

  const row = result[0];
  const session: Session = {
    id: row.session_id,
    userId: row.user_id,
    createdAt: new Date(row.session_created_at),
    expiresAt: new Date(row.session_expires_at),
  };

  const user: User = {
    id: row.user_id,
    email: row.email,
    passwordHash: row.password_hash,
    name: row.name,
    createdAt: new Date(row.user_created_at),
  };

  if (Date.now() >= session.expiresAt.getTime()) {
    await invalidateSession(session.id);
    return { session: null, user: null };
  }

  const fifteenDaysBeforeExpiry = session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15;
  if (Date.now() >= fifteenDaysBeforeExpiry) {
    const newExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await sql`
      UPDATE session SET expires_at = ${newExpiresAt} WHERE id = ${session.id}
    `;
    session.expiresAt = newExpiresAt;
  }

  return { session, user };
}

export async function setSessionTokenCookie(token: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

export async function deleteSession() {
  const currentSession = await getCurrentSession();
  if (currentSession.session?.id) {
    await invalidateSession(currentSession.session.id);
  }
  await deleteSessionTokenCookie();
}

async function _getCurrentSession(token: string | null): Promise<SessionValidationResult> {
  if (token === null) {
    return { session: null, user: null };
  }

  return validateSessionToken(token);
}

// Create the cached function once, outside the exported function
const cachedGetCurrentSession = cache(_getCurrentSession);

export async function getCurrentSession(): Promise<SessionValidationResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value ?? null;

  // Cache based on the token value, so different tokens = different cache entries
  // This ensures the cache is invalidated when the cookie changes
  return cachedGetCurrentSession(token);
}
