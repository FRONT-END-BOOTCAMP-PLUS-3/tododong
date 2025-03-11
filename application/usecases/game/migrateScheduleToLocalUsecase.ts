import { GameRepository } from '@/domain/repositories/GameRepository';
import { NbaGameRepository } from '@/domain/repositories/NbaGameRepository';
import { convertGameStatus, convertUTCtoKST } from '@/utils';

export const migrateScheduleToLocalUsecase = async (
  externalRepository: NbaGameRepository,
  localRepository: GameRepository
): Promise<void> => {
  const games = await externalRepository.findAll();

  const processedGames = games.map((game) => {
    // status 변환
    const gameStatus = convertGameStatus(game.status);
    // UTC → KST 변환
    const { dateKST, startTimeKST } = convertUTCtoKST(game.startTime);

    return {
      ...game,
      status: gameStatus,
      startTime: startTimeKST,
      date: dateKST, // 날짜 필드 추가
    };
  });

  await localRepository.saveGames(processedGames);
};
