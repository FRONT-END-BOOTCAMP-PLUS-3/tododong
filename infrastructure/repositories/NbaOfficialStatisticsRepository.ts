import { StatisticsRepository } from '@/domain/repositories/StatisticsRepository';
import { Statistics } from '@/domain/entities/Statistics';

interface Player {
  playerId: string;
  name: string;
  jerseyNum: string;
  position: string;
  starter: boolean;
  oncourt: boolean;
  played: boolean;
  statistics: {
    assists: number;
    blocks: number;
    fieldGoalsAttempted: number;
    fieldGoalsMade: number;
    fieldGoalsPercentage: number;
    foulsPersonal: number;
    freeThrowsAttempted: number;
    freeThrowsMade: number;
    freeThrowsPercentage: number;
    minutes: string;
    plusMinusPoints: number;
    points: number;
    reboundsDefensive: number;
    reboundsOffensive: number;
    reboundsTotal: number;
    steals: number;
    threePointersAttempted: number;
    threePointersMade: number;
    threePointersPercentage: number;
    turnovers: number;
  };
}

export class NbaOfficialStatisticsRpository implements StatisticsRepository {
  private mapPlayers(players: Player[], teamId: string) {
    return players.map((player) => ({
      teamId,
      name: player.name,
      assists: player.statistics.assists,
      blocks: player.statistics.blocks,
      fieldGoalsAttempted: player.statistics.fieldGoalsAttempted,
      fieldGoalsMade: player.statistics.fieldGoalsMade,
      fieldGoalsPercentage: player.statistics.fieldGoalsPercentage,
      foulsPersonal: player.statistics.foulsPersonal,
      freeThrowsAttempted: player.statistics.freeThrowsAttempted,
      freeThrowsMade: player.statistics.freeThrowsMade,
      freeThrowsPercentage: player.statistics.freeThrowsPercentage,
      minutes: player.statistics.minutes,
      plusMinusPoints: player.statistics.plusMinusPoints,
      points: player.statistics.points,
      reboundsDefensive: player.statistics.reboundsDefensive,
      reboundsOffensive: player.statistics.reboundsOffensive,
      reboundsTotal: player.statistics.reboundsTotal,
      steals: player.statistics.steals,
      threePointersAttempted: player.statistics.threePointersAttempted,
      threePointersMade: player.statistics.threePointersMade,
      threePointersPercentage: player.statistics.threePointersPercentage,
      turnovers: player.statistics.turnovers,
    }));
  }

  async findById(gameId: string): Promise<Statistics[]> {
    const url = `${process.env.NEXT_PUBLIC_NBA_BOXSCORE_URL}_${gameId}.json`;

    try {
      const response = await fetch(url);
      const result = await response.json();

      const homePlayers = this.mapPlayers(
        result.game.homeTeam.players,
        result.game.homeTeam.teamId.toString()
      );
      const awayPlayers = this.mapPlayers(
        result.game.awayTeam.players,
        result.game.awayTeam.teamId.toString()
      );

      const players = [...homePlayers, ...awayPlayers];

      return players;
    } catch (error) {
      console.error(error);
      throw new Error('Boxscore 데이터 불러오기 실패');
    }
  }
}
