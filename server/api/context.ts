import type { Request, Response } from "express";
import type { User } from "../db/schema";

export type TrpcContext = {
  user: User | null;
  req: Request;
  res: Response;
};

export function createContext({ req, res }: { req: Request; res: Response }): TrpcContext {
  return {
    user: null,
    req,
    res,
  };
}
