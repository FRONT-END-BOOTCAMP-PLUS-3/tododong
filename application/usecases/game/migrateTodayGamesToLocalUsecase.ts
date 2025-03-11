import { DfGameRepository } from '@/infrastructure/repositories/DfGameRepository';
import { NbaOfficialGameRpository } from '@/infrastructure/repositories/NbaOfficialGameRepository';

export const migrateTodayGamesToLocalUsecase = async (
  externalRepository: NbaOfficialGameRpository,
  localRepository: DfGameRepository
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
