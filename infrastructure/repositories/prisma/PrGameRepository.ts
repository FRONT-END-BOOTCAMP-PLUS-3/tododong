import { GameRepository } from '@/domain/repositories/GameRepository';
import { prisma } from '@/utils/prisma';
import { Game, PrismaClient } from '@prisma/client';

export class PrGameRepository implements GameRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async findAll(): Promise<Game[]> {
    return await this.prisma.game.findMany();
  }

  async findByDate(date: string): Promise<Game[]> {
    try {
      const games = await this.prisma.game.findMany({
        where: { date },
        orderBy: [
          {
            startTime: 'asc',
          },
          {
            id: 'asc',
          },
        ],
      });
      return games;
    } catch (error) {
      console.error(error);
      throw new Error('게임 데이터 불러오기 실패');
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async countByDate(
    year: number,
    month: number
  ): Promise<{ date: string; gameCount: number }[]> {
    try {
      const getFormattedDate = (year: number, month: number, day: number) => {
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      };

      const startDateStr = getFormattedDate(year, month, 1); // 해당 월의 1일
      const endDateStr = getFormattedDate(
        year,
        month,
        new Date(year, month, 0).getDate()
      ); // 해당 월의 마지막 날

      const gameCountByDate = await this.prisma.game.groupBy({
        by: ['date'],
        where: {
          date: {
            gte: startDateStr, // 해당 월의 시작일 이상
            lt: endDateStr, // 해당 월의 마지막일 이하
          },
        },
        _count: {
          _all: true,
        },
      });

      return gameCountByDate.map((game) => ({
        date: game.date,
        gameCount: game._count._all,
      }));
    } catch (error) {
      console.error(error);
      throw new Error('게임 개수 불러오기 실패');
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

  async findById(id: string): Promise<Game | null> {
    try {
      const game = await this.prisma.game.findUnique({ where: { id } });
      return game;
    } catch (error) {
      console.error(error);
      throw new Error('게임 데이터 불러오기 실패');
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async updateTodayGames(games: Game[]): Promise<void> {
    try {
      const updateTodayGames = games.map((game) => {
        return this.prisma.game.update({
          where: { id: game.id },
          data: {
            status: game.status,
            awayTeamPeriods: game.awayTeamPeriods,
            awayTeamScore: game.awayTeamScore,
            homeTeamPeriods: game.homeTeamPeriods,
            homeTeamScore: game.homeTeamScore,
          },
        });
      });

      await this.prisma.$transaction(updateTodayGames);
    } catch (error) {
      console.error(error);
    } finally {
      await this.prisma.$disconnect();
    }
  }
}
