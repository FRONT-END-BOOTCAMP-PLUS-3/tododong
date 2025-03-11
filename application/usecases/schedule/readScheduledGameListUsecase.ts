import { GameRepository } from '@/domain/repositories/GameRepository';
import { TeamRepository } from '@/domain/repositories/TeamRepository';
import { ScheduledGameDto } from './dto/ScheduledGameDto';
import GameStatus from '@/types/game-status';

export const readScheduledGameListUsecase = async (
  date: string,
  gameRepository: GameRepository,
  teamRepository: TeamRepository
): Promise<ScheduledGameDto[]> => {
  const games = await gameRepository.findByDate(date);

  const scheduledGameDtos: ScheduledGameDto[] = await Promise.all(
    games.map(async (game) => {
      const parts = game.startTime.split(' ');
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
        gameStatus: game.status as GameStatus,
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
