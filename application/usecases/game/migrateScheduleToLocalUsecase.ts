import { GameRepository } from '@/domain/repositories/GameRepository';
import { NbaGameRepository } from '@/domain/repositories/NbaGameRepository';
import { convertGameStatus, convertUTCtoKST } from '@/utils';

export const migrateScheduleToLocalUsecase = async (
  externalRepository: NbaGameRepository,
  localRepository: GameRepository
): Promise<void> => {
  const games = await externalRepository.findAll();

  // 경기시간 오름차순 정랼
  games.sort((a, b) => {
    const dateA = new Date(a.startTime);
    const dateB = new Date(b.startTime);

    return dateA.getTime() - dateB.getTime(); // 오름차순 정렬
  });

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
