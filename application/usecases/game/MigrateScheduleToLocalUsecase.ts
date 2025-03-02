import { DfGameRepository } from '@/infrastructure/repositories/DfGameRepository';
import { NbaOfficialGameRpository } from '@/infrastructure/repositories/NbaOfficialGameRepository';

export const migrateScheduleToLocalUsecase = async (
  externalRepository: NbaOfficialGameRpository,
  localRepository: DfGameRepository
): Promise<void> => {
  const games = await externalRepository.findAll();
  await localRepository.saveGames(games);
};
