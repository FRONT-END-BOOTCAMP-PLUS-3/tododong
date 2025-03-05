import { TeamRepository } from '@/domain/repositories/TeamRepository';
import { GameRepository } from '@/domain/repositories/GameRepository';
import { EventDto, PlaybyplayDto } from './dto/PlaybyplayDto';
import { PlaybyplayRepository } from '@/domain/repositories/PlaybyPlayRepository';

export const readPlaybyplayUsecase = async (
  gameId: string,
  gameRepository: GameRepository,
  teamRepository: TeamRepository,
  playbyplayRepository: PlaybyplayRepository
): Promise<PlaybyplayDto> => {
  try {
    const playbyplay = await playbyplayRepository.findById(gameId);
    const events: EventDto[][] = new Array(4).fill(null).map(() => []);

    playbyplay.forEach((item: EventDto) => {
      const index = item.period - 1;

      events[index].push(item);
    });

    const game = await gameRepository.findById(gameId);
    if (!game) {
      throw new Error(`게임(${gameId}) 정보가 없습니다.`);
    }

    const homeTeam = await teamRepository.findById(game.homeTeamId);
    if (!homeTeam) {
      throw new Error(`홈팀(${game.homeTeamId}) 정보가 없습니다.`);
    }
    const awayTeam = await teamRepository.findById(game.awayTeamId);
    if (!awayTeam) {
      throw new Error(`어웨이팀(${game.awayTeamId}) 정보가 없습니다.`);
    }

    return {
      game: { gameId, date: game.status, status: game.status, events },
      homeTeam,
      awayTeam,
    };
  } catch (error) {
    console.error(error);
    throw new Error('에러 발생');
  }
};
