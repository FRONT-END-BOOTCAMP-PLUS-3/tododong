import { VerificationCodeRepository } from '@/domain/repositories/VerificationCodeRepository';
import { prisma } from '@/utils/prisma';
import { PrismaClient, VerificationCode } from '@prisma/client';

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
      if (err instanceof Error) {
        console.error(err.message);
        throw err;
      }
    } finally {
      this.#prisma.$disconnect();
    }
  }

  async createOne(verificationCode: VerificationCode): Promise<void> {
    try {
      await this.#prisma.verificationCode.create({
        data: verificationCode,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        throw err;
      }
    } finally {
      this.#prisma.$disconnect();
    }
  }

  async findByEmail(email: string): Promise<VerificationCode | null> {
    try {
      const code = await this.#prisma.verificationCode.findUnique({
        where: { email: email },
      });
      return code;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        throw err;
      }
      return null;
    } finally {
      this.#prisma.$disconnect();
    }
  }
}
