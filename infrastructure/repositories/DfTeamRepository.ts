import { TeamRepository } from '@/domain/repositories/TeamRepository';
import { prisma } from '@/utils/prisma';
import { Team, PrismaClient } from '@prisma/client';

export class DfTeamRepository implements TeamRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async findById(id: string): Promise<Team | null> {
    try {
      const team = await this.prisma.team.findUnique({ where: { id } });
      return team;
    } catch (error) {
      console.error(error);
      throw new Error('팀 데이터 불러오기 실패');
    } finally {
      await this.prisma.$disconnect();
    }
  }
}
