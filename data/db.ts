"server-only"

import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

export function toCamel(row: Record<string, any>) {
  const out: any = {}
  for (const key in row)
    out[key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())] = row[key]
  return out
}

export const sql = neon(process.env.DATABASE_URL);