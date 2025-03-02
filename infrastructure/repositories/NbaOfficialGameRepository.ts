import { GameRepository } from '@/domain/repositories/GameRepository';
import { games } from '@prisma/client';

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

interface Game {
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
  gameDate: string; // 게임 날짜 (예: "10/04/2024 00:00:00")
  games: Game[]; // 해당 날짜에 진행되는 게임들
}

export class NbaOfficialGameRpository implements GameRepository {
  async findAll(): Promise<games[]> {
    const url = process.env.NEXT_PUBLIC_NBA_SEASON_SCHEDULE_URL;

    const response = await fetch(url as string, {
      headers: {
        Host: 'https://tododong.com',
        Connection: 'keep-alive',
        Accept: 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0',
        Referer: 'https://tododong.com',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    const result = await response.json();

    const games = result.leagueSchedule.gameDates.flatMap(
      (gameDate: GameDate) =>
        gameDate.games.map((game: Game) => {
          const homeTeam = game.homeTeam;
          const awayTeam = game.awayTeam;

          return {
            id: game.gameId,
            season: parseInt(result.leagueSchedule.seasonYear),
            status: game.gameStatus,
            arena_name: game.arenaName,
            away_team_id: awayTeam.teamId.toString(),
            away_team_periods: [],
            away_team_score: awayTeam.score,
            home_team_id: homeTeam.teamId.toString(),
            home_team_periods: [],
            home_team_score: homeTeam.score,
            start_time: game.gameDateTimeUTC,
          };
        })
    );

    return games;
  }
}
