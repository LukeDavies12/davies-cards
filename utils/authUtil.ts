// authUtil.ts
import { auth } from "@/auth/lucia";
import * as context from 'next/headers';
import type { NextRequest } from "next/server";

export const authenticateRequest = async (request: NextRequest) => {
  const authRequest = auth.handleRequest("GET", context);
  return await authRequest.validate();
};
