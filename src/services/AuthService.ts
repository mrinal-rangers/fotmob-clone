import { AdminRepository } from "../repositories/AdminRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { config } from "../config/env";

const JWT_SECRET = config.jwt.secret;
const googleClient = new OAuth2Client(config.auth.google.clientId);

export class AuthService {
  private adminRepo = new AdminRepository();

  async register(data: { email: string; password: string; name: string; role?: string }) {
    const existing = await this.adminRepo.findByEmail(data.email);
    if (existing) throw new Error("Admin with this email already exists");

    const passwordHash = await bcrypt.hash(data.password, 12);
    return this.adminRepo.create({
      email: data.email,
      passwordHash,
      name: data.name,
      role: (data.role as any) || "ADMIN",
    });
  }

  async login(email: string, password: string) {
    const admin = await this.adminRepo.findByEmail(email);
    if (!admin) throw new Error("Invalid credentials");

    if (!admin.passwordHash) throw new Error("This account uses Google Sign-In");

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) throw new Error("Invalid credentials");

    const token = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, JWT_SECRET, {
      expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions);

    return { token, admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role, picture: admin.picture } };
  }

  async googleSignIn(idToken: string) {
    if (!config.auth.google.clientId) {
      throw new Error("Google Sign-In is not configured (missing GOOGLE_CLIENT_ID)");
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: config.auth.google.clientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error("Invalid Google token");
    }

    const email = payload.email;
    const name = payload.name || email;
    const picture = payload.picture;
    const googleId = payload.sub;

    if (!config.auth.admin.emails.includes(email)) {
      throw new Error("Unauthorized: this email is not registered as an admin");
    }

    const admin = await this.adminRepo.upsertByEmail(email, {
      googleId,
      name,
      picture,
    });

    const token = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, JWT_SECRET, {
      expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions);

    return { token, admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role, picture: admin.picture } };
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    } catch {
      return null;
    }
  }
}
