import { GameRepository } from '@/domain/repositories/GameRepository';
import { ScheduledGameCountDto } from './dto/ScheduledGameCountDto';

export const readScheduledGameCountListUsecase = async (
  gameRepository: GameRepository,
  year: number,
  month: number
): Promise<ScheduledGameCountDto[]> => {
  const scheduledGameCountDtos: ScheduledGameCountDto[] =
    await gameRepository.countByDate(year, month);

  return scheduledGameCountDtos;
};
