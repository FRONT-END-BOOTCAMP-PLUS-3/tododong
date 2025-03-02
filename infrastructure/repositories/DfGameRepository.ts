import { GameRepository } from '@/domain/repositories/GameRepository';
import { prisma } from '@/utils/prisma';
import { games, PrismaClient } from '@prisma/client';

export class DfGameRepository implements GameRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async findAll(): Promise<games[]> {
    return await this.prisma.games.findMany();
  }

  // 저장 또는 업데이트하는 함수
  async saveGames(games: games[]): Promise<void> {
    try {
      const upsertGames = games.map((game) => {
        return this.prisma.games.upsert({
          where: { id: game.id },
          update: {
            season: game.season,
            status: game.status,
            arena_name: game.arena_name,
            away_team_id: game.away_team_id,
            away_team_periods: game.away_team_periods,
            away_team_score: game.away_team_score,
            home_team_id: game.home_team_id,
            home_team_periods: game.home_team_periods,
            home_team_score: game.home_team_score,
            start_time: game.start_time,
          },
          create: {
            id: game.id,
            season: game.season,
            status: game.status,
            arena_name: game.arena_name,
            away_team_id: game.away_team_id,
            away_team_periods: game.away_team_periods,
            away_team_score: game.away_team_score,
            home_team_id: game.home_team_id,
            home_team_periods: game.home_team_periods,
            home_team_score: game.home_team_score,
            start_time: game.start_time,
          },
        });
      });

      //   await Promise.all(upsertGames);
      await prisma.$transaction(upsertGames);
    } catch (error) {
      console.error(error);
    }
  }
}
