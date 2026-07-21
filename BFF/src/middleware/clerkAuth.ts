import { Request, Response, NextFunction } from "express";
import { createClerkClient } from "@clerk/clerk-sdk-node";
import { config } from "../config/env";
import { proxy } from "../services/ProxyService";

const clerkClient = createClerkClient({ secretKey: config.clerk.secretKey });

export interface AuthRequest extends Request {
  user?: {
    id: string;
    clerkId: string;
    email: string;
    name: string;
    avatarUrl: string | null;
  };
}

export async function requireClerkAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const token = header.slice(7);
  if (!token) {
    return res.status(401).json({ error: "Invalid token" });
  }

  try {
    const claims = await clerkClient.verifyToken(token) as Record<string, any>;
    const clerkId = claims.sub;
    const email = claims.email || "";
    const name = claims.name || claims.given_name || "";
    const avatarUrl = claims.picture || null;

    const user = await proxy.post("/users/sync", {
      clerkId,
      email,
      name,
      avatarUrl,
    }) as { id: string; clerkId: string; email: string; name: string; avatarUrl: string | null };

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
}
