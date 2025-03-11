import { NbaGameRepository } from '@/domain/repositories/NbaGameRepository';
import { ScheduledGameDto } from './dto/ScheduledGameDto';
import { TeamRepository } from '@/domain/repositories/TeamRepository';
import GameStatus from '@/types/game-status';
import { convertGameStatus, convertUTCtoKST } from '@/utils';

export const readTodayGameListUsecase = async (
  externalRepository: NbaGameRepository,
  teamRepository: TeamRepository
): Promise<ScheduledGameDto[]> => {
  const games = await externalRepository.findTodayGame();

  const scheduledGameDtos: ScheduledGameDto[] = await Promise.all(
    games.map(async (game) => {
      const gameStatus = convertGameStatus(game.status);
      const { startTimeKST } = convertUTCtoKST(game.startTime);

      const parts = startTimeKST.split(' ');
      const datePart = parts.slice(0, 3).join(' '); // 날짜 부분
      const timePart = parts.slice(3).join(' '); // 시간 부분

      const homeTeam = await teamRepository.findById(game.homeTeamId);
      if (!homeTeam) {
        throw new Error(`홈팀(${game.homeTeamId}) 정보가 없습니다.`);
      }

      const awayTeam = await teamRepository.findById(game.awayTeamId);
      if (!awayTeam) {
        throw new Error(`어웨이팀(${game.awayTeamId}) 정보가 없습니다.`);
      }

      return {
        gameId: game.id,
        gameStatus: gameStatus as GameStatus,
        startTime: {
          date: datePart,
          time: timePart,
        },
        teams: {
          homeTeam: {
            name: homeTeam.name,
            logoSrc: homeTeam.logo,
            score: game.homeTeamScore,
            isWinner: game.homeTeamScore > game.awayTeamScore,
          },
          awayTeam: {
            name: awayTeam.name,
            logoSrc: awayTeam.logo,
            score: game.awayTeamScore,
            isWinner: game.awayTeamScore > game.homeTeamScore,
          },
        },
      };
    })
  );

  return scheduledGameDtos;
};
