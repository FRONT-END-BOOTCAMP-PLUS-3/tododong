//import { ScheduledGameDto } from './dto/ScheduledGameDto';
import { GameRepository } from '@/domain/repositories/GameRepository';
import { NbaGameRepository } from '@/domain/repositories/NbaGameRepository';
import { TeamRepository } from '@/domain/repositories/TeamRepository';
import { GameDetailDto } from './dto/gameDetailDto';
import GameStatus from '@/types/game-status';

export const getGameDetailUsecase = async (
  internalRepository: GameRepository,
  externalRepository: NbaGameRepository,
  teamRepository: TeamRepository,
  gameId: string
): Promise<GameDetailDto> => {
  // 외부 db 가져오기 전에 우리 db에서 gameId로  게임 정보 찾기
  // status === live가 아니면 -> 우리 db에서 가져온 것 그대로 사용, live면 밑에 external 사용
  let game = await internalRepository.findById(gameId);
  if (!game) {
    throw new Error(`게임(${gameId}) 정보가 없습니다.`);
  }

  if (game.status === 'live')
    game = await externalRepository.findGameDetailById(gameId);

  const parts = game.startTime.split(' ');
  const datePart = parts.slice(0, 3).join(' '); // 날짜 부분
  const timePart = parts.slice(3).join(' '); // 시간 부분

  const [homeTeam, awayTeam] = await Promise.all([
    teamRepository.findById(game.homeTeamId),
    teamRepository.findById(game.awayTeamId),
  ]);

  if (!homeTeam) {
    throw new Error(`홈팀(${game.homeTeamId}) 정보가 없습니다.`);
  }

  if (!awayTeam) {
    throw new Error(`어웨이팀(${game.awayTeamId}) 정보가 없습니다.`);
  }

  const gameDetailDto: GameDetailDto = {
    gameId: game.id,
    gameStatus: game.status as GameStatus,
    arenaName: game.arenaName,
    startTime: {
      date: datePart,
      time: timePart,
    },
    teams: {
      homeTeam: {
        name: homeTeam.name,
        code: homeTeam.code,
        logoSrc: homeTeam.logo,
        score: game.homeTeamScore,
        isWinner: game.homeTeamScore > game.awayTeamScore,
        periods: game.homeTeamPeriods,
      },
      awayTeam: {
        name: awayTeam.name,
        code: awayTeam.code,
        logoSrc: awayTeam.logo,
        score: game.awayTeamScore,
        isWinner: game.awayTeamScore > game.homeTeamScore,
        periods: game.awayTeamPeriods,
      },
    },
  };

  return gameDetailDto;
};
