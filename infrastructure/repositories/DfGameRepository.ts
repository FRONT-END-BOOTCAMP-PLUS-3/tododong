import { GameRepository } from '@/domain/repositories/GameRepository';
import { prisma } from '@/utils/prisma';
import { Game, PrismaClient } from '@prisma/client';

export class DfGameRepository implements GameRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async findAll(): Promise<Game[]> {
    return await this.prisma.game.findMany();
  }

  // 저장 또는 업데이트하는 함수
  async saveGames(games: Game[]): Promise<void> {
    try {
      const upsertGames = games.map((game) => {
        return this.prisma.game.upsert({
          where: { id: game.id },
          update: {
            season: game.season,
            status: game.status,
            arenaName: game.arenaName,
            awayTeamId: game.awayTeamId,
            awayTeamPeriods: game.awayTeamPeriods,
            awayTeamScore: game.awayTeamScore,
            homeTeamId: game.homeTeamId,
            homeTeamPeriods: game.homeTeamPeriods,
            homeTeamScore: game.homeTeamScore,
            startTime: game.startTime,
          },
          create: {
            id: game.id,
            season: game.season,
            status: game.status,
            arenaName: game.arenaName,
            awayTeamId: game.awayTeamId,
            awayTeamPeriods: game.awayTeamPeriods,
            awayTeamScore: game.awayTeamScore,
            homeTeamId: game.homeTeamId,
            homeTeamPeriods: game.homeTeamPeriods,
            homeTeamScore: game.homeTeamScore,
            startTime: game.startTime,
          },
        });
      });

      await prisma.$transaction(upsertGames);
    } catch (error) {
      console.error(error);
    }
  }
}
