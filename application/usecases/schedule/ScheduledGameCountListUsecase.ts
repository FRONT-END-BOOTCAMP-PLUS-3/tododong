import { DfGameRepository } from '@/infrastructure/repositories/DfGameRepository';
import { ScheduledGameCountDto } from './dto/ScheduledGameCountDto';

export const ScheduledGameCountListUsecase = async (
  gameRepository: DfGameRepository
): Promise<ScheduledGameCountDto[]> => {
  const games = await gameRepository.findAll();

  const gameCountByDate = games.reduce<Record<string, number>>((acc, game) => {
    acc[game.date] = (acc[game.date] || 0) + 1;
    return acc;
  }, {});

  const scheduledGameCountDtos: ScheduledGameCountDto[] = Object.entries(
    gameCountByDate
  ).map(([date, gameCount]) => ({
    date,
    gameCount,
  }));

  return scheduledGameCountDtos;
};
