import { GameRepository } from '@/domain/repositories/GameRepository';
import { NbaGameRepository } from '@/domain/repositories/NbaGameRepository';
import { convertGameStatus } from '@/utils';

export const migrateTodayGamesToLocalUsecase = async (
  externalRepository: NbaGameRepository,
  localRepository: GameRepository
): Promise<void> => {
  const games = await externalRepository.findTodayGame();

  // status 문자열로 변환
  const processedGames = games.map((game) => {
    const gameStatus = convertGameStatus(game.status);

    return {
      ...game,
      status: gameStatus,
    };
  });

  await localRepository.updateTodayGames(processedGames);
};
