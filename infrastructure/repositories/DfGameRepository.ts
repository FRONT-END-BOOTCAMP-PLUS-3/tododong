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

  async findByDate(date: string): Promise<Game[]> {
    try {
      const games = await this.prisma.game.findMany({ where: { date } });
      return games;
    } catch (error) {
      console.error(error);
      throw new Error('게임 데이터 불러오기 실패');
    } finally {
      await this.prisma.$disconnect();
    }
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
            date: game.date,
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
            date: game.date,
            startTime: game.startTime,
          },
        });
      });

      await prisma.$transaction(upsertGames);
    } catch (error) {
      console.error(error);
    } finally {
      await this.prisma.$disconnect();
    }
  }
}
