import { NbaGameRepository } from '@/domain/repositories/NbaGameRepository';
import { Game } from '@prisma/client';

interface GameDetail {
  gameId: string;
  gameStatus: number;
  gameStatusText: string;
  gameDateTimeUTC: string;
  gameLabel: string;
  arenaName: string;
  homeTeam: {
    teamId: number;
    teamName: string;
    teamCity: string;
    teamTricode: string;
    score: number;
  };
  awayTeam: {
    teamId: number;
    teamName: string;
    teamCity: string;
    teamTricode: string;
    score: number;
  };
}

interface GameDate {
  gameDate: string;
  games: GameDetail[];
}

interface TodayGameDetail {
  gameId: string;
  gameStatus: number;
  gameTimeUTC: string;
  homeTeam: {
    teamId: number;
    score: number;
    periods: { period: number; score: number }[];
  };
  awayTeam: {
    teamId: number;
    score: number;
    periods: { period: number; score: number }[];
  };
}

interface Scoreboard {
  scoreboard: {
    gameDate: string;
    games: TodayGameDetail[];
  };
}

export class NbaOfficialGameRpository implements NbaGameRepository {
  async findAll(): Promise<Game[]> {
    const url = process.env.NEXT_PUBLIC_NBA_SEASON_SCHEDULE_URL;

    const response = await fetch(url as string);
    const result = await response.json();

    const games: Game[] = result.leagueSchedule.gameDates.flatMap(
      (gameDate: GameDate): Game[] =>
        gameDate.games
          .filter(
            (game: GameDetail) =>
              game.gameLabel === '' || game.gameLabel.includes('NBA Cup')
          )
          .map((game: GameDetail) => {
            const homeTeam = game.homeTeam;
            const awayTeam = game.awayTeam;

            return {
              id: game.gameId,
              season: parseInt(result.leagueSchedule.seasonYear),
              status: game.gameStatus.toString(),
              arenaName: game.arenaName,
              awayTeamId: awayTeam.teamId.toString(),
              awayTeamPeriods: [],
              awayTeamScore: awayTeam.score,
              homeTeamId: homeTeam.teamId.toString(),
              homeTeamPeriods: [],
              homeTeamScore: homeTeam.score,
              date: '',
              startTime: game.gameDateTimeUTC,
            };
          })
    );

    return games;
  }

  async findTodayGame(): Promise<Game[]> {
    const url = process.env.NEXT_PUBLIC_NBA_TODAYS_SCOREBOARD_URL;

    const response = await fetch(url as string);
    const data: Scoreboard = await response.json();

    const games: Game[] = data.scoreboard.games.map(
      (game: TodayGameDetail) => ({
        id: game.gameId,
        season: 0,
        status: game.gameStatus.toString(),
        arenaName: '',
        awayTeamId: game.awayTeam.teamId.toString(),
        awayTeamPeriods: game.awayTeam.periods.map((p) => p.score),
        awayTeamScore: game.awayTeam.score,
        homeTeamId: game.homeTeam.teamId.toString(),
        homeTeamPeriods: game.homeTeam.periods.map((p) => p.score),
        homeTeamScore: game.homeTeam.score,
        date: '',
        startTime: game.gameTimeUTC,
      })
    );

    return games;
  }
}
