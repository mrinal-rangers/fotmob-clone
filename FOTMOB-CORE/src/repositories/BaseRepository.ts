import { PrismaClient, Prisma } from "@prisma/client";
import prisma from "../config/database";

export class BaseRepository {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async executeTransaction<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
    timeout = 15000
  ): Promise<T> {
    return this.prisma.$transaction(fn, { timeout, maxWait: 5000 });
  }
}
