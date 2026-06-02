import type { Request, Response } from "express";
import { getAuth, clerkClient } from "@clerk/express";

export type TrpcContext = {
  userId: string | null;
  role: "professor" | "student" | null;
  req: Request;
  res: Response;
};

export async function createContext({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<TrpcContext> {
  const { userId } = getAuth(req);

  if (!userId) {
    return { userId: null, role: null, req, res };
  }

  let role: "professor" | "student" = "student";
  try {
    const clerkUser = await clerkClient.users.getUser(userId);
    if (clerkUser.publicMetadata?.role === "professor") {
      role = "professor";
    }
  } catch {
    // If Clerk API fails, default to student role
  }

  return { userId, role, req, res };
}
