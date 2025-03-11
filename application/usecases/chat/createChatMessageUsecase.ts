import { MessageRepository } from '@/domain/repositories/MessageRepository';
import { CreateMessageDto } from './dto/createMessageDto';

export const createMessageUsecase = async (
  repository: MessageRepository,
  message: CreateMessageDto
): Promise<void> => {
  repository.createMessage({
    id: 0,
    gameId: message.gameId,
    userId: message.userId,
    message: message.message,
    createdAt: new Date(),
  });
};
