import UserRepository from '@/domain/repositories/UserRepository';
import { prisma } from '@/utils/prisma';
import { PrismaClient, User } from '@prisma/client';

export default class PrUserRepository implements UserRepository {
  #prisma: PrismaClient;

  constructor() {
    this.#prisma = prisma;
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.#prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      return user;
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

  async findByNickname(nickname: string): Promise<User | null> {
    try {
      const user = await this.#prisma.user.findUnique({
        where: {
          nickname: nickname,
        },
      });

      return user;
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

  async createOne(userInfo: User): Promise<void> {
    try {
      await this.#prisma.user.create({ data: userInfo });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        throw err;
      }
    } finally {
      this.#prisma.$disconnect();
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await this.#prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      return user || null;
    } finally {
      this.#prisma.$disconnect();
    }
  }
}
