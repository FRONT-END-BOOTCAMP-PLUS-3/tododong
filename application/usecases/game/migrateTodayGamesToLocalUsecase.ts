import { GameRepository } from '@/domain/repositories/GameRepository';
import { NbaGameRepository } from '@/domain/repositories/NbaGameRepository';

export const migrateTodayGamesToLocalUsecase = async (
  externalRepository: NbaGameRepository,
  localRepository: GameRepository
): Promise<void> => {
  const games = await externalRepository.findTodayGame();

  // status 문자열로 변환
  const processedGames = games.map((game) => {
    let gameStatus = '';

    switch (game.status) {
      case '1':
        gameStatus = 'scheduled';
        break;

      case '2':
        gameStatus = 'live';
        break;

      case '3':
        gameStatus = 'final';
        break;

      default:
        break;
    }

    return {
      ...game,
      status: gameStatus,
    };
  });

  await localRepository.updateTodayGames(processedGames);
};
