import { AdminRepository } from "../repositories/AdminRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-change-in-production";

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

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) throw new Error("Invalid credentials");

    const token = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, JWT_SECRET, {
      expiresIn: "24h",
    });

    return { token, admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role } };
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    } catch {
      return null;
    }
  }
}
