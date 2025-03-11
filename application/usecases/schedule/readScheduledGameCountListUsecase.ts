import { PrGameRepository } from '@/infrastructure/repositories/prisma/PrGameRepository';
import { ScheduledGameCountDto } from './dto/ScheduledGameCountDto';

export const readScheduledGameCountListUsecase = async (
  gameRepository: PrGameRepository
): Promise<ScheduledGameCountDto[]> => {
  const scheduledGameCountDtos: ScheduledGameCountDto[] =
    await gameRepository.countByDate();

  return scheduledGameCountDtos;
};
