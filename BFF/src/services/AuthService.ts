import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { config } from "../config/env";

const googleClient = new OAuth2Client(config.google.clientId);

export interface AdminSession {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export class AuthService {
  async googleSignIn(idToken: string): Promise<{ token: string; admin: AdminSession }> {
    if (!config.google.clientId) {
      throw new Error("Google Sign-In is not configured");
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: config.google.clientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error("Invalid Google token");
    }

    const email = payload.email;
    if (!config.auth.adminEmails.includes(email)) {
      throw new Error("Unauthorized: this email is not registered as an admin");
    }

    const admin: AdminSession = {
      id: payload.sub,
      email,
      name: payload.name || email,
      picture: payload.picture,
    };

    const token = jwt.sign(
      { sub: payload.sub, email, name: admin.name, picture: admin.picture },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn } as jwt.SignOptions,
    );

    return { token, admin };
  }

  verifyToken(token: string): { sub: string; email: string; name: string; picture?: string } | null {
    try {
      return jwt.verify(token, config.jwt.secret) as any;
    } catch {
      return null;
    }
  }
}
