import { GameRepository } from '@/domain/repositories/GameRepository';
import { ScheduledGameCountDto } from './dto/ScheduledGameCountDto';

export const readScheduledGameCountListUsecase = async (
  gameRepository: GameRepository
): Promise<ScheduledGameCountDto[]> => {
  const scheduledGameCountDtos: ScheduledGameCountDto[] =
    await gameRepository.countByDate();

  return scheduledGameCountDtos;
};
