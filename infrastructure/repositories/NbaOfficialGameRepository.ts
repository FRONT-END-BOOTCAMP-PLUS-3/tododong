import { GameRepository } from '@/domain/repositories/GameRepository';
import { Game } from '@prisma/client';

interface Broadcaster {
  broadcasterScope?: string;
  broadcasterMedia?: string;
  broadcasterId?: number;
  broadcasterDisplay?: string;
  broadcasterAbbreviation?: string;
  broadcasterDescription?: string;
  tapeDelayComments?: string;
  broadcasterVideoLink?: string;
  broadcasterTeamId?: number;
}

interface GameDetail {
  gameId: string;
  gameCode: string;
  gameStatus: number;
  gameStatusText: string;
  gameSequence: number;
  gameDateEst: string;
  gameTimeEst: string;
  gameDateTimeEst: string;
  gameDateUTC: string;
  gameTimeUTC: string;
  gameDateTimeUTC: string;
  awayTeamTime: string;
  homeTeamTime: string;
  day: string;
  monthNum: number;
  weekNumber: number;
  weekName: string;
  gameLabel: string;
  gameSubLabel: string;
  arenaName: string;
  arenaState: string;
  arenaCity: string;
  postponedStatus: string;
  gameSubtype: string;
  isNeutral: boolean;
  broadcasters: {
    nationalBroadcasters: Broadcaster[];
    nationalRadioBroadcasters: Broadcaster[];
    nationalOttBroadcasters: Broadcaster[];
    homeTvBroadcasters: Broadcaster[];
    homeRadioBroadcasters: Broadcaster[];
    homeOttBroadcasters: Broadcaster[];
    awayTvBroadcasters: Broadcaster[];
    awayRadioBroadcasters: Broadcaster[];
    awayOttBroadcasters: Broadcaster[];
  };
  homeTeam: {
    teamId: number;
    teamName: string;
    teamCity: string;
    teamTricode: string;
    teamSlug: string;
    wins: number;
    losses: number;
    score: number;
    seed: number;
  };
  awayTeam: {
    teamId: number;
    teamName: string;
    teamCity: string;
    teamTricode: string;
    teamSlug: string;
    wins: number;
    losses: number;
    score: number;
    seed: number;
  };
  pointsLeaders: Array<{
    personId: number;
    firstName: string;
    lastName: string;
    teamId: number;
    teamCity: string;
    teamName: string;
    teamTricode: string;
    points: number;
  }>;
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

export class NbaOfficialGameRpository implements GameRepository {
  async findAll(): Promise<Game[]> {
    const url = process.env.NEXT_PUBLIC_NBA_SEASON_SCHEDULE_URL;

    const response = await fetch(url as string);
    const result = await response.json();

    const games = result.leagueSchedule.gameDates.flatMap(
      (gameDate: GameDate) =>
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
