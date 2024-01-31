import { PrismaClient } from "@prisma/client";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var db: PrismaClient;
}

export const db =
  global.db ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV === "development") {
  global.db = db;
}

if (process.env.NODE_ENV === "production") {
  db.$connect();
}
