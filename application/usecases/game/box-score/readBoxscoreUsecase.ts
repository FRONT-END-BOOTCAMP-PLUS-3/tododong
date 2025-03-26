import { StatisticsRepository } from '@/domain/repositories/StatisticsRepository';
import { BoxscoreDto } from './dto/boxscoreDto';
import { Statistics } from '@/domain/entities/Statistics';
import { TeamRepository } from '@/domain/repositories/TeamRepository';
import { GameRepository } from '@/domain/repositories/GameRepository';
import convertKSTtoTime from '@/utils/convertKSTtoTimestamp';

const extractMinAndSecFromText = (str: string) => {
  const match = str.match(/PT(\d+)M(\d+)(?:\.\d+)?S/);

  if (match) {
    return `${match[1]}:${match[2]}`;
  }

  return null;
};

const mapPlayerStatistics = (player: Statistics) => ({
  name: player.name,
  points: player.points,
  minutes: extractMinAndSecFromText(player.minutes!),
  fieldGoalsMade: player.fieldGoalsMade,
  fieldGoalsAttempted: player.fieldGoalsAttempted,
  fieldGoalsPercentage: parseFloat(
    (player.fieldGoalsPercentage * 100).toFixed(1)
  ),
  freeThrowsMade: player.freeThrowsMade,
  freeThrowsAttempted: player.freeThrowsAttempted,
  freeThrowsPercentage: parseFloat(
    (player.freeThrowsPercentage * 100).toFixed(1)
  ),
  threePointersMade: player.threePointersMade,
  threePointersAttempted: player.threePointersAttempted,
  threePointersPercentage: parseFloat(
    (player.threePointersPercentage * 100).toFixed(1)
  ),
  reboundsDefensive: player.reboundsDefensive,
  reboundsOffensive: player.reboundsOffensive,
  reboundsTotal: player.reboundsTotal,
  assists: player.assists,
  fouls: player.foulsPersonal,
  steals: player.steals,
  turnovers: player.turnovers,
  blocks: player.blocks,
  plusMinus: player.plusMinusPoints,
});

export const readBoxscoreUsecase = async (
  gameId: string,
  gameRepository: GameRepository,
  teamRepository: TeamRepository,
  statisticsRepository: StatisticsRepository
): Promise<BoxscoreDto> => {
  try {
    const game = await gameRepository.findById(gameId);

    if (!game) {
      throw new Error(`게임(${gameId}) 정보가 없습니다.`);
    }

    const currentTime = new Date().getTime();
    const gameStartTime = convertKSTtoTime(game.startTime);
    const threeHoursLater = gameStartTime + 3 * 60 * 60 * 1000;

    if (currentTime >= threeHoursLater) {
      game.status = 'final';
    } else if (currentTime >= gameStartTime) {
      game.status = 'live';
    }

    const homeTeamId = game.homeTeamId;
    const awayTeamId = game.awayTeamId;

    const homeTeam = await teamRepository.findById(homeTeamId);
    if (!homeTeam) {
      throw new Error(`홈팀(${homeTeamId}) 정보가 없습니다.`);
    }

    const awayTeam = await teamRepository.findById(awayTeamId);
    if (!awayTeam) {
      throw new Error(`어웨이팀(${awayTeamId}) 정보가 없습니다.`);
    }

    if (game.status === 'scheduled')
      return {
        game: {
          id: game.id,
          status: game.status,
        },
        homeTeam: {
          id: homeTeam.id,
          name: homeTeam.name,
          city: homeTeam.city,
          logo: homeTeam.logo,
          players: [],
        },
        awayTeam: {
          id: awayTeam.id,
          name: awayTeam.name,
          city: awayTeam.city,
          logo: awayTeam.logo,
          players: [],
        },
      };

    const statistics = await statisticsRepository.findById(gameId);
    if (!statistics || statistics.length === 0) {
      throw new Error('게임 통계 정보를 찾을 수 없습니다.');
    }

    const homePlayers = statistics
      .filter((player) => player.teamId === homeTeamId)
      .map(mapPlayerStatistics);

    const awayPlayers = statistics
      .filter((player) => player.teamId === awayTeamId)
      .map(mapPlayerStatistics);

    return {
      game: {
        id: game.id,
        status: game.status,
      },
      homeTeam: {
        id: homeTeam.id,
        name: homeTeam.name,
        city: homeTeam.city,
        logo: homeTeam.logo,
        players: homePlayers,
      },
      awayTeam: {
        id: awayTeam.id,
        name: awayTeam.name,
        city: awayTeam.city,
        logo: awayTeam.logo,
        players: awayPlayers,
      },
    };
  } catch (error) {
    console.error(error);
    throw new Error('에러 발생');
  }
};
