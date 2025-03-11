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

      return user || null;
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
