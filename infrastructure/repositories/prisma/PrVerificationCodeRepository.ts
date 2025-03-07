import { VerificationCodeRepository } from '@/domain/repositories/VerificationCodeRepository';
import { prisma } from '@/utils/prisma';
import { PrismaClient } from '@prisma/client';

export default class PrVerificationCodeRepository
  implements VerificationCodeRepository
{
  #prisma: PrismaClient;

  constructor() {
    this.#prisma = prisma;
  }

  async deleteDuplication(email: string): Promise<void> {
    try {
      await this.#prisma.verificationCode.deleteMany({
        where: { email: email },
      });
    } catch (err: unknown) {
      if (err instanceof Error) console.error(err.message);
    } finally {
      this.#prisma.$disconnect();
    }
  }

  async createOne({
    email,
    code,
  }: {
    email: string;
    code: string;
  }): Promise<void> {
    try {
      await this.#prisma.verificationCode.create({
        data: {
          email,
          code,
          expiresAt: new Date(Date.now() + 2 * 60 * 1000), // 2분 후 만료
        },
      });
    } catch (err: unknown) {
      if (err instanceof Error) console.error(err.message);
    } finally {
      this.#prisma.$disconnect();
    }
  }
}
